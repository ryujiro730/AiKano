#!/usr/bin/env python3
"""
キャラ写真の自動生成（OpenAI 画像 API）。作る → 点検 → だめなら作り直す → 登録 までを1本で行う。

  # アイテム写真（贈ったときに届く「そのアイテムを持った写真」）を作り直す
  .venv/bin/python factory.py items --chars aoi,eri
  # プレミアム写真（会員限定アルバム）を各キャラ30枚
  # 普通のアルバム（ちょっとセクシー。ガチャ・チャットで届く）を各キャラ20枚
  .venv/bin/python factory.py album --chars all --n 20
  .venv/bin/python factory.py premium --chars all --n 30
  # 作るだけで登録しない（点検結果と一覧画像は出る）
  ... --dry

点検（全部通ったものだけ登録する。だめなら最大 RETRIES 回作り直す）
  - 顔: アイコンとの ArcFace コサイン類似度 >= FACE_MIN（別人になっていないか）。人物は1人だけ
  - 露出: NudeNet で胸・局部・お尻の露出が出たら不合格（Stripe の規約）
  - 中身: 画像を読める GPT に「同じ人物か・アイテムがはっきり写っているか・指や手の崩れ・文字の混入」を判定させる
OpenAI の安全審査で断られたら、服・ポーズを控えめにして作り直す（水着・下着はほぼ通らない）。

出力: /mnt/data/photo_factory/<run>/<slug>/<kind>/*.png と manifest.jsonl（お題・使った量・点検結果）、一覧画像 sheet_<slug>.jpg
登録: アイテム写真は Storage の item-photos/<character_id>/<item_id>-g<n>.webp に上げて character_item_photos の url を差し替える
      （同じパスに上書きすると、ブラウザと /_next/image の7日キャッシュで古い写真が出続けるため、毎回別のファイル名にする）
      プレミアム写真は char-photos/<character_id>/premium/<n>.webp に上げて character_photos に会員限定で足す
環境変数: OPENAI_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY（リポジトリの .env.local から読む）
"""
import argparse, base64, io, json, os, random, re, sys, threading, time, urllib.error, urllib.parse, urllib.request, uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parents[2]
OUT_ROOT = Path('/mnt/data/photo_factory')
ITEMS_JSON = Path('/mnt/data/vast_job/items.json')   # アイテムごとの持ち方・場面・服（Z-Image のときに作ったもの）

IMAGE_MODEL = 'gpt-image-2.6-flare'
VISION_MODEL = 'gpt-5.4-mini'
FACE_MIN = 0.35
RETRIES = 3
WORKERS = int(os.environ.get('PF_WORKERS', '4'))
# 料金（ドル/100万トークン）。gpt-image-2.6: 画像入力 8・テキスト入力 5・画像出力 30
PRICE = {'image_in': 8, 'text_in': 5, 'image_out': 30}


def load_env():
    for line in (REPO / '.env.local').read_text().splitlines():
        m = re.match(r'^([A-Z0-9_]+)=(.*)$', line.strip())
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip('"')


load_env()
KEY = os.environ['OPENAI_API_KEY']
SB = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SK = os.environ['SUPABASE_SERVICE_ROLE_KEY']

# キャラ設定（年齢・雰囲気・住まい）。DB の名前で引く
CHARS = {
    'aoi':     dict(name='あおい', mood='sexy', vibe='21-year-old japanese woman, playful and confident', place='a breezy seaside apartment with bright summer light'),
    'rin':     dict(name='リン【AI歴2カ月】', mood='cute', vibe='18-year-old japanese woman, naive and innocent country girl', place='an old rustic japanese countryside house'),
    'iroha':   dict(name='Iroha', mood='cute', vibe='21-year-old japanese woman, a cheerful and friendly college student', place='a trendy small Tokyo apartment'),
    'eri':     dict(name='岸本絵理', mood='sexy', vibe='35-year-old elegant woman, mature and confident company president', place='a luxury high-rise penthouse with a city view'),
    'yuna':    dict(name='ユナ', mood='cute', vibe='21-year-old japanese woman, cute and bubbly', place='a colorful cute room full of small decorations'),
    'natsuki': dict(name='なつき', mood='cute', vibe='20-year-old japanese woman, sunny and innocent country girl who loves summer', place='an old japanese countryside house surrounded by rice fields in summer'),
    'meilin':  dict(name='メイリン', mood='sexy', vibe='24-year-old chinese woman living in Tokyo, playful and cheerful', place='a stylish small Tokyo apartment with plants'),
    'iori':    dict(name='華僑イオリ', mood='sexy', vibe='31-year-old glamorous half-korean woman, worldly and elegant', place='a glamorous hotel suite with warm evening light'),
    'momo':    dict(name='もも', mood='cute', vibe='22-year-old japanese woman, a gentle young nurse', place='a cozy small apartment in Tokyo'),
}
# アイテム写真をもう GPT で作ってあるキャラ（items では作り直さない）。もものは ComfyUI 製だったので作り直す
ITEMS_DONE = {'natsuki'}

# 表情・構図は毎回ばらす（同じ笑顔の自撮りばかりになっていた）
EXPRESSIONS = {
    'cute': ['laughing with her mouth open and eyes squeezed shut', 'a surprised delighted face with wide eyes and an open mouth',
             'a cute pout with puffed cheeks', 'eyes closed, savoring the moment blissfully', 'a shy smile looking away from the camera',
             'a playful wink with her tongue slightly out', 'a big toothy grin', 'a sleepy relaxed smile', 'a mischievous grin',
             'a touched, slightly teary happy smile'],
    'sexy': ['laughing with her head tilted back', 'a playful smirk with one eyebrow raised', 'eyes closed, savoring the moment',
             'a confident grin', 'a teasing pout', 'a playful wink', 'a soft smile looking away from the camera', 'a surprised delighted face',
             'a relaxed calm smile', 'a mischievous grin'],
}
COMPOSITIONS = [
    'a selfie taken with her arm extended', 'taken by her boyfriend from across the table', 'a half-body shot taken by a friend',
    'a full-body shot', 'a candid shot while she is not looking at the camera', 'a close-up shot from slightly above',
    'a shot from a low angle', 'a mirror-free candid snapshot mid-action', 'a shot with the item in the foreground and her slightly behind it',
]
LIGHT = ['soft window light', 'warm golden hour light', 'warm lamp light at night', 'bright natural daylight', 'warm candlelight with bokeh']

# プレミアム写真（会員限定）。審査に通る範囲で色っぽく。断られたら mild に差し替える
# 会員限定の「特別感のある」写真。ベッド・下着・スリップドレス・肌の多い服は OpenAI の審査でほぼ断られるので入れない
PREMIUM = [
    ('an elegant navy evening dress', 'at a fancy restaurant with a night view, raising a glass of champagne'),
    ('a summer yukata with a floral pattern', 'at a summer festival at night with lanterns, holding a paper fan'),
    ('a white sundress and a straw hat', 'in a sunflower field in summer'),
    ('a cozy beige coat and a scarf', 'under christmas illumination at night, her breath visible in the cold'),
    ('a cute knit sweater', 'at a cafe by the window on a rainy day, holding a latte with both hands'),
    ('a floral blouse and a skirt', 'on a date at an aquarium, blue light from the big tank'),
    ('a casual t-shirt and denim', 'at an amusement park holding cotton candy, ferris wheel behind her'),
    ('a cardigan and a long skirt', 'walking among cherry blossoms in spring, petals falling'),
    ('a turtleneck sweater', 'on an autumn street with red and yellow leaves'),
    ('a stylish trench coat', 'on a Tokyo street at dusk, looking back over her shoulder'),
    ('an onsen inn yukata with a haori jacket', 'at a traditional japanese inn, sitting by the window with a cup of green tea'),
    ('a sparkly party dress', 'at a birthday party with balloons, holding a slice of cake'),
    ('a cute apron over a blouse', 'baking cookies in a sunny kitchen, flour on her cheek'),
    ('a sporty windbreaker', 'at a beach at sunset, wind in her hair'),
    ('a chic black blouse', 'at a jazz bar, sitting at the counter with a cocktail'),
    ('a hoodie and a beanie', 'at a ski resort with snow falling, holding hot cocoa'),
    ('a linen shirt dress', 'in a flower shop, holding a bouquet'),
    ('a cute raincoat', 'with a clear umbrella on a rainy street with neon reflections'),
    ('a kimono', 'visiting a shrine at new year, holding an omikuji fortune'),
    ('a cozy loungewear set', 'on a sofa in her room watching a movie with popcorn'),
    ('a blazer and a pleated skirt', 'in a bookstore cafe, peeking over a book'),
    ('a summer camisole dress with a cardigan', 'at a seaside cafe terrace with a sea view'),
    ('a fluffy white sweater', 'decorating a christmas tree with fairy lights'),
    ('a denim jacket', 'at a music festival, smiling at the crowd'),
    ('a stylish one-piece dress', 'on a ferris wheel at night, city lights behind her'),
    ('a cozy knit and a beret', 'at an art museum, looking at paintings'),
    ('a sporty outfit', 'at a bowling alley, celebrating a strike'),
    ('a cute dress', 'at a photo booth style studio with a pastel background'),
    ('a warm coat', 'at a winter night market holding a cup of hot wine'),
    ('a casual dress', 'on a train window seat, looking outside at the countryside'),
]
# 普通のアルバム（ガチャ・チャットで届く写真）用の「ちょっとセクシー」。水着・下着・ベッドの上は OpenAI の審査でほぼ断られるので入れない。
# 断られたら2つ目（控えめ）に下げる
ALBUM = [
    (('an off-shoulder knit sweater showing her bare shoulders and collarbone', 'sitting on a sofa by the window, looking back over her shoulder'), 'a cozy knit sweater'),
    (('a fitted camisole dress with thin straps', 'on a rooftop terrace at night with city lights, hair blowing in the wind'), 'a summer dress'),
    (('a tight ribbed mini dress', 'leaning against a wall in a stylish hallway, one hand in her hair'), 'a stylish dress'),
    (('a white hotel bathrobe, hair still damp after a shower', 'drying her hair with a towel by a big window, morning light'), 'a cozy hoodie'),
    (('a crop top and high-waisted shorts showing her waist', 'at a summer festival at dusk holding a shaved ice'), 'a t-shirt and shorts'),
    (('an oversized shirt slipping off one shoulder, bare legs', 'sitting on the floor of her room with a cup of coffee, sleepy morning'), 'an oversized shirt and leggings'),
    (('a backless summer dress', 'on a beach boardwalk at sunset, looking back at the camera'), 'a summer dress'),
    (('a fitted tank top and yoga leggings', 'stretching in her bright room after a workout, a little sweaty'), 'a sporty outfit'),
    (('a satin slip dress under an open cardigan', 'sitting at a bar counter with soft warm lights'), 'a blouse and a skirt'),
    (('a loose summer yukata slightly off her shoulders', 'on a veranda at night with fireworks in the sky'), 'a summer yukata'),
    (('a short pleated skirt and a fitted knit top', 'sitting on a park bench in autumn, legs crossed'), 'a knit top and a long skirt'),
    (('a fitted sundress with a low neckline', 'in a sunflower field, bending toward the camera with a playful smile'), 'a sundress'),
    (('a cropped cardigan with nothing but a camisole underneath', 'lying on her stomach on a picnic blanket in the park, chin in her hands'), 'a cardigan'),
    (('denim shorts and a tied-up shirt showing her waist', 'washing a car in the summer sun, splashing water'), 'a t-shirt and denim'),
    (('a silky blouse unbuttoned at the collar', 'at a cafe terrace at night, leaning toward the camera with her chin on her hand'), 'a blouse'),
    (('a fitted turtleneck dress', 'in front of a christmas illumination, wrapping her arms around herself in the cold'), 'a warm coat'),
    (('a mini dress and knee-high boots', 'walking down a neon-lit street at night, glancing back'), 'a dress and a coat'),
    (('a soft lounge set with a short camisole top', 'curled up on a sofa under fairy lights, watching a movie'), 'a cozy loungewear set'),
    (('a light summer dress blowing in the wind', 'on a hill with a big blue sky, holding her hat'), 'a summer dress'),
    (('an off-shoulder blouse', 'at an aquarium, blue light on her face, looking up at the fish'), 'a blouse'),
    (('a fitted dress with a side slit', 'at a hotel lobby at night, sitting with her legs crossed'), 'an elegant dress'),
    (('a tank top and a short skirt', 'eating ice cream on a hot summer street, melting a little'), 'a t-shirt and a skirt'),
]
MILD_OUTFIT = 'a cute casual outfit'
# アイテム写真の服（Z-Image のときの items.json の服は下着・彼シャツなどが多く、審査で断られるので使わない）
ITEM_OUTFITS = ['a white blouse', 'a cute knit sweater', 'a casual t-shirt and denim', 'a floral sundress', 'a cardigan over a simple dress',
                'a hoodie', 'a striped shirt', 'a stylish one-piece dress', 'a cozy fleece pajama set', 'a linen shirt and a skirt']
# items.json の場面・服のうち、OpenAI の審査に引っかかりやすい言葉の言い換え（場面そのものは残して変化をつける）
SOFTEN = [
    (r'\bagainst her lips\b|\bat her lips\b|\bto her lips\b', 'up to her mouth'), (r'\bbetween her lips\b', 'in her hand'),
    (r'\blicking\b', 'eating'), (r'\bblowing a kiss over\b', 'smiling over'), (r'\bblowing a kiss\b', 'waving'),
    (r'breakfast in bed', 'breakfast at a sunny table'), (r'\bin bed\b', 'on a sofa'), (r'neon-lit bedroom', 'neon-lit living room'),
    (r'\bbedroom\b', 'living room'), (r'white hotel sheets', 'a sunny hotel lounge'), (r'\bpoolside\b', 'at a summer park'),
]
RISKY_OUTFIT = re.compile(r'\b(lingerie|bikini|swim\w*|bra|bralette|camisole|slip|panties|lace|garter|corset|bodysuit|robe|towel|boyfriend|tube top|micro|crop|negligee|babydoll|bare)\b', re.I)


def soften(text):
    for pat, rep in SOFTEN:
        text = re.sub(pat, rep, text, flags=re.I)
    return text


# ---------------------------------------------------------------- Supabase
def sb(path, data=None, method='GET', headers=None):
    h = {'Authorization': f'Bearer {SK}', 'apikey': SK, **(headers or {})}
    r = urllib.request.Request(f'{SB}{path}', data=data, method=method, headers=h)
    body = urllib.request.urlopen(r, timeout=120).read()
    return json.loads(body) if method == 'GET' else body


def fetch_image(url):
    if url.startswith('/'):
        url = 'https://aikano.chat' + url
    return Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=120).read()))


# ---------------------------------------------------------------- OpenAI
class Rejected(Exception):
    pass


def gen_image(prompt, refs):
    b = '----pf' + uuid.uuid4().hex
    f = lambda n, v: f'--{b}\r\nContent-Disposition: form-data; name="{n}"\r\n\r\n{v}\r\n'.encode()
    body = f('model', IMAGE_MODEL) + f('prompt', prompt) + f('size', '1024x1536') + f('quality', 'high') + f('n', '1') + f('moderation', 'low')
    for name, png in refs:
        mime = 'image/jpeg' if name.endswith('.jpg') else 'image/png'
        body += f'--{b}\r\nContent-Disposition: form-data; name="image[]"; filename="{name}"\r\nContent-Type: {mime}\r\n\r\n'.encode() + png + b'\r\n'
    body += f'--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.openai.com/v1/images/edits', data=body,
                                 headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    for attempt in range(4):
        try:
            res = json.load(urllib.request.urlopen(req, timeout=600))
            return base64.b64decode(res['data'][0]['b64_json']), res.get('usage') or {}
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:500]
            if e.code == 400 and 'safety' in msg:
                raise Rejected(msg)
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(20 * (attempt + 1)); continue
            raise RuntimeError(f'HTTP {e.code} {msg}')
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 3:
                time.sleep(15); continue
            raise


def cost_usd(u):
    d = u.get('input_tokens_details') or {}
    return (d.get('image_tokens', 0) * PRICE['image_in'] + d.get('text_tokens', 0) * PRICE['text_in']
            + u.get('output_tokens', 0) * PRICE['image_out']) / 1e6


def vision_check(png, ref_png, item_desc):
    """同じ人物か・アイテムが写っているか・崩れ・文字を GPT に判定させる"""
    def url(p):
        im = Image.open(io.BytesIO(p)).convert('RGB'); im.thumbnail((1024, 1024))
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=85)
        return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    ask = ('Image 1 is a reference photo of a woman. Image 2 is a newly generated photo. Answer in JSON only with keys: '
           '"same_person" (true if image 2 plausibly shows the same woman), '
           '"one_person" (true if exactly one person is visible), '
           '"hands_ok" (false if there are clearly deformed hands, extra or missing fingers, or broken limbs), '
           '"no_text" (false if there is any visible text, logo or watermark), '
           + ('"item_visible" (true if she is clearly holding, wearing or showing ' + item_desc + '), ' if item_desc else '')
           + '"note" (short reason if anything is false).')
    body = json.dumps({'model': VISION_MODEL, 'response_format': {'type': 'json_object'}, 'messages': [{'role': 'user', 'content': [
        {'type': 'text', 'text': ask},
        {'type': 'image_url', 'image_url': {'url': url(ref_png), 'detail': 'low'}},
        {'type': 'image_url', 'image_url': {'url': url(png), 'detail': 'high'}},
    ]}]}).encode()
    req = urllib.request.Request('https://api.openai.com/v1/chat/completions', data=body,
                                 headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
    for attempt in range(3):
        try:
            res = json.load(urllib.request.urlopen(req, timeout=180))
            return json.loads(res['choices'][0]['message']['content'])
        except Exception:
            if attempt == 2:
                raise
            time.sleep(10)


# ---------------------------------------------------------------- 顔・露出
_lock = threading.Lock()
_face = _nude = None


def face_app():
    global _face
    if _face is None:
        from insightface.app import FaceAnalysis
        _face = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        _face.prepare(ctx_id=-1, det_size=(640, 640))
    return _face


def faces(img):
    with _lock:
        return face_app().get(np.array(img.convert('RGB'))[:, :, ::-1])


def main_emb(img):
    fs = faces(img)
    if not fs:
        return None, 0
    f = max(fs, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    return f.normed_embedding, len(fs)


NUDE_BAD = {'FEMALE_BREAST_EXPOSED', 'FEMALE_GENITALIA_EXPOSED', 'ANUS_EXPOSED', 'MALE_GENITALIA_EXPOSED', 'BUTTOCKS_EXPOSED'}


def nude_hits(path):
    global _nude
    with _lock:
        if _nude is None:
            from nudenet import NudeDetector
            _nude = NudeDetector()
        r = _nude.detect(str(path))
    return {x['class']: round(x['score'], 2) for x in r if x['class'] in NUDE_BAD and x['score'] >= 0.3}


# ---------------------------------------------------------------- キャラ・お題
def load_chars(slugs):
    out = {}
    for slug in slugs:
        c = CHARS[slug]
        row = sb(f"/rest/v1/characters?select=id,avatar_url&name=eq.{urllib.parse.quote(c['name'])}")[0]
        photos = sb(f"/rest/v1/character_photos?select=url&character_id=eq.{row['id']}&source=eq.album&members_only=eq.false&order=order_index&limit=4")
        refs = []
        for i, u in enumerate([row['avatar_url']] + [p['url'] for p in photos]):
            im = fetch_image(u).convert('RGB'); im.thumbnail((1024, 1024))
            if i > 0:
                # アルバム写真は顔と肩まで（体の露出が多い写真を渡すと OpenAI の入力審査で断られる）
                im = im.crop((0, 0, im.width, int(im.height * 0.5)))
            # JPEG で送る（PNG のままだと1回に数MB送ることになり、並べると回線の上りが詰まった）
            buf = io.BytesIO(); im.save(buf, 'JPEG', quality=90); refs.append((f'ref{i}.jpg', buf.getvalue()))
        avatar = Image.open(io.BytesIO(refs[0][1]))
        emb, _ = main_emb(avatar)
        if emb is None:
            raise SystemExit(f'{slug}: アイコンから顔が取れない')
        out[slug] = dict(**c, slug=slug, id=row['id'], refs=refs, emb=emb)
    return out


# 「素人っぽい写真」「目・鼻・唇まで同じに」のような書き方だと、OpenAI の出来上がり審査で断られやすい（2026-11-06 の試作で確認）
# 参考写真は顔のためだけに使わせる（にっこり自撮りばかりの参考写真から、表情・ポーズ・構図まで真似していた）。表情と構図は先頭に置く
BASE = ('An everyday smartphone photo of the same young woman shown in the reference photos, keeping her face and hairstyle identical. '
        'The reference photos are only for her identity: do NOT copy their pose, expression, framing or background. '
        'Her facial expression must be: {{expr}}. Do not make her smile politely at the camera. Camera: {{comp}}. She is a {vibe}. ')
TAIL = (' {light}. Only one person in the photo. Realistic photo, natural colors, sharp focus, '
        'no text, no logo, no watermark.')


def item_jobs(ch, items, item_ids):
    jobs = []
    for it in items:
        iid = item_ids.get(it['image_url'])
        if not iid:
            continue
        rnd = random.Random(f"{ch['slug']}-{it['key']}")
        scene = soften(it['scene'])
        safe = [o for o in it['outfits'] if not RISKY_OUTFIT.search(o)]
        outfits = (safe[:1] or rnd.sample(ITEM_OUTFITS, 1)) + rnd.sample(ITEM_OUTFITS, 1) + [MILD_OUTFIT]
        jobs.append(dict(kind='item', key=it['key'], item_id=iid, item_url=it['image_url'], object=it['object'], variants=[
            BASE.format(vibe=ch['vibe']) + f"Scene: {scene}. She is wearing {o}. The gift ({it['object']}, shown in the last reference image) "
            'is clearly visible in the photo.' + TAIL for o in outfits]))
    return jobs


def premium_jobs(ch, n, start):
    random.seed(f"{ch['slug']}-{start}-{time.time()}")
    picks = random.sample(PREMIUM, k=min(n, len(PREMIUM)))
    while len(picks) < n:
        picks.append(random.choice(PREMIUM))
    jobs = []
    for i, (outfit, scene) in enumerate(picks):
        jobs.append(dict(kind='premium', key=f'{start + i:03d}', variants=[
            BASE.format(vibe=ch['vibe']) + f'Scene: {scene}. She is wearing {outfit}. Special and memorable, like a photo from a date.' + TAIL,
            BASE.format(vibe=ch['vibe']) + f'Scene: {scene}. She is wearing {MILD_OUTFIT}.' + TAIL,
        ]))
    return jobs


def album_jobs(ch, n, start, kind='album'):
    random.seed(f"{ch['slug']}-{kind}-{start}-{time.time()}")
    picks = random.sample(ALBUM, k=min(n, len(ALBUM)))
    while len(picks) < n:
        picks.append(random.choice(ALBUM))
    jobs = []
    for i, ((outfit, scene), mild) in enumerate(picks):
        jobs.append(dict(kind=kind, key=f'{start + i:03d}', variants=[
            BASE.format(vibe=ch['vibe']) + f'Scene: {scene}. She is wearing {outfit}. Slightly alluring and flirty, but tasteful.' + TAIL,
            BASE.format(vibe=ch['vibe']) + f'Scene: {scene}. She is wearing {mild}.' + TAIL,
        ]))
    return jobs


# ---------------------------------------------------------------- 1枚を作って点検する
DONE = {}   # 途中で止めて同じ --run で再開したとき、合格済みのものは作り直さない


def run_job(ch, job, outdir, manifest, item_png):
    path = outdir / f"{job['key']}.png"
    prev = DONE.get((ch['slug'], job['kind'], job['key']))
    if prev and Path(prev['file']).exists():
        print(f"SKIP {ch['slug']}/{job['kind']}/{job['key']} (done)", flush=True)
        return {**prev, 'cost': 0.0}
    log = dict(slug=ch['slug'], kind=job['kind'], key=job['key'], tries=[], cost=0.0)
    variant = 0
    for attempt in range(RETRIES + 2 * len(job['variants'])):
        if variant >= len(job['variants']):
            break
        prompt = job['variants'][variant].format(expr=random.choice(EXPRESSIONS[ch['mood']]),
                                                 light=random.choice(LIGHT).capitalize(), comp=random.choice(COMPOSITIONS))
        refs = ch['refs'][:4] + ([('item.png', item_png)] if item_png else [])
        try:
            png, usage = gen_image(prompt, refs)
        except Rejected as e:
            stage = 'input' if '"input"' in str(e) else 'output'
            log['tries'].append({'variant': variant, 'result': f'safety_rejected_{stage}'})
            # 出来上がりの審査は同じお題でも通ることがあるので1回はやり直し、2回落ちたら控えめなお題へ
            same = [t for t in log['tries'] if t.get('variant') == variant and str(t.get('result', '')).startswith('safety')]
            if stage == 'input' or len(same) >= 2:
                variant += 1
            continue
        except Exception as e:
            log['tries'].append({'variant': variant, 'result': 'error', 'error': str(e)[:200]})
            continue
        log['cost'] += cost_usd(usage)
        path.write_bytes(png)
        img = Image.open(io.BytesIO(png))
        emb, n_faces = main_emb(img)
        sim = float(np.dot(emb, ch['emb'])) if emb is not None else 0.0
        nude = nude_hits(path)
        v = vision_check(png, ch['refs'][0][1], job.get('object'))
        ok = (sim >= FACE_MIN and n_faces == 1 and not nude and v.get('same_person') and v.get('one_person')
              and v.get('hands_ok') and v.get('no_text') and (v.get('item_visible', True)))
        log['tries'].append({'variant': variant, 'sim': round(sim, 3), 'faces': n_faces, 'nude': nude, 'vision': v, 'ok': bool(ok)})
        if ok:
            log.update(ok=True, file=str(path), prompt=prompt)
            break
    log.setdefault('ok', False)
    if not log['ok'] and path.exists():
        path.rename(path.with_suffix('.rejected.png'))
    with _lock:
        with open(manifest, 'a') as f:
            f.write(json.dumps(log, ensure_ascii=False) + '\n')
    mark = 'OK ' if log['ok'] else 'NG '
    print(f"{mark}{ch['slug']}/{job['kind']}/{job['key']} tries={len(log['tries'])} ${log['cost']:.3f}", flush=True)
    return log


# ---------------------------------------------------------------- 登録
def to_webp(path):
    im = Image.open(path).convert('RGB'); im.thumbnail((1184, 1184))
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=86, method=6)
    return buf.getvalue()


def upload(storage_path, data):
    sb(f'/storage/v1/object/avatars/{storage_path}', data, 'POST',
       {'Content-Type': 'image/webp', 'x-upsert': 'true', 'cache-control': 'max-age=31536000'})
    return f'{SB}/storage/v1/object/public/avatars/{storage_path}'


def register(ch, logs, run_id):
    done = 0
    oks = [l for l in logs if l.get('ok')]
    items = [l for l in oks if l['kind'] == 'item']
    for l in items:
        url = upload(f"item-photos/{ch['id']}/{l['item_id']}-{run_id}.webp", to_webp(l['file']))
        sb('/rest/v1/character_item_photos?on_conflict=character_id,item_id', json.dumps([{'character_id': ch['id'], 'item_id': l['item_id'], 'url': url, 'preview': None}]).encode(), 'POST',
           {'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=minimal'})
        done += 1
    gac = [l for l in oks if l['kind'] == 'gacha']
    if gac:
        mx = sb(f"/rest/v1/character_photos?select=order_index&character_id=eq.{ch['id']}&order=order_index.desc&limit=1")
        order = (mx[0]['order_index'] if mx else 0) + 1
        rows = []
        for l in gac:
            url = upload(f"char-photos/{ch['id']}/gacha-gpt/{run_id}-{l['key']}.webp", to_webp(l['file']))
            # ガチャ専用（チャットでキャラが送る写真には使わない）
            rows.append({'character_id': ch['id'], 'url': url, 'order_index': order, 'members_only': False, 'source': 'gacha'})
            order += 1
        sb('/rest/v1/character_photos', json.dumps(rows).encode(), 'POST', {'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
        done += len(rows)
    alb = [l for l in oks if l['kind'] == 'album']
    if alb:
        mx = sb(f"/rest/v1/character_photos?select=order_index&character_id=eq.{ch['id']}&order=order_index.desc&limit=1")
        order = (mx[0]['order_index'] if mx else 0) + 1
        rows = []
        for l in alb:
            url = upload(f"char-photos/{ch['id']}/album-gpt/{run_id}-{l['key']}.webp", to_webp(l['file']))
            # 普通のアルバム（会員限定ではない）。ガチャの中身・チャットでキャラから届く写真になる
            rows.append({'character_id': ch['id'], 'url': url, 'order_index': order, 'members_only': False, 'source': 'album'})
            order += 1
        sb('/rest/v1/character_photos', json.dumps(rows).encode(), 'POST', {'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
        done += len(rows)
    prem = [l for l in oks if l['kind'] == 'premium']
    if prem:
        mx = sb(f"/rest/v1/character_photos?select=order_index&character_id=eq.{ch['id']}&order=order_index.desc&limit=1")
        order = (mx[0]['order_index'] if mx else 0) + 1
        rows = []
        for l in prem:
            url = upload(f"char-photos/{ch['id']}/premium/{run_id}-{l['key']}.webp", to_webp(l['file']))
            rows.append({'character_id': ch['id'], 'url': url, 'order_index': order, 'members_only': True, 'source': 'album'})
            order += 1
        sb('/rest/v1/character_photos', json.dumps(rows).encode(), 'POST', {'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
        done += len(rows)
    return done


def contact_sheet(files, out):
    if not files:
        return
    cols, tw, th = 8, 200, 300
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw, rows * th), 'white')
    for i, (label, p) in enumerate(files):
        im = Image.open(p).convert('RGB'); im.thumbnail((tw - 4, th - 4))
        x, y = (i % cols) * tw, (i // cols) * th
        sheet.paste(im, (x + 2, y + 2))
        ImageDraw.Draw(sheet).text((x + 4, y + 4), label, fill='yellow')
    sheet.save(out, quality=85)


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('kind', choices=['items', 'premium', 'album', 'gacha'])
    ap.add_argument('--missing-only', action='store_true', help='items: GPT で作り直していないアイテムだけ（url に full-items / -g が無いもの）')
    ap.add_argument('--chars', default='all')
    ap.add_argument('--n', type=int, default=30, help='premium の枚数（キャラごと）')
    ap.add_argument('--only', default='', help='items: アイテムの key をカンマ区切りで（試し用）')
    ap.add_argument('--dry', action='store_true', help='登録しない')
    ap.add_argument('--run', default=time.strftime('%Y%m%d%H%M'))
    a = ap.parse_args()

    slugs = list(CHARS) if a.chars == 'all' else a.chars.split(',')
    if a.kind == 'items':
        slugs = [s for s in slugs if s not in ITEMS_DONE]
    run_dir = OUT_ROOT / a.run
    run_dir.mkdir(parents=True, exist_ok=True)
    manifest = run_dir / 'manifest.jsonl'
    if manifest.exists():
        for line in manifest.read_text().splitlines():
            d = json.loads(line)
            if d.get('ok'):
                DONE[(d['slug'], d['kind'], d['key'])] = d
    chars = load_chars(slugs)

    items = json.load(open(ITEMS_JSON))
    if a.only:
        keys = set(a.only.split(','))
        items = [i for i in items if i['key'] in keys]
    item_ids = {r['image_url']: r['id'] for r in sb('/rest/v1/items?select=id,image_url&is_active=eq.true')}
    item_pngs = {}
    for it in items:
        buf = io.BytesIO(); fetch_image(it['image_url']).convert('RGBA').save(buf, 'PNG'); item_pngs[it['image_url']] = buf.getvalue()

    total_cost = 0.0
    for slug, ch in chars.items():
        outdir = run_dir / slug / a.kind
        outdir.mkdir(parents=True, exist_ok=True)
        if a.kind == 'items':
            jobs = item_jobs(ch, items, item_ids)
            if a.missing_only:
                done_ids = {r['item_id'] for r in sb(f"/rest/v1/character_item_photos?select=item_id,url&character_id=eq.{ch['id']}&url=like.*full-items*")}
                jobs = [j for j in jobs if j['item_id'] not in done_ids]
        elif a.kind == 'gacha':
            have = sb(f"/rest/v1/character_photos?select=id&character_id=eq.{ch['id']}&url=like.*gacha-gpt*")
            jobs = album_jobs(ch, a.n, len(have), kind='gacha')
        elif a.kind == 'album':
            have = sb(f"/rest/v1/character_photos?select=id&character_id=eq.{ch['id']}&url=like.*album-gpt*")
            jobs = album_jobs(ch, a.n, len(have))
        else:
            have = sb(f"/rest/v1/character_photos?select=id&character_id=eq.{ch['id']}&url=like.*premium*")
            jobs = premium_jobs(ch, a.n, len(have))
        with ThreadPoolExecutor(WORKERS) as ex:
            logs = list(ex.map(lambda j: {**j, **run_job(ch, j, outdir, manifest, item_pngs.get(j.get('item_url')))}, jobs))
        cost = sum(l['cost'] for l in logs)
        total_cost += cost
        ok = [l for l in logs if l.get('ok')]
        contact_sheet([(l['key'][:18], l['file']) for l in ok], run_dir / f'sheet_{slug}_{a.kind}.jpg')
        registered = 0 if a.dry else register(ch, logs, a.run)
        print(f"== {slug} {a.kind}: ok {len(ok)}/{len(jobs)} registered {registered} cost ${cost:.2f}", flush=True)
    print(f'== total cost ${total_cost:.2f} (約{total_cost * 150:.0f}円)  out: {run_dir}', flush=True)


if __name__ == '__main__':
    main()

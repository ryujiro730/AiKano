-- プレゼントのお礼写真：キャラごと・アイテムごとに「そのアイテムを持っている写真」を1枚持つ。
-- アイテムを贈ると、このテーブルの写真を無料で送る（ai-reply）。無いキャラ・アイテムは従来どおり（一定額以上ならガチャ写真から1枚）。
-- 画像は Storage の avatars/item-photos/<character_id>/<item_id>.webp

CREATE TABLE IF NOT EXISTS public.character_item_photos (
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  item_id      uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  url          text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, item_id)
);
ALTER TABLE public.character_item_photos ENABLE ROW LEVEL SECURITY;  -- ポリシーなし = service role のみ（贈る前に写真が見えないように）

-- 2026-10-18 生成分（あおい・リン・Iroha・さくら・岸本絵理・ユナ・華僑イオリ × 有効なギフト61種）。画像はアップロード済み
INSERT INTO public.character_item_photos (character_id, item_id, url)
SELECT c.id, i.id, 'https://ojvqsxyqdwmficqicqmy.supabase.co/storage/v1/object/public/avatars/item-photos/' || c.id || '/' || i.id || '.webp'
FROM public.characters c
CROSS JOIN public.items i
WHERE c.id IN ('0b71228a-1cf6-4cfc-a2b7-8a11c274923a', '2b6eddcd-f6b0-43fc-874e-dde37678d9c4', '654221aa-b80f-4d41-87d2-d1b22a0259ed', '68fdef15-d1bc-4376-8186-51f678321e89', '7bdee48e-b309-4296-8311-b0c7b23607f0', 'e7326eae-c2a8-4b12-9183-0913526853b3', 'ec329557-f787-47b9-8279-389096c7e794')
  AND i.id IN (
    '01529620-9919-4875-b2a9-4e6744ebe5ec', '04237b62-6c9f-4414-9c72-32016c437d9a', '06a4396a-857e-4f58-ad4e-3139dba90f8a',
    '06b1ff79-38f1-4033-9d4f-a646a73ed653', '0fd0e3e2-6467-45a9-a002-8314fcd249c9', '151a5c01-59e8-49ff-b790-af52b036e5e1',
    '18c01efc-4ea1-408f-a206-e49832ecc070', '1ab86e92-ab60-48fa-8ead-1186e9c9ebdc', '1e257f77-8655-4f74-a8ce-1ecec3c2921c',
    '22cd2564-c7b4-4e3d-bd60-9279dcc5eb9f', '3039344f-fce7-435a-ae24-69b3a8824e5c', '33717100-fd48-4002-976a-d88f32cce223',
    '3d831bdf-60ed-49fe-9144-01a658dda871', '40c007bd-a440-444c-991a-a43c1d800b25', '4608681f-8b08-4b9e-b18e-7045296c4b85',
    '53f974da-8114-4a09-acc7-5611fb248dba', '5bc54b42-ef35-4335-b236-8060b71879e2', '651b6440-6ec1-4345-ba6c-7aab9a11829e',
    '66846dd0-adbb-46af-a29d-f27cab573382', '6b7171be-9748-4ce6-a7d4-5c6753a5033c', '6d219792-c6a9-476d-b1fd-d8b1c5d04ba8',
    '6e52f384-a89a-4317-986c-f74ce5447750', '79934d48-5977-4167-aba8-4adc70a6805c', '80cf19aa-333a-4f8e-8abe-749f0ec2990e',
    '8417d5ed-2198-4e3a-b752-6dec06c0bee4', '85e14969-17ec-424c-82e9-294f6aaff93f', '880f709f-b28e-4991-8439-e4c8e1ba6477',
    '88756079-2cf5-4917-936e-c299039d54fc', '8a7050d1-6dad-433d-8943-c41e0bbe87e1', '8a9e8c38-eca4-4cd2-9f09-c426e873805c',
    '91d1f53f-34ff-47ae-815b-47ec07323e2b', '922aadd4-54b2-4794-a909-68e7d1062ea5', '94d34b5a-69ac-4cc6-a510-ee731a26ec9a',
    '9c3e9cd5-f287-4f97-9821-6b8eac279c7f', 'a1cdac82-32f3-49d4-a174-57e426ada6be', 'a691730d-110f-4abd-b615-64819098785c',
    'b14258e6-cc72-42ba-b2e1-b81df6d62834', 'b1c986d7-988c-47ea-8cef-3e8b9004705a', 'b6f22cf9-c00f-4d79-85bb-03c6c023bfea',
    'ba1a974d-c0a4-40f8-a49d-daae2fa2a984', 'c6782eb7-9f50-483a-8799-6b67a12f66ee', 'cd3ee97b-ee24-4f4a-bc62-002b46d34451',
    'ce5826dd-7be8-4ee9-82cd-720c183b3b43', 'd08e2aee-5d2c-42d9-80bf-af2036df527c', 'd0b7df3d-78b5-4cd3-a875-85913d18a1ee',
    'd38299ab-603c-449c-aaff-4e57225f3697', 'd50e7d79-745a-451f-9335-c58aecaedbc5', 'd7b418fb-e8d8-4e07-a79f-0edc9a55b9b8',
    'da6f8ec9-8efe-4a2e-a8e6-dc44114b829a', 'dabf4b31-36ec-4048-baab-e8f5b6c8369a', 'dbe83123-ba63-4216-b360-bbc4a2db937f',
    'de0bd0cb-56c8-4e70-a131-5ea1fc6e2b59', 'e57c4858-2ee6-4b1c-85e0-10c972685d18', 'ea68825c-53b0-49bb-8e93-93e67d8556cf',
    'eaa9a6bd-2152-4f57-85ab-7fe3709a1b3a', 'eafd0d30-4f87-46c7-a814-99ead9e769a8', 'f088f40b-7ad2-4f12-93e5-bb8e7a021a26',
    'f0bd580c-a335-47fd-8abf-b49efa504e45', 'f8d891da-1dac-4191-9d71-f2cdefc0dc14', 'f9f0eea3-6aeb-4e10-ab0e-b27cc2b3900c',
    'fd3f3acc-0f17-420c-b14e-0f3d5021ff7d'
  )
ON CONFLICT (character_id, item_id) DO UPDATE SET url = EXCLUDED.url;

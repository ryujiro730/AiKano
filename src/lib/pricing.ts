/**
 * 料金・ボーナスの定数（唯一の定義元）。
 * API の付与・消費と、LP・規約などの表示は必ずここを参照する（表示と実際がズレないように）。
 */

/** 1ポイントあたりの円換算 */
export const YEN_PER_POINT = 10
/** 非会員のメッセージ送信コスト（pt/通） */
export const POINTS_PER_MESSAGE = 5
/** 新規登録ボーナス（pt） */
export const REGISTRATION_BONUS = 25
/** 友達紹介ボーナス（紹介者・被紹介者それぞれ、pt） */
export const REFERRAL_BONUS = 100
/** 毎日のログインボーナス（pt、有効期限付き） */
export const LOGIN_BONUS = 10
/** ログインボーナスの有効時間（付与から。翌日のボーナスで置き換わり、持ち越さない） */
export const LOGIN_BONUS_HOURS = 24

/** 登録ボーナスで送れる通数 */
export const FREE_MESSAGES_ON_SIGNUP = Math.floor(REGISTRATION_BONUS / POINTS_PER_MESSAGE)

/** 毎日のログインボーナスで送れる通数 */
export const FREE_MESSAGES_PER_LOGIN = Math.floor(LOGIN_BONUS / POINTS_PER_MESSAGE)

/** キャラが送る画像・アルバム写真の解錠コスト（pt/枚、会員も有料） */
export const IMAGE_UNLOCK_POINTS = 30
/** キャラが送る動画・動画販売の解錠コスト（pt/本、会員も有料） */
export const VIDEO_UNLOCK_POINTS = 50
/** 写真ガチャ（キャラごと。まだ持っていない写真から1枚。会員も有料）。写真1枚の値段はチャットの写真解錠と同じ */
export const GACHA_SINGLE_POINTS = IMAGE_UNLOCK_POINTS
/** 写真ガチャ10連（1回分おまけ） */
export const GACHA_TEN_POINTS = GACHA_SINGLE_POINTS * 9
/** この価格以上のプレゼントを贈ると、ガチャの写真が1枚無料で届く */
export const GIFT_PHOTO_MIN_ITEM_POINTS = 150

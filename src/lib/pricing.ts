/**
 * 料金・ボーナスの定数（唯一の定義元）。
 * API の付与・消費と、LP・規約などの表示は必ずここを参照する（表示と実際がズレないように）。
 */

/** 1ポイントあたりの円換算 */
export const YEN_PER_POINT = 10
/** 非会員のメッセージ送信コスト（pt/通） */
export const POINTS_PER_MESSAGE = 10
/** 新規登録ボーナス（pt） */
export const REGISTRATION_BONUS = 20
/** 友達紹介ボーナス（紹介者・被紹介者それぞれ、pt） */
export const REFERRAL_BONUS = 100
/** 毎日のログインボーナス（pt、有効期限付き） */
export const LOGIN_BONUS = 2
/** ログインボーナスの有効日数 */
export const LOGIN_BONUS_DAYS = 30

/** 登録ボーナスで送れる通数 */
export const FREE_MESSAGES_ON_SIGNUP = Math.floor(REGISTRATION_BONUS / POINTS_PER_MESSAGE)

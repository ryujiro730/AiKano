/** 既読化などでバッジ数が変わったことをフッター（BottomNavLive）に知らせる */
export const BADGES_CHANGED_EVENT = 'badgesChanged'

export function notifyBadgesChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(BADGES_CHANGED_EVENT))
}

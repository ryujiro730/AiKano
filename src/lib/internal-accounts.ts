export const INTERNAL_EMAILS = [
  'tsujiryujiro@gmail.com',
  'ryujiro101@gmail.com',
  'marshy_guitar@yahoo.co.jp',
  'tsunderegekilove765@gmail.com',
  'test@aikano.jp',
] as const

export const INTERNAL_EMAILS_SQL = `(${INTERNAL_EMAILS.map(e => `'${e}'`).join(',')})`

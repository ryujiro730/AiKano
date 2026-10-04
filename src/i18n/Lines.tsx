import { Fragment } from 'react'

/** 翻訳文中の \n を改行として表示する */
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return <>{parts.map((p, i) => <Fragment key={i}>{p}{i < parts.length - 1 && <br />}</Fragment>)}</>
}

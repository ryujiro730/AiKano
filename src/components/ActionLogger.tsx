'use client'

import { useEffect } from 'react'
import { logAction, ActionType } from '@/lib/action-log'

export function ActionLogger({
  actionType,
  metadata,
}: {
  actionType: ActionType
  metadata?: Record<string, unknown>
}) {
  useEffect(() => {
    logAction(actionType, { metadata })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

import { useEffect, useRef, useState } from 'react'
import {
  clearPendingQuickAction,
  getPendingQuickAction,
  type QuickAction,
} from '../lib/quickAction'

type RunnerOptions = {
  ready: boolean
  isSleeping: boolean
  startSleep: () => Promise<boolean>
  wakeUp: () => Promise<boolean>
}

/** Survives React StrictMode remounts so the action only runs once. */
let quickActionLock = false

export function useQuickActionRunner({
  ready,
  isSleeping,
  startSleep,
  wakeUp,
}: RunnerOptions) {
  const [status, setStatus] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const stateRef = useRef({ isSleeping, startSleep, wakeUp })
  stateRef.current = { isSleeping, startSleep, wakeUp }

  useEffect(() => {
    if (!ready || quickActionLock) return

    const action = getPendingQuickAction()
    if (!action) return

    quickActionLock = true
    setRunning(true)

    void (async () => {
      const message = await runQuickAction(action, stateRef.current)
      clearPendingQuickAction()
      setStatus(message)
      setRunning(false)
    })()
  }, [ready])

  return { status, running, dismissStatus: () => setStatus(null) }
}

async function runQuickAction(
  action: QuickAction,
  options: {
    isSleeping: boolean
    startSleep: () => Promise<boolean>
    wakeUp: () => Promise<boolean>
  },
) {
  if (action === 'sleep') {
    if (options.isSleeping) return 'Already sleeping — nothing to change.'
    const ok = await options.startSleep()
    return ok ? 'Sleep started.' : 'Could not start sleep.'
  }

  if (!options.isSleeping) return 'Already awake — nothing to change.'
  const ok = await options.wakeUp()
  return ok ? 'Wake logged.' : 'Could not log wake-up.'
}

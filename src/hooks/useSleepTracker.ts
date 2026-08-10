import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SleepSession } from '../types'
import { createDemoSessions } from '../utils/demoData'

function createId() {
  return crypto.randomUUID()
}

const STORAGE_KEY = 'sleep-tracker.sessions.v1'
const DEMO_SEEDED_KEY = 'sleep-tracker.demo-seeded.v1'

function loadSessions(): SleepSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const demo = createDemoSessions()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
      localStorage.setItem(DEMO_SEEDED_KEY, '1')
      return demo
    }

    const parsed = JSON.parse(raw) as SleepSession[]
    if (!Array.isArray(parsed)) return []

    // Seed demo data once for empty first-time / testing setups.
    if (
      parsed.length === 0 &&
      localStorage.getItem(DEMO_SEEDED_KEY) !== '1'
    ) {
      const demo = createDemoSessions()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
      localStorage.setItem(DEMO_SEEDED_KEY, '1')
      return demo
    }

    return parsed
  } catch {
    return createDemoSessions()
  }
}

function saveSessions(sessions: SleepSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function useSleepTracker() {
  const [sessions, setSessions] = useState<SleepSession[]>(() => loadSessions())
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  const activeSession = useMemo(
    () => sessions.find((s) => s.wakeAt === null) ?? null,
    [sessions],
  )

  const isSleeping = activeSession !== null

  const startSleep = useCallback(() => {
    if (activeSession) return

    const session: SleepSession = {
      id: createId(),
      sleepAt: new Date().toISOString(),
      wakeAt: null,
      note: noteDraft.trim(),
    }

    setSessions((prev) => [session, ...prev])
    setNoteDraft('')
  }, [activeSession, noteDraft])

  const wakeUp = useCallback(() => {
    if (!activeSession) return

    const note = noteDraft.trim()
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              wakeAt: new Date().toISOString(),
              note: note || s.note,
            }
          : s,
      ),
    )
    setNoteDraft('')
  }, [activeSession, noteDraft])

  const toggle = useCallback(() => {
    if (isSleeping) wakeUp()
    else startSleep()
  }, [isSleeping, startSleep, wakeUp])

  const updateNote = useCallback((id: string, note: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, note } : s)),
    )
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const loadDemoData = useCallback(() => {
    const demo = createDemoSessions()
    localStorage.setItem(DEMO_SEEDED_KEY, '1')
    setSessions(demo)
  }, [])

  return {
    sessions,
    activeSession,
    isSleeping,
    noteDraft,
    setNoteDraft,
    toggle,
    startSleep,
    wakeUp,
    updateNote,
    deleteSession,
    loadDemoData,
  }
}

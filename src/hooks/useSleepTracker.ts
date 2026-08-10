import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db, SLEEPING_LOGS_COLLECTION } from '../lib/firebase'
import type { SleepSession } from '../types'

type SleepLogDoc = {
  userId: string
  sleepAt: string
  wakeAt: string | null
  note: string
}

export function useSleepTracker() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SleepSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [noteDraft, setNoteDraft] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || !db) {
      setSessions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const logsQuery = query(
      collection(db, SLEEPING_LOGS_COLLECTION),
      where('userId', '==', user.uid),
    )

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map((item) => {
            const data = item.data() as SleepLogDoc
            return {
              id: item.id,
              sleepAt: data.sleepAt,
              wakeAt: data.wakeAt ?? null,
              note: data.note ?? '',
            } satisfies SleepSession
          })
          .sort(
            (a, b) =>
              new Date(b.sleepAt).getTime() - new Date(a.sleepAt).getTime(),
          )

        setSessions(next)
        setLoading(false)
      },
      (snapshotError) => {
        console.error(snapshotError)
        setError('Could not load sleep logs from Firebase.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const activeSession = useMemo(
    () => sessions.find((s) => s.wakeAt === null) ?? null,
    [sessions],
  )

  const isSleeping = activeSession !== null

  const startSleep = useCallback(async () => {
    if (!user || !db || activeSession || saving) return

    setSaving(true)
    setError('')
    try {
      await addDoc(collection(db, SLEEPING_LOGS_COLLECTION), {
        userId: user.uid,
        sleepAt: new Date().toISOString(),
        wakeAt: null,
        note: noteDraft.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setNoteDraft('')
    } catch (err) {
      console.error(err)
      setError('Could not start sleep session.')
    } finally {
      setSaving(false)
    }
  }, [user, activeSession, saving, noteDraft])

  const wakeUp = useCallback(async () => {
    if (!db || !activeSession || saving) return

    setSaving(true)
    setError('')
    try {
      const note = noteDraft.trim()
      await updateDoc(doc(db, SLEEPING_LOGS_COLLECTION, activeSession.id), {
        wakeAt: new Date().toISOString(),
        note: note || activeSession.note,
        updatedAt: serverTimestamp(),
      })
      setNoteDraft('')
    } catch (err) {
      console.error(err)
      setError('Could not save wake-up time.')
    } finally {
      setSaving(false)
    }
  }, [activeSession, saving, noteDraft])

  const toggle = useCallback(() => {
    if (isSleeping) void wakeUp()
    else void startSleep()
  }, [isSleeping, startSleep, wakeUp])

  const updateSession = useCallback(
    async (input: {
      id: string
      sleepAt: string
      wakeAt: string | null
      note: string
    }) => {
      if (!db) throw new Error('Firebase is not ready.')

      setSaving(true)
      setError('')
      try {
        await updateDoc(doc(db, SLEEPING_LOGS_COLLECTION, input.id), {
          sleepAt: input.sleepAt,
          wakeAt: input.wakeAt,
          note: input.note,
          updatedAt: serverTimestamp(),
        })
      } catch (err) {
        console.error(err)
        setError('Could not update sleep log.')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const deleteSession = useCallback(async (id: string) => {
    if (!db) throw new Error('Firebase is not ready.')

    setSaving(true)
    setError('')
    try {
      await deleteDoc(doc(db, SLEEPING_LOGS_COLLECTION, id))
    } catch (err) {
      console.error(err)
      setError('Could not delete sleep log.')
      throw err
    } finally {
      setSaving(false)
    }
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
    updateSession,
    deleteSession,
    loading,
    saving,
    error,
  }
}

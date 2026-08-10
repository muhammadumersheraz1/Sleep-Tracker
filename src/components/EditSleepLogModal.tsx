import { useEffect, useState, type FormEvent } from 'react'
import type { SleepSession } from '../types'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../utils/datetime'

type EditSleepLogModalProps = {
  session: SleepSession | null
  busy?: boolean
  onClose: () => void
  onSave: (input: {
    id: string
    sleepAt: string
    wakeAt: string | null
    note: string
  }) => Promise<void>
}

export function EditSleepLogModal({
  session,
  busy = false,
  onClose,
  onSave,
}: EditSleepLogModalProps) {
  const [sleepAt, setSleepAt] = useState('')
  const [wakeAt, setWakeAt] = useState('')
  const [stillSleeping, setStillSleeping] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return
    setSleepAt(toDateTimeLocalValue(session.sleepAt))
    setWakeAt(session.wakeAt ? toDateTimeLocalValue(session.wakeAt) : '')
    setStillSleeping(!session.wakeAt)
    setNote(session.note)
    setError('')
  }, [session])

  if (!session) return null

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!session) return

    if (!sleepAt) {
      setError('Sleep time is required.')
      return
    }

    if (!stillSleeping && !wakeAt) {
      setError('Wake time is required, or mark as still sleeping.')
      return
    }

    const sleepIso = fromDateTimeLocalValue(sleepAt)
    const wakeIso = stillSleeping ? null : fromDateTimeLocalValue(wakeAt)

    if (wakeIso && new Date(wakeIso).getTime() < new Date(sleepIso).getTime()) {
      setError('Wake time must be after sleep time.')
      return
    }

    const sessionId = session.id

    try {
      await onSave({
        id: sessionId,
        sleepAt: sleepIso,
        wakeAt: wakeIso,
        note: note.trim(),
      })
      onClose()
    } catch {
      setError('Could not save changes.')
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!busy) onClose()
      }}
    >
      <div
        className="modal-card edit-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-log-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="edit-log-title">Edit sleep log</h3>
        <form className="edit-form" onSubmit={(e) => void onSubmit(e)}>
          <label className="auth-field">
            <span>Sleep time</span>
            <input
              type="datetime-local"
              required
              value={sleepAt}
              onChange={(e) => setSleepAt(e.target.value)}
            />
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={stillSleeping}
              onChange={(e) => setStillSleeping(e.target.checked)}
            />
            <span>Still sleeping (no wake time yet)</span>
          </label>

          {!stillSleeping && (
            <label className="auth-field">
              <span>Wake time</span>
              <input
                type="datetime-local"
                required
                value={wakeAt}
                onChange={(e) => setWakeAt(e.target.value)}
              />
            </label>
          )}

          <label className="auth-field">
            <span>Note</span>
            <textarea
              rows={3}
              maxLength={280}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

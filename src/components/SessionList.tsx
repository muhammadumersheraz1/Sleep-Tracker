import { format, parseISO } from 'date-fns'
import type { SleepSession } from '../types'
import { formatDuration, sessionDurationSeconds } from '../utils/format'

type SessionListProps = {
  sessions: SleepSession[]
  now: Date
  onDelete: (id: string) => void
  onUpdateNote: (id: string, note: string) => void
}

export function SessionList({
  sessions,
  now,
  onDelete,
  onUpdateNote,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <p>No sleep sessions yet. Flip the switch to Sleep to begin.</p>
      </div>
    )
  }

  return (
    <ul className="session-list">
      {sessions.map((session) => {
        const duration = sessionDurationSeconds(session, now)
        const sleepLabel = format(parseISO(session.sleepAt), 'MMM d · h:mm a')
        const wakeLabel = session.wakeAt
          ? format(parseISO(session.wakeAt), 'MMM d · h:mm a')
          : 'In progress'

        return (
          <li
            key={session.id}
            className={`session-item ${session.wakeAt ? '' : 'active'}`}
          >
            <div className="session-meta">
              <div>
                <p className="session-range">
                  {sleepLabel}
                  <span aria-hidden="true"> → </span>
                  {wakeLabel}
                </p>
                <p className="session-duration">{formatDuration(duration)}</p>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => onDelete(session.id)}
                aria-label="Delete session"
              >
                Delete
              </button>
            </div>
            <label className="session-note">
              <span>Note</span>
              <input
                type="text"
                value={session.note}
                onChange={(e) => onUpdateNote(session.id, e.target.value)}
                placeholder="Add a note…"
                maxLength={280}
              />
            </label>
          </li>
        )
      })}
    </ul>
  )
}

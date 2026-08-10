import { format, parseISO } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import type { SleepSession } from '../types'
import {
  dayKey,
  formatDuration,
  formatDurationShort,
  sessionDurationSeconds,
} from '../utils/format'

type DayPoint = {
  date: string
  seconds: number
  hours: number
}

type DailyTotalsProps = {
  data: DayPoint[]
  sessions: SleepSession[]
  now: Date
}

export function DailyTotals({ data, sessions, now }: DailyTotalsProps) {
  const daysWithSleep = useMemo(
    () =>
      [...data]
        .filter((d) => d.seconds > 0)
        .reverse(),
    [data],
  )

  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => daysWithSleep[0]?.date ?? null,
  )

  useEffect(() => {
    if (
      selectedDate &&
      daysWithSleep.some((day) => day.date === selectedDate)
    ) {
      return
    }
    setSelectedDate(daysWithSleep[0]?.date ?? null)
  }, [daysWithSleep, selectedDate])

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SleepSession[]>()
    for (const session of sessions) {
      const key = dayKey(session.sleepAt)
      const list = map.get(key)
      if (list) list.push(session)
      else map.set(key, [session])
    }

    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.sleepAt).getTime() - new Date(b.sleepAt).getTime(),
      )
    }

    return map
  }, [sessions])

  if (daysWithSleep.length === 0) {
    return (
      <div className="empty-state compact">
        <p>Daily totals will appear here once you log sleep.</p>
      </div>
    )
  }

  return (
    <ul className="daily-totals">
      {daysWithSleep.map((day) => {
        const isOpen = selectedDate === day.date
        const daySessions = sessionsByDate.get(day.date) ?? []
        const panelId = `daily-sessions-${day.date}`

        return (
          <li key={day.date} className={`daily-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="daily-summary"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setSelectedDate((current) =>
                  current === day.date ? null : day.date,
                )
              }
            >
              <span className="daily-date">
                {format(parseISO(day.date), 'EEE, MMM d')}
              </span>
              <span className="daily-meta">
                <span className="daily-count">
                  {daySessions.length}{' '}
                  {daySessions.length === 1 ? 'session' : 'sessions'}
                </span>
                <span className="daily-hours">{day.hours.toFixed(1)}h</span>
                <span className="daily-duration">
                  {formatDurationShort(day.seconds)}
                </span>
                <span className="daily-chevron" aria-hidden="true">
                  {isOpen ? '▾' : '▸'}
                </span>
              </span>
            </button>

            {isOpen && (
              <div className="daily-dropdown" id={panelId}>
                <ul className="daily-session-list">
                  {daySessions.map((session, index) => {
                    const duration = sessionDurationSeconds(session, now)
                    const sleepLabel = format(
                      parseISO(session.sleepAt),
                      'h:mm a',
                    )
                    const wakeLabel = session.wakeAt
                      ? format(parseISO(session.wakeAt), 'h:mm a')
                      : 'In progress'

                    return (
                      <li key={session.id} className="daily-session">
                        <div className="daily-session-top">
                          <span className="daily-session-index">
                            Session {index + 1}
                          </span>
                          <span className="daily-session-duration">
                            {formatDuration(duration)}
                          </span>
                        </div>
                        <p className="daily-session-range">
                          {sleepLabel}
                          <span aria-hidden="true"> → </span>
                          {wakeLabel}
                        </p>
                        {session.note ? (
                          <p className="daily-session-note">{session.note}</p>
                        ) : (
                          <p className="daily-session-note muted">No note</p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

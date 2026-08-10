import {
  differenceInSeconds,
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns'
import type { SleepSession } from '../types'

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export function formatDurationShort(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatHours(totalSeconds: number): number {
  return Math.round((totalSeconds / 3600) * 10) / 10
}

export function sessionDurationSeconds(
  session: SleepSession,
  now: Date = new Date(),
): number {
  const start = parseISO(session.sleepAt)
  const end = session.wakeAt ? parseISO(session.wakeAt) : now
  return Math.max(0, differenceInSeconds(end, start))
}

export function dayKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}

/** Total sleep seconds for a calendar day (sessions attributed by sleep start date). */
export function totalSleepForDay(
  sessions: SleepSession[],
  dateKey: string,
  now: Date = new Date(),
): number {
  return sessions
    .filter((s) => dayKey(s.sleepAt) === dateKey)
    .reduce((sum, s) => sum + sessionDurationSeconds(s, now), 0)
}

export function monthlyDailyTotals(
  sessions: SleepSession[],
  month: Date,
  now: Date = new Date(),
): { date: string; label: string; seconds: number; hours: number }[] {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  })

  return days.map((day) => {
    const key = dayKey(day)
    const seconds = totalSleepForDay(sessions, key, now)
    return {
      date: key,
      label: format(day, 'd'),
      seconds,
      hours: formatHours(seconds),
    }
  })
}

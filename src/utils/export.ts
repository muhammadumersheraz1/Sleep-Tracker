import { format } from 'date-fns'
import type { SleepSession } from '../types'
import { formatDuration, sessionDurationSeconds } from './format'

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function exportStamp() {
  return format(new Date(), 'yyyy-MM-dd')
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportSessionsJson(sessions: SleepSession[]) {
  const payload = {
    exportedAt: new Date().toISOString(),
    sessionCount: sessions.length,
    sessions,
  }

  downloadFile(
    `lumen-sleep-${exportStamp()}.json`,
    `${JSON.stringify(payload, null, 2)}\n`,
    'application/json',
  )
}

export function exportSessionsCsv(sessions: SleepSession[], now = new Date()) {
  const headers = [
    'id',
    'sleep_at',
    'wake_at',
    'duration',
    'duration_seconds',
    'note',
    'status',
  ]

  const rows = sessions.map((session) => {
    const seconds = sessionDurationSeconds(session, now)
    return [
      session.id,
      session.sleepAt,
      session.wakeAt ?? '',
      formatDuration(seconds),
      String(seconds),
      session.note,
      session.wakeAt ? 'completed' : 'in_progress',
    ]
      .map((cell) => escapeCsv(cell))
      .join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  downloadFile(`lumen-sleep-${exportStamp()}.csv`, `${csv}\n`, 'text/csv')
}

import { format, parseISO } from 'date-fns'
import { formatDurationShort } from '../utils/format'

type DayPoint = {
  date: string
  seconds: number
  hours: number
}

type DailyTotalsProps = {
  data: DayPoint[]
}

export function DailyTotals({ data }: DailyTotalsProps) {
  const daysWithSleep = [...data]
    .filter((d) => d.seconds > 0)
    .reverse()

  if (daysWithSleep.length === 0) {
    return (
      <div className="empty-state compact">
        <p>Daily totals will appear here once you log sleep.</p>
      </div>
    )
  }

  return (
    <ul className="daily-totals">
      {daysWithSleep.map((day) => (
        <li key={day.date}>
          <span className="daily-date">
            {format(parseISO(day.date), 'EEE, MMM d')}
          </span>
          <span className="daily-hours">{day.hours.toFixed(1)}h</span>
          <span className="daily-duration">{formatDurationShort(day.seconds)}</span>
        </li>
      ))}
    </ul>
  )
}

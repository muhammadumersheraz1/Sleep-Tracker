import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDurationShort } from '../utils/format'

type DayPoint = {
  date: string
  label: string
  seconds: number
  hours: number
}

type MonthlyChartProps = {
  data: DayPoint[]
  monthLabel: string
  onPrev: () => void
  onNext: () => void
  canGoNext: boolean
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: DayPoint }[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{point.date}</strong>
      <span>{formatDurationShort(point.seconds)}</span>
    </div>
  )
}

export function MonthlyChart({
  data,
  monthLabel,
  onPrev,
  onNext,
  canGoNext,
}: MonthlyChartProps) {
  return (
    <section className="chart-section">
      <div className="section-heading">
        <div>
          <h2>Monthly sleep pattern</h2>
          <p>Total sleep duration for each day</p>
        </div>
        <div className="month-nav">
          <button type="button" className="ghost-btn" onClick={onPrev}>
            ←
          </button>
          <span>{monthLabel}</span>
          <button
            type="button"
            className="ghost-btn"
            onClick={onNext}
            disabled={!canGoNext}
          >
            →
          </button>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(236, 244, 242, 0.55)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(236, 244, 242, 0.55)', fontSize: 11 }}
              unit="h"
              width={40}
              allowDecimals
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar
              dataKey="hours"
              fill="url(#sleepBar)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
            <defs>
              <linearGradient id="sleepBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7ec8b8" />
                <stop offset="100%" stopColor="#2f7a6d" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

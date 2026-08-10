import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMediaQuery } from '../hooks/useMediaQuery'
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
  const isMobile = useMediaQuery('(max-width: 640px)')
  const chartHeight = isMobile ? 200 : 260

  return (
    <section className="chart-section" aria-labelledby="monthly-chart-heading">
      <div className="section-heading">
        <div>
          <h2 id="monthly-chart-heading">Monthly sleep pattern</h2>
          <p>Total sleep duration for each day</p>
        </div>
        <div className="month-nav">
          <button
            type="button"
            className="ghost-btn month-nav-btn"
            onClick={onPrev}
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="month-label">{monthLabel}</span>
          <button
            type="button"
            className="ghost-btn month-nav-btn"
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="chart-wrap" style={{ minHeight: chartHeight }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={
              isMobile
                ? { top: 4, right: 2, left: 0, bottom: 0 }
                : { top: 8, right: 8, left: -12, bottom: 0 }
            }
          >
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'rgba(236, 244, 242, 0.55)',
                fontSize: isMobile ? 9 : 11,
              }}
              interval={isMobile ? 2 : 'preserveStartEnd'}
              minTickGap={isMobile ? 2 : 5}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'rgba(236, 244, 242, 0.55)',
                fontSize: isMobile ? 9 : 11,
              }}
              tickFormatter={(value: number) => `${value}h`}
              width={isMobile ? 36 : 40}
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
              maxBarSize={isMobile ? 12 : 18}
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

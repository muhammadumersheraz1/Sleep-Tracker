import { addMonths, format, isAfter, startOfMonth } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { DailyTotals } from './components/DailyTotals'
import { ExportData } from './components/ExportData'
import { InstallPrompt } from './components/InstallPrompt'
import { MonthlyChart } from './components/MonthlyChart'
import { NoteField } from './components/NoteField'
import { SleepToggle } from './components/SleepToggle'
import { useSleepTracker } from './hooks/useSleepTracker'
import {
  dayKey,
  formatDuration,
  formatDurationShort,
  monthlyDailyTotals,
  sessionDurationSeconds,
  totalSleepForDay,
} from './utils/format'
import './App.css'

function App() {
  const {
    sessions,
    activeSession,
    isSleeping,
    noteDraft,
    setNoteDraft,
    toggle,
  } = useSleepTracker()

  const [now, setNow] = useState(() => new Date())
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  useEffect(() => {
    if (!isSleeping) return
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [isSleeping])

  const elapsedLabel = useMemo(() => {
    if (!activeSession) return '0m 00s'
    return formatDuration(sessionDurationSeconds(activeSession, now))
  }, [activeSession, now])

  const todayTotal = useMemo(
    () => totalSleepForDay(sessions, dayKey(now), now),
    [sessions, now],
  )

  const monthData = useMemo(
    () => monthlyDailyTotals(sessions, month, now),
    [sessions, month, now],
  )

  const monthTotalSeconds = useMemo(
    () => monthData.reduce((sum, d) => sum + d.seconds, 0),
    [monthData],
  )

  const thisMonthStart = startOfMonth(new Date())
  const canGoNext = !isAfter(addMonths(month, 1), thisMonthStart)

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div>
          <h1 className="brand">Lumen Sleep</h1>
          <p className="tagline">
            Free sleep tracker with timer, notes, and monthly charts
          </p>
        </div>
        <div className="topbar-actions">
          <ExportData sessions={sessions} />
          <div className="today-pill" aria-label={`Today total sleep ${formatDurationShort(todayTotal)}`}>
            <span>Today</span>
            <strong>{formatDurationShort(todayTotal)}</strong>
          </div>
        </div>
      </header>

      <main className="layout" id="main-content">
        <InstallPrompt />

        <section
          className="control-panel"
          aria-labelledby="tracker-heading"
        >
          <h2 id="tracker-heading" className="visually-hidden">
            Sleep and wake tracker
          </h2>
          <SleepToggle
            isSleeping={isSleeping}
            onToggle={toggle}
            elapsedLabel={elapsedLabel}
          />
          <NoteField
            value={noteDraft}
            onChange={setNoteDraft}
            isSleeping={isSleeping}
          />
          <p className="multi-hint">
            Track sleep and wake cycles anytime. Multiple sessions in one day
            are saved separately and added into that day’s total.
          </p>
        </section>

        <MonthlyChart
          data={monthData}
          monthLabel={format(month, 'MMMM yyyy')}
          onPrev={() => setMonth((m) => startOfMonth(addMonths(m, -1)))}
          onNext={() => setMonth((m) => startOfMonth(addMonths(m, 1)))}
          canGoNext={canGoNext}
        />

        <section className="panel" aria-labelledby="daily-totals-heading">
          <div className="section-heading">
            <div>
              <h2 id="daily-totals-heading">Daily totals</h2>
              <p>
                {format(month, 'MMMM')} · {formatDuration(monthTotalSeconds)}{' '}
                logged — tap a date to view sessions
              </p>
            </div>
          </div>
          <DailyTotals data={monthData} sessions={sessions} now={now} />
        </section>
      </main>

      <footer className="site-footer">
        <p>
          <strong>Lumen Sleep</strong> is a free sleep tracker progressive web
          app for logging sleep duration, wake times, notes, and monthly sleep
          patterns.
        </p>
        <p>
          <a
            href="https://github.com/muhammadumersheraz1/Sleep-Tracker"
            rel="noopener noreferrer"
            target="_blank"
          >
            View source on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

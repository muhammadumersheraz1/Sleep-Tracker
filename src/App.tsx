import { addMonths, format, isAfter, startOfMonth } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { DailyTotals } from './components/DailyTotals'
import { ExportData } from './components/ExportData'
import { InstallPrompt } from './components/InstallPrompt'
import { MonthlyChart } from './components/MonthlyChart'
import { NoteField } from './components/NoteField'
import { SessionList } from './components/SessionList'
import { SleepToggle } from './components/SleepToggle'
import { useSleepTracker } from './hooks/useSleepTracker'
import {
  dayKey,
  formatDuration,
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
    updateNote,
    deleteSession,
    loadDemoData,
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
          <p className="brand">Lumen Sleep</p>
          <h1>Track every rest</h1>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={loadDemoData}
            title="Replace current data with sample sleep sessions"
          >
            Load demo
          </button>
          <ExportData sessions={sessions} />
          <div className="today-pill">
            <span>Today</span>
            <strong>{formatDuration(todayTotal)}</strong>
          </div>
        </div>
      </header>

      <main className="layout">
        <InstallPrompt />
        <section className="control-panel">
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
            You can sleep and wake multiple times in a day — each cycle is saved
            as its own session and summed into the daily total.
          </p>
        </section>

        <MonthlyChart
          data={monthData}
          monthLabel={format(month, 'MMMM yyyy')}
          onPrev={() => setMonth((m) => startOfMonth(addMonths(m, -1)))}
          onNext={() => setMonth((m) => startOfMonth(addMonths(m, 1)))}
          canGoNext={canGoNext}
        />

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Daily totals</h2>
              <p>
                {format(month, 'MMMM')} · {formatDuration(monthTotalSeconds)}{' '}
                logged
              </p>
            </div>
          </div>
          <DailyTotals data={monthData} />
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Sleep sessions</h2>
              <p>All cycles with notes and timers</p>
            </div>
          </div>
          <SessionList
            sessions={sessions}
            now={now}
            onDelete={deleteSession}
            onUpdateNote={updateNote}
          />
        </section>
      </main>
    </div>
  )
}

export default App

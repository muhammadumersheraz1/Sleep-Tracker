import { addMonths, format, isAfter, startOfMonth } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { DailyTotals } from './components/DailyTotals'
import { ExportData } from './components/ExportData'
import { InstallPrompt } from './components/InstallPrompt'
import { MonthlyChart } from './components/MonthlyChart'
import { NoteField } from './components/NoteField'
import { SleepToggle } from './components/SleepToggle'
import { useAuth } from './contexts/AuthContext'
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

function TrackerApp() {
  const { user, logout } = useAuth()
  const {
    sessions,
    activeSession,
    isSleeping,
    noteDraft,
    setNoteDraft,
    toggle,
    updateSession,
    deleteSession,
    loading,
    saving,
    error,
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
            {user?.displayName || user?.email
              ? `Signed in as ${user.displayName || user.email}`
              : 'Free sleep tracker with timer, notes, and monthly charts'}
          </p>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => void logout()}
          >
            Log out
          </button>
          <ExportData sessions={sessions} />
          <div
            className="today-pill"
            aria-label={`Today total sleep ${formatDurationShort(todayTotal)}`}
          >
            <span>Today</span>
            <strong>{formatDurationShort(todayTotal)}</strong>
          </div>
        </div>
      </header>

      <main className="layout" id="main-content">
        <InstallPrompt />

        {error && (
          <div className="app-banner error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="app-banner">Loading your sleep logs…</div>
        ) : (
          <>
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
                elapsedLabel={saving ? 'Saving…' : elapsedLabel}
              />
              <NoteField
                value={noteDraft}
                onChange={setNoteDraft}
                isSleeping={isSleeping}
              />
              <p className="multi-hint">
                Your sleep sessions are saved to Firebase in the{' '}
                <strong>sleeping logs</strong> collection. Multiple sessions in
                one day are stored separately and summed into that day’s total.
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
              <DailyTotals
                data={monthData}
                sessions={sessions}
                now={now}
                saving={saving}
                onUpdateSession={updateSession}
                onDeleteSession={deleteSession}
              />
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>
          <strong>Lumen Sleep</strong> syncs sleep duration, wake times, and
          notes to your Firebase account.
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

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app auth-app">
        <div className="atmosphere" aria-hidden="true" />
        <main className="auth-card">
          <p className="auth-loading">Checking your session…</p>
        </main>
      </div>
    )
  }

  if (!user) return <AuthScreen />

  return <TrackerApp />
}

export default App

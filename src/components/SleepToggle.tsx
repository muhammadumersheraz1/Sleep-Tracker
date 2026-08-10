type SleepToggleProps = {
  isSleeping: boolean
  onToggle: () => void
  elapsedLabel: string
}

export function SleepToggle({
  isSleeping,
  onToggle,
  elapsedLabel,
}: SleepToggleProps) {
  return (
    <div className={`toggle-panel ${isSleeping ? 'is-sleeping' : 'is-awake'}`}>
      <p className="toggle-status">
        {isSleeping ? 'Currently sleeping' : 'Currently awake'}
      </p>
      <p className="toggle-timer" aria-live="polite">
        {elapsedLabel}
      </p>
      <button
        type="button"
        className="sleep-switch"
        onClick={onToggle}
        aria-pressed={isSleeping}
      >
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
        <span className="switch-labels">
          <span className={!isSleeping ? 'active' : ''}>Wake</span>
          <span className={isSleeping ? 'active' : ''}>Sleep</span>
        </span>
      </button>
      <p className="toggle-hint">
        {isSleeping
          ? 'Press to wake up and end this sleep session'
          : 'Press to start sleeping — timer begins now'}
      </p>
    </div>
  )
}

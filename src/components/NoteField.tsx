type NoteFieldProps = {
  value: string
  onChange: (value: string) => void
  isSleeping: boolean
}

export function NoteField({ value, onChange, isSleeping }: NoteFieldProps) {
  return (
    <label className="note-field">
      <span className="note-label">
        {isSleeping ? 'Add a note before waking' : 'Optional note for next sleep'}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. felt restless, late caffeine, early alarm…"
        rows={3}
        maxLength={280}
      />
    </label>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { SleepSession } from '../types'
import { exportSessionsCsv, exportSessionsJson } from '../utils/export'

type ExportDataProps = {
  sessions: SleepSession[]
}

export function ExportData({ sessions }: ExportDataProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const disabled = sessions.length === 0

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="export-menu" ref={menuRef}>
      <button
        type="button"
        className="ghost-btn export-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={disabled}
        title={disabled ? 'No sessions to export yet' : 'Export sleep data'}
      >
        Export
      </button>

      {open && !disabled && (
        <div className="export-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              exportSessionsJson(sessions)
              setOpen(false)
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              exportSessionsCsv(sessions)
              setOpen(false)
            }}
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  )
}

export type QuickAction = 'sleep' | 'wake'

const STORAGE_KEY = 'lumen-quick-action'

function isQuickAction(value: string | null): value is QuickAction {
  return value === 'sleep' || value === 'wake'
}

/** Capture ?action=sleep|wake from the URL into sessionStorage, then clean the URL. */
export function captureQuickActionFromUrl() {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const action = url.searchParams.get('action')
  if (!isQuickAction(action)) return

  sessionStorage.setItem(STORAGE_KEY, action)
  url.searchParams.delete('action')
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState({}, '', next || '/')
}

export function getPendingQuickAction(): QuickAction | null {
  if (typeof window === 'undefined') return null
  const action = sessionStorage.getItem(STORAGE_KEY)
  return isQuickAction(action) ? action : null
}

export function clearPendingQuickAction() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}

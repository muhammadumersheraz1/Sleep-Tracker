import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  )
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setDeferred(null)
      setHidden(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferred || hidden) return null

  return (
    <div className="install-banner">
      <div>
        <strong>Install Lumen Sleep</strong>
        <p>Add to your home screen for offline tracking.</p>
      </div>
      <div className="install-actions">
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setHidden(true)}
        >
          Not now
        </button>
        <button
          type="button"
          className="install-btn"
          onClick={async () => {
            await deferred.prompt()
            await deferred.userChoice
            setDeferred(null)
          }}
        >
          Install
        </button>
      </div>
    </div>
  )
}

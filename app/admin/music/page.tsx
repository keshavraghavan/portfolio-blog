'use client'

import { useState } from 'react'
import Script from 'next/script'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import {
  adminFetch,
  clearSecret,
  fetcher,
  getSecret,
  setSecret,
} from 'src/lib/admin-auth'
import { MusicStatusResponse } from 'src/lib/music/types'

declare global {
  interface Window {
    MusicKit?: {
      configure: (config: {
        developerToken: string
        app: {
          name: string
          build: string
        }
      }) => void
      getInstance: () => {
        authorize: () => Promise<string>
      }
    }
  }
}

type MusicAdminResponse = {
  status: MusicStatusResponse
  connections: {
    spotifyConnected: boolean
    appleConnected: boolean
  }
      configuration: {
        spotifyReady: boolean
        appleReady: boolean
        appleEnabled: boolean
      }
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    setSecret(password)

    try {
      const response = await fetch('/api/admin/music', {
        headers: { 'x-admin-secret': password },
      })

      if (response.status === 401) {
        clearSecret()
        setError('Invalid secret.')
        return
      }

      onLogin()
    } catch {
      clearSecret()
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <label
        htmlFor="adminSecret"
        className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1"
      >
        Admin Secret
      </label>
      <input
        id="adminSecret"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter admin secret"
        className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all mb-4"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Verifying...' : 'Sign In'}
      </button>
    </form>
  )
}

function ProviderStatusBlock({
  title,
  connected,
  ready,
  summary,
  onConnect,
  onDisconnect,
  busy,
}: {
  title: string
  connected: boolean
  ready: boolean
  summary: string
  onConnect: () => void
  onDisconnect: () => void
  busy: boolean
}) {
  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-courier text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
            {title}
          </p>
          <p className="mt-3 text-sm text-near-black dark:text-cream">
            {connected ? 'Connected' : 'Disconnected'}
          </p>
          <p className="mt-1 text-sm text-muted leading-relaxed">{summary}</p>
          {!ready && (
            <p className="mt-3 text-xs text-red-600 dark:text-red-400">
              Provider environment variables are missing.
            </p>
          )}
        </div>
        <span className="pill">{connected ? 'Connected' : 'Not connected'}</span>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onConnect}
          disabled={busy || !ready}
          className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {busy ? 'Working...' : connected ? 'Reconnect' : 'Connect'}
        </button>
        {connected && (
          <button
            onClick={onDisconnect}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium tracking-tight text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  )
}

function buildStatusSummary(status: MusicStatusResponse, provider: 'spotify' | 'apple') {
  const track = provider === 'spotify' ? status.spotify : status.appleMusic

  if (track.trackName && track.artistName) {
    return `${track.trackName} by ${track.artistName}`
  }

  if (track.trackName) {
    return track.trackName
  }

  if (provider === 'spotify') {
    return 'Shows current playback when available, otherwise your last played track.'
  }

  return 'Shows your most recently played track from Apple Music.'
}

async function waitForMusicKit(timeoutMs = 8_000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    if (window.MusicKit) {
      return window.MusicKit
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error('Apple MusicKit failed to load')
}

function MusicDashboard() {
  const searchParams = useSearchParams()
  const { data, mutate } = useSWR<MusicAdminResponse>(
    '/api/admin/music',
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: false,
    }
  )
  const [spotifyBusy, setSpotifyBusy] = useState(false)
  const [appleBusy, setAppleBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const appleMusicEnabled = data?.configuration.appleEnabled ?? false

  async function handleSpotifyConnect() {
    setLocalError(null)
    setSpotifyBusy(true)
    window.location.href = '/api/auth/spotify/start'
  }

  async function handleSpotifyDisconnect() {
    setLocalError(null)
    setSpotifyBusy(true)

    try {
      const response = await adminFetch('/api/music/disconnect/spotify', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect Spotify')
      }

      await mutate()
    } catch (error) {
      console.error(error)
      setLocalError('Failed to disconnect Spotify.')
    } finally {
      setSpotifyBusy(false)
    }
  }

  async function handleAppleConnect() {
    if (!appleMusicEnabled) {
      return
    }

    setLocalError(null)
    setAppleBusy(true)

    try {
      const developerTokenResponse = await adminFetch(
        '/api/auth/apple/developer-token'
      )

      if (!developerTokenResponse.ok) {
        throw new Error('Failed to fetch Apple developer token')
      }

      const { developerToken } = await developerTokenResponse.json()
      const musicKit = await waitForMusicKit()

      musicKit.configure({
        developerToken,
        app: {
          name: "Keshav's Site",
          build: '1.0.0',
        },
      })

      const musicUserToken = await musicKit.getInstance().authorize()

      const saveResponse = await adminFetch('/api/auth/apple/save-user-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ musicUserToken }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save Apple Music user token')
      }

      await mutate()
    } catch (error) {
      console.error(error)
      setLocalError('Failed to connect Apple Music.')
    } finally {
      setAppleBusy(false)
    }
  }

  async function handleAppleDisconnect() {
    if (!appleMusicEnabled) {
      return
    }

    setLocalError(null)
    setAppleBusy(true)

    try {
      const response = await adminFetch('/api/music/disconnect/apple', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect Apple Music')
      }

      await mutate()
    } catch (error) {
      console.error(error)
      setLocalError('Failed to disconnect Apple Music.')
    } finally {
      setAppleBusy(false)
    }
  }

  const callbackMessage =
    searchParams.get('connected') === 'spotify'
      ? 'Spotify connected successfully.'
      : searchParams.get('error') === 'spotify_oauth_failed'
        ? 'Spotify OAuth failed. Try the connection flow again.'
        : searchParams.get('error') === 'spotify_callback_failed'
          ? 'Spotify callback failed while saving tokens.'
          : null

  return (
    <>
      <Script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js" strategy="afterInteractive" />

      {callbackMessage && (
        <p className="mb-6 text-sm text-accent">{callbackMessage}</p>
      )}
      {localError && (
        <p className="mb-6 text-sm text-red-600 dark:text-red-400">
          {localError}
        </p>
      )}

      {!data ? (
        <p className="text-neutral-400">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div
            className={`grid grid-cols-1 gap-4 ${
              appleMusicEnabled ? 'md:grid-cols-2' : ''
            }`}
          >
            <ProviderStatusBlock
              title="Spotify"
              connected={data.connections.spotifyConnected}
              ready={data.configuration.spotifyReady}
              summary={buildStatusSummary(data.status, 'spotify')}
              onConnect={handleSpotifyConnect}
              onDisconnect={handleSpotifyDisconnect}
              busy={spotifyBusy}
            />
            {appleMusicEnabled && (
              <ProviderStatusBlock
                title="Apple Music"
                connected={data.connections.appleConnected}
                ready={data.configuration.appleReady}
                summary={buildStatusSummary(data.status, 'apple')}
                onConnect={handleAppleConnect}
                onDisconnect={handleAppleDisconnect}
                busy={appleBusy}
              />
            )}
          </div>

          <div className="card-base p-5">
            <p className="font-courier text-[11px] uppercase tracking-[0.18em] text-muted">
              Notes
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Spotify uses OAuth from the server and powers the public homepage
              widget.
            </p>
            {appleMusicEnabled && (
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Apple Music uses MusicKit in the browser to obtain a music user
                token, then stores that token on the server.
              </p>
            )}
            {!appleMusicEnabled && (
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Apple Music is currently hidden. Set
                <code className="mx-1">ENABLE_APPLE_MUSIC=true</code>
                when you want to restore it.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminMusicPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof document === 'undefined') return false
    return !!getSecret()
  })

  return (
    <section>
      <h1 className="font-semibold text-2xl tracking-tighter mb-8">
        Music Connections
      </h1>
      {authed ? (
        <MusicDashboard />
      ) : (
        <LoginForm onLogin={() => setAuthed(true)} />
      )}
    </section>
  )
}

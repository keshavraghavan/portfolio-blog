import { Disc3, ExternalLink, Radio } from 'lucide-react'
import { MusicErrorCode, NormalizedTrack } from 'src/lib/music/types'

function getProviderLabel(provider: NormalizedTrack['provider']) {
  return provider === 'spotify' ? 'Spotify' : 'Apple Music'
}

function getStatusLabel(track: NormalizedTrack) {
  if (track.status === 'playing_now') {
    return 'Playing now'
  }

  if (track.status === 'last_played') {
    return 'Last played'
  }

  return 'Unavailable'
}

function getUnavailableCopy(
  provider: NormalizedTrack['provider'],
  error: MusicErrorCode | null
) {
  if (error === 'not_connected') {
    return `${getProviderLabel(provider)} is not connected yet.`
  }

  if (error === 'not_configured') {
    return `${getProviderLabel(provider)} is not configured.`
  }

  if (error === 'token_expired') {
    return `Reconnect ${getProviderLabel(provider)} to resume updates.`
  }

  return `No ${getProviderLabel(provider)} playback is available right now.`
}

function formatPlayedAt(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function ProviderCard({
  track,
  error,
}: {
  track: NormalizedTrack
  error: MusicErrorCode | null
}) {
  const providerLabel = getProviderLabel(track.provider)
  const playedAt = formatPlayedAt(track.playedAt)
  const isAvailable = track.status !== 'not_available'

  return (
    <article className="card-base p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-courier text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
            {providerLabel}
          </p>
          <p className="mt-2 text-xs text-muted flex items-center gap-2">
            {track.status === 'playing_now' ? (
              <Radio className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Disc3 className="h-3.5 w-3.5 text-accent" />
            )}
            <span>{getStatusLabel(track)}</span>
          </p>
        </div>
        <span className="pill">{getStatusLabel(track)}</span>
      </div>

      <div className="mt-4 flex gap-4">
        {track.albumArtUrl ? (
          <img
            src={track.albumArtUrl}
            alt={`${track.albumName ?? track.trackName ?? providerLabel} artwork`}
            className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 rounded-md object-cover border border-warm-border dark:border-dark-border"
          />
        ) : (
          <div className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 rounded-md border border-dashed border-warm-border dark:border-dark-border bg-surface-muted dark:bg-dark-surface-muted flex items-center justify-center">
            <Disc3 className="h-5 w-5 text-muted" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {isAvailable ? (
            <>
              <h3 className="text-sm font-medium text-near-black dark:text-cream leading-snug">
                {track.trackName}
              </h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {track.artistName}
              </p>
              {track.albumName && (
                <p className="mt-1 text-xs text-muted">{track.albumName}</p>
              )}
              {playedAt && (
                <p className="mt-3 text-xs text-muted">Updated {playedAt}</p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-sm font-medium text-near-black dark:text-cream leading-snug">
                {providerLabel}
              </h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {getUnavailableCopy(track.provider, error)}
              </p>
            </>
          )}
        </div>
      </div>

      {track.externalUrl && (
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs text-accent hover:underline underline-offset-2 transition-colors"
        >
          <span>Open in {providerLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </article>
  )
}

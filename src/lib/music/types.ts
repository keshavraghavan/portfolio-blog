export type MusicProvider = 'spotify' | 'apple_music'

export type NormalizedPlaybackStatus =
  | 'playing_now'
  | 'last_played'
  | 'not_available'

export type MusicErrorCode =
  | 'not_connected'
  | 'not_configured'
  | 'token_expired'
  | 'fetch_failed'
  | 'unauthorized'
  | 'invalid_response'

export type NormalizedTrack = {
  provider: MusicProvider
  status: NormalizedPlaybackStatus
  trackName: string | null
  artistName: string | null
  albumName: string | null
  albumArtUrl: string | null
  externalUrl: string | null
  playedAt: string | null
  isPlaying: boolean
  raw?: unknown
}

export type ProviderStatusResult = {
  track: NormalizedTrack
  error: MusicErrorCode | null
}

export type MusicStatusResponse = {
  spotify: NormalizedTrack
  appleMusic: NormalizedTrack
  errors: {
    spotify: MusicErrorCode | null
    appleMusic: MusicErrorCode | null
  }
}

export function notAvailable(
  provider: MusicProvider,
  overrides: Partial<NormalizedTrack> = {}
): NormalizedTrack {
  return {
    provider,
    status: 'not_available',
    trackName: null,
    artistName: null,
    albumName: null,
    albumArtUrl: null,
    externalUrl: null,
    playedAt: null,
    isPlaying: false,
    ...overrides,
  }
}

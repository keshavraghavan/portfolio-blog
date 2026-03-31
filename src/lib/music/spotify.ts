import { clearMusicCache, getLastSuccessfulMusicCache, getMusicCache, setMusicCache } from 'src/lib/music/cache'
import { getSpotifyRedirectUri, isSpotifyConfigured } from 'src/lib/music/env'
import { clearSpotifyConnection, getMusicConnection, saveSpotifyTokens } from 'src/lib/music/store'
import {
  MusicErrorCode,
  NormalizedTrack,
  ProviderStatusResult,
  notAvailable,
} from 'src/lib/music/types'

const SPOTIFY_CACHE_KEY = 'music:spotify'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_CURRENTLY_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1'
const SPOTIFY_SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
]

type SpotifyCurrentPlayback = {
  is_playing?: boolean
  item?: {
    name?: string
    external_urls?: {
      spotify?: string
    }
    artists?: Array<{
      name?: string
    }>
    album?: {
      name?: string
      images?: Array<{
        url?: string
      }>
    }
  }
}

type SpotifyRecentlyPlayed = {
  items?: Array<{
    played_at?: string
    track?: {
      name?: string
      external_urls?: {
        spotify?: string
      }
      artists?: Array<{
        name?: string
      }>
      album?: {
        name?: string
        images?: Array<{
          url?: string
        }>
      }
    }
  }>
}

type SpotifyRecentlyPlayedItem = NonNullable<SpotifyRecentlyPlayed['items']>[number]

type SpotifyTokenResponse = {
  access_token: string
  token_type: string
  scope?: string
  expires_in: number
  refresh_token?: string
}

class SpotifyStatusError extends Error {
  constructor(
    public code: MusicErrorCode,
    message: string
  ) {
    super(message)
  }
}

function getSpotifyTokenAuthHeader() {
  const clientId = process.env.SPOTIFY_CLIENT_ID ?? ''
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? ''
  return Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
}

function getSpotifyAlbumArt(images?: Array<{ url?: string }>) {
  return images?.[0]?.url ?? null
}

function getSpotifyArtistName(artists?: Array<{ name?: string }>) {
  return artists?.map((artist) => artist.name).filter(Boolean).join(', ') || null
}

function normalizeSpotifyCurrentPlayback(
  payload: SpotifyCurrentPlayback
): NormalizedTrack {
  return {
    provider: 'spotify',
    status: 'playing_now',
    trackName: payload.item?.name ?? null,
    artistName: getSpotifyArtistName(payload.item?.artists),
    albumName: payload.item?.album?.name ?? null,
    albumArtUrl: getSpotifyAlbumArt(payload.item?.album?.images),
    externalUrl: payload.item?.external_urls?.spotify ?? null,
    playedAt: new Date().toISOString(),
    isPlaying: true,
    raw: payload,
  }
}

function normalizeSpotifyRecentlyPlayed(
  payload: SpotifyRecentlyPlayedItem
): NormalizedTrack {
  return {
    provider: 'spotify',
    status: 'last_played',
    trackName: payload?.track?.name ?? null,
    artistName: getSpotifyArtistName(payload?.track?.artists),
    albumName: payload?.track?.album?.name ?? null,
    albumArtUrl: getSpotifyAlbumArt(payload?.track?.album?.images),
    externalUrl: payload?.track?.external_urls?.spotify ?? null,
    playedAt: payload?.played_at ?? null,
    isPlaying: false,
    raw: payload,
  }
}

function getSpotifyCacheTtl(track: NormalizedTrack) {
  if (track.status === 'playing_now') {
    return 15_000
  }

  if (track.status === 'last_played') {
    return 45_000
  }

  return 30_000
}

async function requestSpotifyToken(params: URLSearchParams) {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getSpotifyTokenAuthHeader()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new SpotifyStatusError(
      response.status === 401 || response.status === 400
        ? 'token_expired'
        : 'fetch_failed',
      `Spotify token request failed with status ${response.status}`
    )
  }

  return (await response.json()) as SpotifyTokenResponse
}

async function ensureSpotifyAccessToken(forceRefresh = false) {
  const connection = await getMusicConnection()

  if (!connection?.spotifyConnected || !connection.spotifyRefreshToken) {
    throw new SpotifyStatusError('not_connected', 'Spotify is not connected')
  }

  const expiresAt = connection.spotifyTokenExpiresAt
    ? new Date(connection.spotifyTokenExpiresAt).getTime()
    : 0

  const shouldRefresh =
    forceRefresh ||
    !connection.spotifyAccessToken ||
    !expiresAt ||
    expiresAt <= Date.now() + 60_000

  if (!shouldRefresh) {
    return connection.spotifyAccessToken
  }

  const token = await requestSpotifyToken(
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.spotifyRefreshToken,
    })
  )

  const nextExpiresAt = new Date(Date.now() + token.expires_in * 1000)

  await saveSpotifyTokens({
    accessToken: token.access_token,
    refreshToken: token.refresh_token ?? connection.spotifyRefreshToken,
    expiresAt: nextExpiresAt,
  })

  return token.access_token
}

async function spotifyApiRequest<T>(url: string, forceRefresh = false) {
  const accessToken = await ensureSpotifyAccessToken(forceRefresh)
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (response.status === 401 && !forceRefresh) {
    return spotifyApiRequest<T>(url, true)
  }

  if (response.status === 204) {
    return {
      response,
      data: null as T | null,
    }
  }

  if (!response.ok) {
    throw new SpotifyStatusError(
      response.status === 401 ? 'token_expired' : 'fetch_failed',
      `Spotify API request failed with status ${response.status}`
    )
  }

  return {
    response,
    data: (await response.json()) as T,
  }
}

function getSpotifyStaleFallback(error: MusicErrorCode): ProviderStatusResult {
  const stale = getLastSuccessfulMusicCache<NormalizedTrack>(SPOTIFY_CACHE_KEY)

  if (stale) {
    return {
      track: stale,
      error,
    }
  }

  return {
    track: notAvailable('spotify'),
    error,
  }
}

export function buildSpotifyAuthorizeUrl(origin?: string, state?: string) {
  const url = new URL(SPOTIFY_AUTHORIZE_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', process.env.SPOTIFY_CLIENT_ID ?? '')
  url.searchParams.set('scope', SPOTIFY_SCOPES.join(' '))
  url.searchParams.set('redirect_uri', getSpotifyRedirectUri(origin))
  url.searchParams.set('show_dialog', 'false')

  if (state) {
    url.searchParams.set('state', state)
  }

  return url.toString()
}

export async function exchangeSpotifyCode(code: string, origin?: string) {
  const token = await requestSpotifyToken(
    new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: getSpotifyRedirectUri(origin),
    })
  )

  await saveSpotifyTokens({
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: new Date(Date.now() + token.expires_in * 1000),
  })

  clearMusicCache(SPOTIFY_CACHE_KEY)
}

export async function getSpotifyStatus(): Promise<ProviderStatusResult> {
  const cached = getMusicCache<NormalizedTrack>(SPOTIFY_CACHE_KEY)
  if (cached) {
    return { track: cached, error: null }
  }

  if (!isSpotifyConfigured()) {
    return {
      track: notAvailable('spotify'),
      error: 'not_configured',
    }
  }

  try {
    const current = await spotifyApiRequest<SpotifyCurrentPlayback>(
      SPOTIFY_CURRENTLY_PLAYING_URL
    )

    if (current.data?.is_playing && current.data.item) {
      const track = normalizeSpotifyCurrentPlayback(current.data)
      setMusicCache(SPOTIFY_CACHE_KEY, track, getSpotifyCacheTtl(track))
      return { track, error: null }
    }

    const recent = await spotifyApiRequest<SpotifyRecentlyPlayed>(
      SPOTIFY_RECENTLY_PLAYED_URL
    )
    const latest = recent.data?.items?.[0]

    if (latest?.track) {
      const track = normalizeSpotifyRecentlyPlayed(latest)
      setMusicCache(SPOTIFY_CACHE_KEY, track, getSpotifyCacheTtl(track))
      return { track, error: null }
    }

    const track = notAvailable('spotify')
    setMusicCache(SPOTIFY_CACHE_KEY, track, getSpotifyCacheTtl(track))
    return { track, error: null }
  } catch (error) {
    if (error instanceof SpotifyStatusError) {
      if (error.code === 'token_expired') {
        await clearSpotifyConnection()
      }

      return getSpotifyStaleFallback(error.code)
    }

    console.error('Failed to fetch Spotify status:', error)
    return getSpotifyStaleFallback('fetch_failed')
  }
}

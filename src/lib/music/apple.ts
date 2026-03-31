import { createPrivateKey, sign } from 'node:crypto'
import { clearMusicCache, getLastSuccessfulMusicCache, getMusicCache, setMusicCache } from 'src/lib/music/cache'
import { isAppleMusicConfigured } from 'src/lib/music/env'
import { clearAppleMusicConnection, getMusicConnection } from 'src/lib/music/store'
import {
  MusicErrorCode,
  NormalizedTrack,
  ProviderStatusResult,
  notAvailable,
} from 'src/lib/music/types'

const APPLE_CACHE_KEY = 'music:apple'
const APPLE_RECENTLY_PLAYED_URL = 'https://api.music.apple.com/v1/me/recent/played/tracks'

type AppleRecentTrack = {
  id?: string
  attributes?: {
    name?: string
    artistName?: string
    albumName?: string
    url?: string
    lastPlayedDate?: string
    artwork?: {
      url?: string
    }
  }
}

type AppleRecentlyPlayedResponse = {
  data?: AppleRecentTrack[]
}

class AppleStatusError extends Error {
  constructor(
    public code: MusicErrorCode,
    message: string
  ) {
    super(message)
  }
}

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function readDerLength(buffer: Buffer, offset: number) {
  const initial = buffer[offset]

  if ((initial & 0x80) === 0) {
    return {
      length: initial,
      bytesRead: 1,
    }
  }

  const size = initial & 0x7f
  let length = 0

  for (let index = 0; index < size; index += 1) {
    length = (length << 8) | buffer[offset + 1 + index]
  }

  return {
    length,
    bytesRead: size + 1,
  }
}

function derToJose(signature: Buffer, outputLength: number) {
  let offset = 0

  if (signature[offset] !== 0x30) {
    throw new Error('Invalid DER signature')
  }

  offset += 1
  const sequenceLength = readDerLength(signature, offset)
  offset += sequenceLength.bytesRead

  if (signature[offset] !== 0x02) {
    throw new Error('Invalid DER signature')
  }

  offset += 1
  const rLength = readDerLength(signature, offset)
  offset += rLength.bytesRead
  const r = signature.slice(offset, offset + rLength.length)
  offset += rLength.length

  if (signature[offset] !== 0x02) {
    throw new Error('Invalid DER signature')
  }

  offset += 1
  const sLength = readDerLength(signature, offset)
  offset += sLength.bytesRead
  const s = signature.slice(offset, offset + sLength.length)

  const numberSize = outputLength / 2
  const normalizedR = r.length > numberSize ? r.slice(-numberSize) : r
  const normalizedS = s.length > numberSize ? s.slice(-numberSize) : s
  const paddedR = Buffer.concat([
    Buffer.alloc(numberSize - normalizedR.length, 0),
    normalizedR,
  ])
  const paddedS = Buffer.concat([
    Buffer.alloc(numberSize - normalizedS.length, 0),
    normalizedS,
  ])

  return base64UrlEncode(Buffer.concat([paddedR, paddedS]))
}

function getAppleArtworkUrl(artworkUrl?: string) {
  if (!artworkUrl) {
    return null
  }

  return artworkUrl
    .replace('{w}', '240')
    .replace('{h}', '240')
    .replace('{f}', 'jpg')
    .replace('{c}', 'bb')
}

function normalizeAppleTrack(track: AppleRecentTrack): NormalizedTrack {
  return {
    provider: 'apple_music',
    status: 'last_played',
    trackName: track.attributes?.name ?? null,
    artistName: track.attributes?.artistName ?? null,
    albumName: track.attributes?.albumName ?? null,
    albumArtUrl: getAppleArtworkUrl(track.attributes?.artwork?.url),
    externalUrl: track.attributes?.url ?? null,
    playedAt: track.attributes?.lastPlayedDate ?? null,
    isPlaying: false,
    raw: track,
  }
}

function getAppleStaleFallback(error: MusicErrorCode): ProviderStatusResult {
  const stale = getLastSuccessfulMusicCache<NormalizedTrack>(APPLE_CACHE_KEY)

  if (stale) {
    return {
      track: stale,
      error,
    }
  }

  return {
    track: notAvailable('apple_music'),
    error,
  }
}

function getApplePrivateKey() {
  return (process.env.APPLE_MUSIC_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
}

export function getAppleDeveloperToken() {
  if (!isAppleMusicConfigured()) {
    throw new AppleStatusError(
      'not_configured',
      'Apple Music is not configured'
    )
  }

  const header = {
    alg: 'ES256',
    kid: process.env.APPLE_MUSIC_KEY_ID,
    typ: 'JWT',
  }
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = {
    iss: process.env.APPLE_MUSIC_TEAM_ID,
    iat: issuedAt,
    exp: issuedAt + 60 * 60,
  }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = sign(
    'sha256',
    Buffer.from(signingInput),
    createPrivateKey(getApplePrivateKey())
  )

  return `${signingInput}.${derToJose(signature, 64)}`
}

export async function getAppleMusicStatus(): Promise<ProviderStatusResult> {
  const cached = getMusicCache<NormalizedTrack>(APPLE_CACHE_KEY)
  if (cached) {
    return { track: cached, error: null }
  }

  if (!isAppleMusicConfigured()) {
    return {
      track: notAvailable('apple_music'),
      error: 'not_configured',
    }
  }

  try {
    const connection = await getMusicConnection()

    if (!connection?.appleConnected || !connection.appleMusicUserToken) {
      return {
        track: notAvailable('apple_music'),
        error: 'not_connected',
      }
    }

    const response = await fetch(APPLE_RECENTLY_PLAYED_URL, {
      headers: {
        Authorization: `Bearer ${getAppleDeveloperToken()}`,
        'Music-User-Token': connection.appleMusicUserToken,
      },
      cache: 'no-store',
    })

    if (response.status === 401 || response.status === 403) {
      await clearAppleMusicConnection()
      return getAppleStaleFallback('token_expired')
    }

    if (!response.ok) {
      throw new AppleStatusError(
        'fetch_failed',
        `Apple Music request failed with status ${response.status}`
      )
    }

    const payload = (await response.json()) as AppleRecentlyPlayedResponse
    const latest = payload.data?.[0]

    if (!latest) {
      const track = notAvailable('apple_music')
      setMusicCache(APPLE_CACHE_KEY, track, 60_000)
      return { track, error: null }
    }

    const track = normalizeAppleTrack(latest)
    setMusicCache(APPLE_CACHE_KEY, track, 60_000)
    return { track, error: null }
  } catch (error) {
    if (error instanceof AppleStatusError) {
      return getAppleStaleFallback(error.code)
    }

    console.error('Failed to fetch Apple Music status:', error)
    return getAppleStaleFallback('fetch_failed')
  }
}

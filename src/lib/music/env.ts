import { baseUrl } from 'src/lib/site'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export function getSiteUrl(origin?: string) {
  return trimTrailingSlash(
    process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      origin ||
      baseUrl
  )
}

export function getSpotifyRedirectUri(origin?: string) {
  return (
    process.env.SPOTIFY_REDIRECT_URI ||
    `${getSiteUrl(origin)}/api/auth/spotify/callback`
  )
}

export function isSpotifyConfigured() {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
  )
}

export function isAppleMusicFeatureEnabled() {
  return process.env.ENABLE_APPLE_MUSIC === 'true'
}

export function isAppleMusicConfigured() {
  return (
    isAppleMusicFeatureEnabled() &&
    Boolean(
    process.env.APPLE_MUSIC_TEAM_ID &&
      process.env.APPLE_MUSIC_KEY_ID &&
      process.env.APPLE_MUSIC_PRIVATE_KEY
    )
  )
}

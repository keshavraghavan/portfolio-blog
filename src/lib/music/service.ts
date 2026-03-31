import { getAppleMusicStatus } from 'src/lib/music/apple'
import { getSpotifyStatus } from 'src/lib/music/spotify'
import { MusicStatusResponse, notAvailable } from 'src/lib/music/types'

export async function getUnifiedMusicStatus(): Promise<MusicStatusResponse> {
  const [spotifyResult, appleResult] = await Promise.allSettled([
    getSpotifyStatus(),
    getAppleMusicStatus(),
  ])

  if (spotifyResult.status === 'rejected') {
    console.error('Spotify status request failed:', spotifyResult.reason)
  }

  if (appleResult.status === 'rejected') {
    console.error('Apple Music status request failed:', appleResult.reason)
  }

  return {
    spotify:
      spotifyResult.status === 'fulfilled'
        ? spotifyResult.value.track
        : notAvailable('spotify'),
    appleMusic:
      appleResult.status === 'fulfilled'
        ? appleResult.value.track
        : notAvailable('apple_music'),
    errors: {
      spotify:
        spotifyResult.status === 'fulfilled'
          ? spotifyResult.value.error
          : 'fetch_failed',
      appleMusic:
        appleResult.status === 'fulfilled'
          ? appleResult.value.error
          : 'fetch_failed',
    },
  }
}

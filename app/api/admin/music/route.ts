import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from 'src/lib/admin-server'
import {
  isAppleMusicConfigured,
  isAppleMusicFeatureEnabled,
  isSpotifyConfigured,
} from 'src/lib/music/env'
import { getUnifiedMusicStatus } from 'src/lib/music/service'
import { getMusicConnection } from 'src/lib/music/store'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [status, connection] = await Promise.all([
      getUnifiedMusicStatus(),
      getMusicConnection(),
    ])

    return NextResponse.json({
      status,
      connections: {
        spotifyConnected: connection?.spotifyConnected ?? false,
        appleConnected: connection?.appleConnected ?? false,
      },
      configuration: {
        spotifyReady: isSpotifyConfigured(),
        appleReady: isAppleMusicConfigured(),
        appleEnabled: isAppleMusicFeatureEnabled(),
      },
    })
  } catch (error) {
    console.error('Failed to fetch music admin state:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

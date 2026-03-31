import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from 'src/lib/admin-server'
import { clearMusicCache } from 'src/lib/music/cache'
import { clearSpotifyConnection } from 'src/lib/music/store'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await clearSpotifyConnection()
    clearMusicCache('music:spotify')
    revalidatePath('/')
    revalidatePath('/admin/music')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to disconnect Spotify:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from 'src/lib/admin-server'
import { isSpotifyConfigured } from 'src/lib/music/env'
import { buildSpotifyAuthorizeUrl } from 'src/lib/music/spotify'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSpotifyConfigured()) {
    return NextResponse.json(
      { error: 'Spotify is not configured' },
      { status: 400 }
    )
  }

  const state = crypto.randomUUID()
  const response = NextResponse.redirect(
    buildSpotifyAuthorizeUrl(request.nextUrl.origin, state)
  )

  response.cookies.set('spotify_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    path: '/',
  })

  return response
}

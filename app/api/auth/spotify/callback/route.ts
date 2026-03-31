import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { exchangeSpotifyCode } from 'src/lib/music/spotify'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get('spotify_oauth_state')?.value
  const redirectUrl = new URL('/admin/music', request.url)

  if (!code || !state || !storedState || state !== storedState) {
    redirectUrl.searchParams.set('error', 'spotify_oauth_failed')
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.delete('spotify_oauth_state')
    return response
  }

  try {
    await exchangeSpotifyCode(code, request.nextUrl.origin)
    revalidatePath('/')
    revalidatePath('/admin/music')
    redirectUrl.searchParams.set('connected', 'spotify')
  } catch (error) {
    console.error('Spotify callback failed:', error)
    redirectUrl.searchParams.set('error', 'spotify_callback_failed')
  }

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.delete('spotify_oauth_state')
  return response
}

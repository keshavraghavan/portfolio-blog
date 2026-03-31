import { NextRequest, NextResponse } from 'next/server'
import { getUnifiedMusicStatus } from 'src/lib/music/service'

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('provider')
  const payload = await getUnifiedMusicStatus()

  if (provider === 'spotify') {
    return NextResponse.json(payload.spotify, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  if (provider === 'apple' || provider === 'apple_music') {
    return NextResponse.json(payload.appleMusic, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

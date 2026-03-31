import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminRequest } from 'src/lib/admin-server'
import { clearMusicCache } from 'src/lib/music/cache'
import { saveAppleMusicUserToken } from 'src/lib/music/store'

const appleUserTokenSchema = z.object({
  musicUserToken: z.string().min(1),
})

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = appleUserTokenSchema.parse(body)

    await saveAppleMusicUserToken(parsed.musicUserToken)
    clearMusicCache('music:apple')
    revalidatePath('/')
    revalidatePath('/admin/music')

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Failed to save Apple Music user token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

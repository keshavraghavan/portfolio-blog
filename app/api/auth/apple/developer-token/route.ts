import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from 'src/lib/admin-server'
import { getAppleDeveloperToken } from 'src/lib/music/apple'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return NextResponse.json({
      developerToken: getAppleDeveloperToken(),
    })
  } catch (error) {
    console.error('Failed to create Apple developer token:', error)
    return NextResponse.json(
      { error: 'Apple Music is not configured' },
      { status: 400 }
    )
  }
}

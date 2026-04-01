import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from 'src/db'
import { pageViews } from 'src/db/schema'

const pageViewSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const parsed = pageViewSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { slug } = parsed.data

    const [record] = await db
      .insert(pageViews)
      .values({
        pageSlug: slug,
        viewCount: 1,
      })
      .onConflictDoUpdate({
        target: pageViews.pageSlug,
        set: {
          viewCount: sql`${pageViews.viewCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({
        count: pageViews.viewCount,
      })

    return NextResponse.json({ count: record.count })
  } catch (error) {
    console.error('Failed to update page views:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

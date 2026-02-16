import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { db } from 'src/db';
import { comments } from 'src/db/schema';
import { eq, asc, and } from 'drizzle-orm';

const commentSchema = z.object({
  authorName: z.string().min(1).max(100),
  body: z.string().min(1).max(2000),
  pageSlug: z.string().min(1),
  honeypot: z.string().optional(),
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing required query parameter: slug' },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .select()
      .from(comments)
      .where(and(eq(comments.pageSlug, slug), eq(comments.isApproved, true)))
      .orderBy(asc(comments.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const json = await request.json();
    const parsed = commentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { authorName, body, pageSlug, honeypot } = parsed.data;

    if (honeypot) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    const [newComment] = await db
      .insert(comments)
      .values({ authorName, body, pageSlug })
      .returning();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

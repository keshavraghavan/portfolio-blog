import { NextRequest, NextResponse } from 'next/server';
import { db } from 'src/db';
import { comments } from 'src/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

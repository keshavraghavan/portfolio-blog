import { NextRequest, NextResponse } from 'next/server';
import { db } from 'src/db';
import { comments } from 'src/db/schema';
import { eq } from 'drizzle-orm';

type RouteParams = { params: Promise<{ id: string }> };

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [updated] = await db
      .update(comments)
      .set({ isApproved: true })
      .where(eq(comments.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to approve comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

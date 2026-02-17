import { NextRequest, NextResponse } from 'next/server';
import { db } from 'src/db';
import { posts } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { slugify } from 'src/lib/slugify';

const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  publishedAt: z.string().min(1).optional(),
  image: z.string().optional().nullable(),
  isDraft: z.boolean().optional(),
});

function authorize(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = UpdatePostSchema.parse(body);

    const updates: Record<string, unknown> = {
      ...parsed,
      updatedAt: new Date(),
    };

    if (parsed.title) {
      updates.slug = slugify(parsed.title);

      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, updates.slug as string))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== id) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    revalidatePath('/blog');
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const [deleted] = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    revalidatePath('/blog');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

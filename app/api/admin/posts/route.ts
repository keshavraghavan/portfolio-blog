import { NextRequest, NextResponse } from 'next/server';
import { db } from 'src/db';
import { posts } from 'src/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { slugify } from 'src/lib/slugify';
import { randomUUID } from 'crypto';

const CreatePostSchema = z.object({
  title: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  body: z.string().optional().default(''),
  publishedAt: z.string().optional().default(''),
  image: z.string().optional().nullable(),
  isDraft: z.boolean().optional().default(false),
});

function isBlank(value: string) {
  return value.trim().length === 0;
}

function resolveSlug(title: string, id: string) {
  const slug = slugify(title.trim());
  return slug || `draft-${id}`;
}

function authorize(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CreatePostSchema.parse(body);
    const id = randomUUID();
    let slug = resolveSlug(parsed.title, id);

    if (
      !parsed.isDraft &&
      [parsed.title, parsed.summary, parsed.body, parsed.publishedAt].some(isBlank)
    ) {
      return NextResponse.json(
        { error: 'Title, summary, body, and publish date are required to publish.' },
        { status: 400 }
      );
    }

    if (slugify(parsed.title.trim())) {
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        if (parsed.isDraft) {
          slug = `${slug}-${id.slice(0, 8)}`;
        } else {
          return NextResponse.json(
            { error: 'A post with this slug already exists' },
            { status: 409 }
          );
        }
      }
    }

    if (!parsed.isDraft) {
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const [created] = await db
      .insert(posts)
      .values({
        id,
        slug,
        title: parsed.title,
        summary: parsed.summary,
        body: parsed.body,
        publishedAt: parsed.publishedAt,
        image: parsed.image ?? null,
        isDraft: parsed.isDraft,
      })
      .returning();

    revalidatePath('/blog');
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

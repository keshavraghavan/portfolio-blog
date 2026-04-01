import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    body: text('body').notNull(),
    image: text('image'),
    publishedAt: text('published_at').notNull(),
    isDraft: boolean('is_draft').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('posts_slug_idx').on(table.slug),
  ]
);

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageSlug: text('page_slug').notNull(),
    authorName: text('author_name').notNull(),
    body: text('body').notNull(),
    parentId: uuid('parent_id').references(() => comments.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    isApproved: boolean('is_approved').default(false).notNull(),
  },
  (table) => [
    index('comments_page_slug_idx').on(table.pageSlug),
  ]
);

export const pageViews = pgTable(
  'page_views',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageSlug: text('page_slug').unique().notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('page_views_page_slug_idx').on(table.pageSlug),
  ]
);

export const musicConnections = pgTable('music_connections', {
  id: text('id').primaryKey().default('default'),
  spotifyConnected: boolean('spotify_connected').default(false).notNull(),
  spotifyAccessToken: text('spotify_access_token'),
  spotifyRefreshToken: text('spotify_refresh_token'),
  spotifyTokenExpiresAt: timestamp('spotify_token_expires_at', {
    withTimezone: true,
  }),
  appleConnected: boolean('apple_connected').default(false).notNull(),
  appleMusicUserToken: text('apple_music_user_token'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

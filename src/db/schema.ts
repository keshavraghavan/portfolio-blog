import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core';

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

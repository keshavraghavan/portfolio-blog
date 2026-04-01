CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_slug" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_views_page_slug_unique" UNIQUE("page_slug")
);
--> statement-breakpoint
CREATE INDEX "page_views_page_slug_idx" ON "page_views" USING btree ("page_slug");
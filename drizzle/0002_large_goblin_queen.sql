CREATE TABLE "music_connections" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"spotify_connected" boolean DEFAULT false NOT NULL,
	"spotify_access_token" text,
	"spotify_refresh_token" text,
	"spotify_token_expires_at" timestamp with time zone,
	"apple_connected" boolean DEFAULT false NOT NULL,
	"apple_music_user_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

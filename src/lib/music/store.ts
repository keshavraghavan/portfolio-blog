import { eq } from 'drizzle-orm'
import { db } from 'src/db'
import { musicConnections } from 'src/db/schema'

const MUSIC_CONNECTION_ID = 'default'

export async function ensureMusicConnection() {
  await db
    .insert(musicConnections)
    .values({ id: MUSIC_CONNECTION_ID })
    .onConflictDoNothing()

  const [connection] = await db
    .select()
    .from(musicConnections)
    .where(eq(musicConnections.id, MUSIC_CONNECTION_ID))
    .limit(1)

  return connection
}

export async function getMusicConnection() {
  return ensureMusicConnection()
}

export async function saveSpotifyTokens({
  accessToken,
  refreshToken,
  expiresAt,
}: {
  accessToken: string
  refreshToken?: string | null
  expiresAt: Date
}) {
  await ensureMusicConnection()

  const updates: Record<string, unknown> = {
    spotifyConnected: true,
    spotifyAccessToken: accessToken,
    spotifyTokenExpiresAt: expiresAt,
    updatedAt: new Date(),
  }

  if (typeof refreshToken !== 'undefined') {
    updates.spotifyRefreshToken = refreshToken
  }

  await db
    .update(musicConnections)
    .set(updates)
    .where(eq(musicConnections.id, MUSIC_CONNECTION_ID))
}

export async function clearSpotifyConnection() {
  await ensureMusicConnection()

  await db
    .update(musicConnections)
    .set({
      spotifyConnected: false,
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
      spotifyTokenExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(musicConnections.id, MUSIC_CONNECTION_ID))
}

export async function saveAppleMusicUserToken(musicUserToken: string) {
  await ensureMusicConnection()

  await db
    .update(musicConnections)
    .set({
      appleConnected: true,
      appleMusicUserToken: musicUserToken,
      updatedAt: new Date(),
    })
    .where(eq(musicConnections.id, MUSIC_CONNECTION_ID))
}

export async function clearAppleMusicConnection() {
  await ensureMusicConnection()

  await db
    .update(musicConnections)
    .set({
      appleConnected: false,
      appleMusicUserToken: null,
      updatedAt: new Date(),
    })
    .where(eq(musicConnections.id, MUSIC_CONNECTION_ID))
}

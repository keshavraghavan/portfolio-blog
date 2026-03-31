const cache = new Map<
  string,
  {
    expiresAt: number
    value: unknown
    lastSuccessfulValue: unknown
  }
>()

export function getMusicCache<T>(key: string) {
  const entry = cache.get(key)

  if (!entry) {
    return null
  }

  if (entry.expiresAt <= Date.now()) {
    return null
  }

  return entry.value as T
}

export function getLastSuccessfulMusicCache<T>(key: string) {
  const entry = cache.get(key)
  return (entry?.lastSuccessfulValue as T | undefined) ?? null
}

export function setMusicCache<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
    lastSuccessfulValue: value,
  })
}

export function clearMusicCache(key?: string) {
  if (!key) {
    cache.clear()
    return
  }

  cache.delete(key)
}

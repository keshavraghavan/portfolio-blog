export function getSecret(): string {
  const match = document.cookie.match(/(?:^|; )admin-secret=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function setSecret(value: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `admin-secret=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

export function clearSecret() {
  document.cookie = 'admin-secret=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

export function fetcher(url: string) {
  const secret = getSecret();
  return fetch(url, {
    headers: { 'x-admin-secret': secret },
  }).then((res) => {
    if (res.status === 401) throw new Error('Unauthorized');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });
}

export function adminFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'x-admin-secret': getSecret(),
    },
  });
}

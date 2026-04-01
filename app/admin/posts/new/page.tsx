'use client';

import { useState } from 'react';
import { getSecret, setSecret, clearSecret, adminFetch } from 'src/lib/admin-auth';
import { PostEditor } from 'src/components/admin/PostEditor';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setSecret(password);

    try {
      const res = await fetch('/api/admin/posts', {
        headers: { 'x-admin-secret': password },
      });
      if (res.status === 401) {
        clearSecret();
        setError('Invalid secret.');
        return;
      }
      onLogin();
    } catch {
      clearSecret();
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <label
        htmlFor="adminSecret"
        className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1"
      >
        Admin Secret
      </label>
      <input
        id="adminSecret"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin secret"
        className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all mb-4"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Verifying...' : 'Sign In'}
      </button>
    </form>
  );
}

export default function NewPostPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!getSecret();
  });

  return (
    <section>
      <h1 className="font-semibold text-2xl tracking-tighter mb-8">
        New Post
      </h1>
      {authed ? (
        <PostEditor mode="new" />
      ) : (
        <LoginForm onLogin={() => setAuthed(true)} />
      )}
    </section>
  );
}

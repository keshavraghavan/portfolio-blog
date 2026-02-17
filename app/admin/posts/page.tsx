'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { getSecret, setSecret, clearSecret, fetcher, adminFetch } from 'src/lib/admin-auth';

type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  isDraft: boolean;
  createdAt: string;
};

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

type Tab = 'published' | 'drafts';

function PostsDashboard() {
  const { data: posts, mutate } = useSWR<Post[]>(
    '/api/admin/posts',
    fetcher
  );
  const [activeTab, setActiveTab] = useState<Tab>('published');

  const published = posts?.filter((p) => !p.isDraft) ?? [];
  const drafts = posts?.filter((p) => p.isDraft) ?? [];
  const shown = activeTab === 'published' ? published : drafts;

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const optimistic = posts?.filter((p) => p.id !== id);
    mutate(optimistic, false);

    const res = await adminFetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) mutate();
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'published', label: 'Published', count: published.length },
    { key: 'drafts', label: 'Drafts', count: drafts.length },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 text-sm font-medium tracking-tight rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 text-sm font-medium tracking-tight text-white dark:text-black bg-neutral-900 dark:bg-neutral-100 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
        >
          New Post
        </Link>
      </div>

      {!posts ? (
        <p className="text-neutral-400">Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No {activeTab === 'published' ? 'published' : 'draft'} posts.
        </p>
      ) : (
        shown.map((post) => (
          <div
            key={post.id}
            className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
              <span className="font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
                {post.title}
              </span>
              <span className="text-sm text-neutral-400 tabular-nums">
                {post.publishedAt}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  post.isDraft
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                {post.isDraft ? 'Draft' : 'Published'}
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {post.summary}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="px-3 py-1 text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 text-sm font-medium tracking-tight text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default function AdminPostsPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!getSecret();
  });

  return (
    <section>
      <h1 className="font-semibold text-2xl tracking-tighter mb-8">
        Post Management
      </h1>
      {authed ? (
        <PostsDashboard />
      ) : (
        <LoginForm onLogin={() => setAuthed(true)} />
      )}
    </section>
  );
}

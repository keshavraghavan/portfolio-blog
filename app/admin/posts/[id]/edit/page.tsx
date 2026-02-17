'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getSecret, setSecret, clearSecret, adminFetch } from 'src/lib/admin-auth';

type Post = {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  image: string | null;
  isDraft: boolean;
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

function PostEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await adminFetch(`/api/admin/posts/${id}`);
        if (!res.ok) {
          setError('Failed to load post.');
          return;
        }
        const post: Post = await res.json();
        setTitle(post.title);
        setSummary(post.summary);
        setPublishedAt(post.publishedAt);
        setImage(post.image || '');
        setBody(post.body);
        setIsDraft(post.isDraft);
      } catch {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleSave(draft: boolean) {
    setError('');
    setSaving(true);

    try {
      const res = await adminFetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          body,
          publishedAt,
          image: image || null,
          isDraft: draft,
        }),
      });

      if (res.status === 409) {
        setError('A post with this title/slug already exists.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save post.');
        return;
      }

      router.push('/admin/posts');
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-neutral-400">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
          placeholder="Post title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
          Summary
        </label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
          placeholder="Brief summary"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
            Published At
          </label>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
            placeholder="/images/post.jpg"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
          Body (Markdown)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all font-mono"
          placeholder="Write your post in markdown..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium tracking-tight text-white dark:text-black bg-neutral-900 dark:bg-neutral-100 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : 'Publish'}
        </button>
        <Link
          href="/admin/posts"
          className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
        >
          Back to Posts
        </Link>
      </div>
    </div>
  );
}

export default function EditPostPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!getSecret();
  });

  return (
    <section>
      <h1 className="font-semibold text-2xl tracking-tighter mb-8">
        Edit Post
      </h1>
      {authed ? (
        <PostEditor />
      ) : (
        <LoginForm onLogin={() => setAuthed(true)} />
      )}
    </section>
  );
}

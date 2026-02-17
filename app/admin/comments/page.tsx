'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from 'src/types/comment';
import { getSecret, setSecret, clearSecret, fetcher } from 'src/lib/admin-auth';

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
      const res = await fetch('/api/admin/comments', {
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

function AdminCommentCard({
  comment,
  onApprove,
  onDelete,
}: {
  comment: Comment;
  onApprove?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
        <span className="font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {comment.authorName}
        </span>
        <span className="text-sm text-neutral-400">
          on <span className="font-medium">{comment.pageSlug}</span>
        </span>
        <span className="text-sm text-neutral-400 tabular-nums">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap mb-3">
        {comment.body}
      </p>
      <div className="flex gap-2">
        {onApprove && (
          <button
            onClick={onApprove}
            className="px-3 py-1 text-sm font-medium tracking-tight text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-all"
          >
            Approve
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm font-medium tracking-tight text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

type Tab = 'pending' | 'approved';

function CommentsDashboard() {
  const { data: comments, mutate } = useSWR<Comment[]>(
    '/api/admin/comments',
    fetcher
  );
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  const pending = comments?.filter((c) => !c.isApproved) ?? [];
  const approved = comments?.filter((c) => c.isApproved) ?? [];
  const shown = activeTab === 'pending' ? pending : approved;

  const adminFetch = useCallback(
    (url: string, options: RequestInit) =>
      fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'x-admin-secret': getSecret(),
        },
      }),
    []
  );

  async function handleApprove(id: string) {
    const optimistic = comments?.map((c) =>
      c.id === id ? { ...c, isApproved: true } : c
    );
    mutate(optimistic, false);

    const res = await adminFetch(`/api/comments/${id}`, { method: 'PATCH' });
    if (!res.ok) mutate();
  }

  async function handleDelete(id: string) {
    const optimistic = comments?.filter((c) => c.id !== id);
    mutate(optimistic, false);

    const res = await adminFetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (!res.ok) mutate();
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending', count: pending.length },
    { key: 'approved', label: 'Approved', count: approved.length },
  ];

  return (
    <>
      <div className="flex gap-1 mb-8">
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

      {!comments ? (
        <p className="text-neutral-400">Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No {activeTab} comments.
        </p>
      ) : (
        shown.map((comment) => (
          <AdminCommentCard
            key={comment.id}
            comment={comment}
            onApprove={
              activeTab === 'pending'
                ? () => handleApprove(comment.id)
                : undefined
            }
            onDelete={() => handleDelete(comment.id)}
          />
        ))
      )}
    </>
  );
}

export default function AdminCommentsPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!getSecret();
  });

  return (
    <section>
      <h1 className="font-semibold text-2xl tracking-tighter mb-8">
        Comment Moderation
      </h1>
      {authed ? (
        <CommentsDashboard />
      ) : (
        <LoginForm onLogin={() => setAuthed(true)} />
      )}
    </section>
  );
}

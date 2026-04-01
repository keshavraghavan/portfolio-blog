'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from 'src/lib/admin-auth';

type EditorMode = 'new' | 'edit';

type Post = {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  image: string | null;
  isDraft: boolean;
  updatedAt?: string;
};

type PersistedDraft = {
  postId: string | null;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  image: string;
  isDraft: boolean;
  updatedAt: number;
};

type SaveOptions = {
  autosave?: boolean;
  draft: boolean;
  redirectOnSuccess?: boolean;
};

type PostEditorProps = {
  mode: EditorMode;
  postId?: string;
};

const AUTOSAVE_INTERVAL_MS = 30_000;

function getStorageKey(mode: EditorMode, postId?: string) {
  if (mode === 'edit' && postId) {
    return `admin-post-editor:${postId}`;
  }

  return 'admin-post-editor:new';
}

function formatSavedAt(value: number | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

function hasMeaningfulContent(values: PersistedDraft) {
  return [
    values.title,
    values.summary,
    values.body,
    values.image,
    values.publishedAt,
  ].some((value) => value.trim().length > 0);
}

export function PostEditor({ mode, postId }: PostEditorProps) {
  const router = useRouter();
  const storageKey = useMemo(() => getStorageKey(mode, postId), [mode, postId]);

  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [isDraft, setIsDraft] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const hydratedRef = useRef(false);
  const applyingSnapshotRef = useRef(false);
  const saveInFlightRef = useRef(false);

  function buildSnapshot(overrides: Partial<PersistedDraft> = {}): PersistedDraft {
    return {
      postId: currentPostId,
      title,
      summary,
      body,
      publishedAt,
      image,
      isDraft,
      updatedAt: Date.now(),
      ...overrides,
    };
  }

  function applySnapshot(snapshot: PersistedDraft, markDirty: boolean) {
    applyingSnapshotRef.current = true;
    setCurrentPostId(snapshot.postId);
    setTitle(snapshot.title);
    setSummary(snapshot.summary);
    setBody(snapshot.body);
    setPublishedAt(snapshot.publishedAt);
    setImage(snapshot.image);
    setIsDraft(snapshot.isDraft);
    setDirty(markDirty);
  }

  function persistSnapshot(snapshot: PersistedDraft) {
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  }

  function clearPersistedSnapshot() {
    window.localStorage.removeItem(storageKey);
  }

  async function savePost({
    autosave = false,
    draft,
    redirectOnSuccess = false,
  }: SaveOptions) {
    const snapshot = buildSnapshot({
      isDraft: draft,
      postId: currentPostId,
      updatedAt: Date.now(),
    });

    if (autosave && !hasMeaningfulContent(snapshot)) {
      return;
    }

    if (saveInFlightRef.current) {
      return;
    }

    setError('');
    setSaving(true);
    saveInFlightRef.current = true;

    try {
      const targetId = currentPostId ?? snapshot.postId;
      const endpoint = targetId
        ? `/api/admin/posts/${targetId}`
        : '/api/admin/posts';
      const method = targetId ? 'PUT' : 'POST';

      const response = await adminFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: snapshot.title,
          summary: snapshot.summary,
          body: snapshot.body,
          publishedAt: snapshot.publishedAt,
          image: snapshot.image || null,
          isDraft: draft,
        }),
      });

      if (response.status === 409) {
        setError('A post with this title/slug already exists.');
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Failed to save post.');
        return;
      }

      const savedPost: Post = await response.json();
      const savedAt = Date.now();

      setCurrentPostId(savedPost.id);
      setIsDraft(savedPost.isDraft);
      setLastSavedAt(savedAt);
      setDirty(false);

      if (draft) {
        persistSnapshot({
          ...snapshot,
          postId: savedPost.id,
          isDraft: savedPost.isDraft,
          updatedAt: savedAt,
        });
      } else {
        clearPersistedSnapshot();
      }

      // After first save of a new post, transition to the edit URL so the
      // 'admin-post-editor:new' key is no longer used — prevents future
      // "New Post" visits from loading this draft.
      if (mode === 'new' && !currentPostId) {
        clearPersistedSnapshot();
        router.replace(`/admin/posts/${savedPost.id}/edit`);
        return;
      }

      if (redirectOnSuccess) {
        router.push('/admin/posts');
      }
    } catch {
      setError(autosave ? 'Autosave failed. Your local draft is still stored in this browser.' : 'Something went wrong.');
    } finally {
      saveInFlightRef.current = false;
      setSaving(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeEditor() {
      const persistedRaw = window.localStorage.getItem(storageKey);
      const persisted = persistedRaw
        ? (JSON.parse(persistedRaw) as PersistedDraft)
        : null;

      if (mode === 'edit' && postId) {
        try {
          const response = await adminFetch(`/api/admin/posts/${postId}`);

          if (!response.ok) {
            if (!cancelled) {
              setError('Failed to load post.');
            }
            return;
          }

          const post: Post = await response.json();
          const serverSnapshot: PersistedDraft = {
            postId: post.id,
            title: post.title,
            summary: post.summary,
            body: post.body,
            publishedAt: post.publishedAt,
            image: post.image || '',
            isDraft: post.isDraft,
            updatedAt: post.updatedAt ? new Date(post.updatedAt).getTime() : Date.now(),
          };

          if (cancelled) {
            return;
          }

          applySnapshot(persisted ?? serverSnapshot, Boolean(persisted));
          setLastSavedAt(serverSnapshot.updatedAt);
        } catch {
          if (!cancelled) {
            setError('Failed to load post.');
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }

        return;
      }

      const initialSnapshot: PersistedDraft = persisted ?? {
        postId: null,
        title: '',
        summary: '',
        body: '',
        publishedAt: new Date().toISOString().split('T')[0],
        image: '',
        isDraft: true,
        updatedAt: Date.now(),
      };

      applySnapshot(initialSnapshot, Boolean(persisted));
      setLoading(false);
    }

    initializeEditor().finally(() => {
      if (!cancelled) {
        hydratedRef.current = true;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mode, postId, storageKey]);

  useEffect(() => {
    if (!hydratedRef.current || loading) {
      return;
    }

    if (applyingSnapshotRef.current) {
      applyingSnapshotRef.current = false;
      return;
    }

    const snapshot = buildSnapshot();
    persistSnapshot(snapshot);
    setDirty(true);
  }, [body, currentPostId, image, isDraft, loading, publishedAt, storageKey, summary, title]);

  useEffect(() => {
    if (!hydratedRef.current || loading) {
      return;
    }

    const interval = window.setInterval(() => {
      if (!dirty) {
        return;
      }

      void savePost({
        autosave: true,
        draft: mode === 'new' ? true : isDraft,
      });
    }, AUTOSAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [
    body,
    currentPostId,
    dirty,
    image,
    isDraft,
    loading,
    mode,
    publishedAt,
    summary,
    title,
  ]);

  useEffect(() => {
    if (!hydratedRef.current || loading) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty && !saving) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dirty, loading, saving]);

  if (loading) {
    return <p className="text-neutral-400">Loading...</p>;
  }

  const savedAtLabel = formatSavedAt(lastSavedAt);

  return (
    <div className="max-w-2xl">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}

      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Autosaves every 30 seconds. Unsaved edits are also stored locally so a refresh or accidental close does not wipe the draft.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
          onChange={(event) => setSummary(event.target.value)}
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
            onChange={(event) => setPublishedAt(event.target.value)}
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
            onChange={(event) => setImage(event.target.value)}
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
          onChange={(event) => setBody(event.target.value)}
          rows={20}
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all font-mono"
          placeholder="Write your post in markdown..."
        />
      </div>

      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {saving
          ? 'Saving...'
          : dirty
            ? 'Changes pending autosave.'
            : savedAtLabel
              ? `Last saved at ${savedAtLabel}.`
              : 'No autosave yet.'}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => void savePost({ draft: true, redirectOnSuccess: true })}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => void savePost({ draft: false, redirectOnSuccess: true })}
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

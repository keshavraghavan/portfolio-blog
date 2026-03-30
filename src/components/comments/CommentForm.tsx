'use client';

import { useState, useRef, useEffect } from 'react';

interface CommentFormProps {
  slug: string;
  onSuccess: () => void;
  parentId?: string | null;
  replyingToName?: string | null;
  onCancelReply?: () => void;
}

export function CommentForm({
  slug,
  onSuccess,
  parentId = null,
  replyingToName = null,
  onCancelReply,
}: CommentFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyingToName) {
      setExpanded(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [replyingToName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!authorName.trim()) { setError('Name is required.'); return; }
    if (!body.trim()) { setError('Comment is required.'); return; }
    if (body.length > 2000) { setError('Comment must be 2000 characters or fewer.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim(),
          body: body.trim(),
          pageSlug: slug,
          honeypot,
          parentId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      setAuthorName('');
      setBody('');
      setExpanded(false);
      onSuccess();
      onCancelReply?.();
    } catch {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => {
          setExpanded(true);
          setTimeout(() => textareaRef.current?.focus(), 50);
        }}
        className="w-full border border-dashed border-warm-border dark:border-dark-border rounded-xl p-4 text-sm text-muted hover:border-muted transition-colors text-left"
      >
        Join the discussion...
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-4">
      {replyingToName && (
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs text-muted font-courier">
            Replying to {replyingToName}
          </p>
          <button
            type="button"
            onClick={() => { setExpanded(false); onCancelReply?.(); }}
            className="text-xs text-muted hover:text-near-black dark:hover:text-cream transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="mb-3">
        <label
          htmlFor={`authorName-${parentId ?? 'root'}`}
          className="block text-xs font-courier text-muted mb-1"
        >
          Name
        </label>
        <input
          id={`authorName-${parentId ?? 'root'}`}
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 text-sm bg-transparent border border-warm-border dark:border-dark-border rounded-lg text-near-black dark:text-cream placeholder:text-muted focus:outline-none focus:border-muted dark:focus:border-muted transition-all"
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor={`body-${parentId ?? 'root'}`}
          className="block text-xs font-courier text-muted mb-1"
        >
          Comment
        </label>
        <textarea
          id={`body-${parentId ?? 'root'}`}
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 text-sm bg-transparent border border-warm-border dark:border-dark-border rounded-lg text-near-black dark:text-cream placeholder:text-muted focus:outline-none focus:border-muted dark:focus:border-muted transition-all resize-y"
        />
        <span className="block text-xs text-muted mt-1 text-right tabular-nums font-courier">
          {body.length}/2000
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-courier text-near-black dark:text-cream border border-warm-border dark:border-dark-border rounded-lg hover:bg-surface-muted dark:hover:bg-dark-surface-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {!replyingToName && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="px-4 py-2 text-sm text-muted hover:text-near-black dark:hover:text-cream transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';

export function CommentForm({
  slug,
  onSuccess,
}: {
  slug: string;
  onSuccess: () => void;
}) {
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!authorName.trim()) {
      setError('Name is required.');
      return;
    }
    if (!body.trim()) {
      setError('Comment is required.');
      return;
    }
    if (body.length > 2000) {
      setError('Comment must be 2000 characters or fewer.');
      return;
    }

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
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      setAuthorName('');
      setBody('');
      onSuccess();
    } catch {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
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
      <div className="mb-4">
        <label
          htmlFor="authorName"
          className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1"
        >
          Name
        </label>
        <input
          id="authorName"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="commentBody"
          className="block text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 mb-1"
        >
          Comment
        </label>
        <textarea
          id="commentBody"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Leave a comment..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all resize-y"
        />
        <span className="block text-xs text-neutral-400 mt-1 text-right tabular-nums">
          {body.length}/2000
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

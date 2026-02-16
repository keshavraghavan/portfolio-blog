'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Comment } from 'src/types/comment';
import { CommentForm } from './CommentForm';
import { CommentCard } from './CommentCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CommentSection({ slug }: { slug: string }) {
  const { data: comments, mutate } = useSWR<Comment[]>(
    `/api/comments?slug=${slug}`,
    fetcher
  );
  const [showToast, setShowToast] = useState(false);

  function handleSuccess() {
    mutate();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  }

  return (
    <section className="mt-8">
      <h2 className="font-semibold text-2xl tracking-tighter mb-8">
        Comments{comments && comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      {showToast && (
        <div className="mb-6 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300">
          Comment submitted &ndash; awaiting approval.
        </div>
      )}

      <CommentForm slug={slug} onSuccess={handleSuccess} />

      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      ) : comments && comments.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : null}
    </section>
  );
}

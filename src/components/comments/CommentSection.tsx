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
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleSuccess() {
    mutate();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  }

  const topLevel = (comments ?? []).filter((c) => !c.parentId);
  const repliesById = (comments ?? [])
    .filter((c) => c.parentId)
    .reduce<Record<string, Comment[]>>((acc, r) => {
      acc[r.parentId!] = [...(acc[r.parentId!] ?? []), r];
      return acc;
    }, {});

  const commentCount = comments?.length ?? 0;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-courier text-xs uppercase tracking-widest text-muted whitespace-nowrap">
          Discussion
        </span>
        <div className="flex-1 h-px bg-warm-border dark:bg-dark-border" />
        {commentCount > 0 && (
          <span className="font-courier text-xs text-muted">
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {showToast && (
        <div className="mb-4 px-3 py-2 text-sm border border-warm-border dark:border-dark-border rounded-lg text-muted font-courier">
          Comment submitted &ndash; awaiting approval.
        </div>
      )}

      {!replyingTo && (
        <div className="mb-6">
          <CommentForm slug={slug} onSuccess={handleSuccess} />
        </div>
      )}

      {topLevel.length > 0 ? (
        <div className="flex flex-col gap-4">
          {topLevel.map((comment) => (
            <div key={comment.id}>
              <CommentCard
                comment={comment}
                onReply={(id, name) => setReplyingTo({ id, name })}
              />
              {(repliesById[comment.id] ?? []).map((reply) => (
                <div key={reply.id} className="mt-3">
                  <CommentCard comment={reply} isNested />
                </div>
              ))}
              {replyingTo?.id === comment.id && (
                <div className="mt-3 ml-6">
                  <CommentForm
                    slug={slug}
                    onSuccess={handleSuccess}
                    parentId={replyingTo.id}
                    replyingToName={replyingTo.name}
                    onCancelReply={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : comments && comments.length === 0 ? (
        <p className="text-sm text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : null}
    </section>
  );
}

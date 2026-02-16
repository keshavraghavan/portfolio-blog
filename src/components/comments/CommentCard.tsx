'use client';

import { formatDistanceToNow } from 'date-fns';
import { Comment } from 'src/types/comment';

export function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {comment.authorName}
        </span>
        <span className="text-sm text-neutral-400 dark:text-neutral-400">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
        {comment.body}
      </p>
    </div>
  );
}

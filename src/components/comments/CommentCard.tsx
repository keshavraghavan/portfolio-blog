'use client';

import { formatDistanceToNow } from 'date-fns';
import { Comment } from 'src/types/comment';

const AUTHOR_NAME = 'keshav';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: string, authorName: string) => void;
  isNested?: boolean;
}

export function CommentCard({ comment, onReply, isNested = false }: CommentCardProps) {
  const isAuthor = comment.authorName.toLowerCase() === AUTHOR_NAME;

  return (
    <div className={`card-base p-4 ${isNested ? 'ml-6' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-near-black dark:text-cream">
            {comment.authorName}
          </span>
          {isAuthor && (
            <span className="text-xs font-courier bg-accent text-cream px-1.5 py-0.5 rounded">
              author
            </span>
          )}
        </div>
        <span className="text-xs text-muted font-courier">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-warm-dark dark:text-cream leading-relaxed whitespace-pre-wrap">
        {comment.body}
      </p>
      {!isNested && onReply && (
        <button
          onClick={() => onReply(comment.id, comment.authorName)}
          className="mt-2 text-xs text-accent hover:underline underline-offset-2 transition-colors"
        >
          Reply
        </button>
      )}
    </div>
  );
}

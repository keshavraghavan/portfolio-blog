import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import { formatDate } from 'app/blog/utils'

export async function BlogPosts() {
  const allBlogs = await getBlogPosts()
  const sorted = [...allBlogs].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

  return (
    <div className="border-t border-warm-border dark:border-dark-border">
      {sorted.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex justify-between items-start gap-4 py-5 border-b border-warm-border dark:border-dark-border hover:bg-surface-muted dark:hover:bg-dark-surface-muted transition-colors px-1"
        >
          <div className="flex-1 min-w-0">
            <p className="font-courier text-sm text-near-black dark:text-cream leading-snug group-hover:text-accent transition-colors">
              {post.metadata.title}
            </p>
            {post.metadata.summary && (
              <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                {post.metadata.summary}
              </p>
            )}
          </div>
          <p className="font-courier text-xs text-muted whitespace-nowrap shrink-0 mt-0.5">
            {formatDate(post.metadata.publishedAt, false)}
          </p>
        </Link>
      ))}
    </div>
  )
}

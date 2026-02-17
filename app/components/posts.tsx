import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export async function BlogPosts() {
  let allBlogs = await getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-0 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col space-y-2 md:flex-row md:space-y-0">
              <p className="text-neutral-600 dark:text-neutral-400 md:w-[160px] md:shrink-0 tabular-nums whitespace-nowrap">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
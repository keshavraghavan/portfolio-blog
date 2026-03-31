import Link from 'next/link'
import { getBlogPosts, formatDate } from 'app/blog/utils'

export default async function Page() {
  const allPosts = await getBlogPosts()
  const featuredPosts = [...allPosts]
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 4)

  return (
    <main className="max-w-3xl mx-auto w-full">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-courier text-3xl text-near-black dark:text-cream leading-tight tracking-tight mb-4">
          Hello. I&rsquo;m Keshav.
        </h1>
        <p className="text-base text-warm-dark dark:text-muted leading-relaxed max-w-xl">
          I write about technology, music, and the things I&rsquo;m learning.
          By day I work in digital product at Citibank. The rest of the time
          I&rsquo;m reading, listening, or building something.
        </p>
        <div className="flex gap-3 mt-5 text-sm">
          <Link
            href="/blog"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            Read my writing &rarr;
          </Link>
          <span className="text-muted">|</span>
          <Link
            href="/resume"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            See my resume &rarr;
          </Link>
        </div>
      </div>

      {/* Featured Writing */}
      <div className="mb-12">
        <div className="editorial-divider">
          <span>Featured Writing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-base p-5 block group"
            >
              <p className="font-courier text-xs text-muted mb-2">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <h3 className="font-courier text-base text-near-black dark:text-cream leading-snug mb-2 group-hover:text-accent transition-colors">
                {post.metadata.title}
              </h3>
              {post.metadata.summary && (
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {post.metadata.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
        <div className="text-right mt-3">
          <Link
            href="/blog"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            All posts &rarr;
          </Link>
        </div>
      </div>

      {/* What I'm Into */}
      <div>
        <div className="editorial-divider">
          <span>What I&rsquo;m Into</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reading — update book title/author as your reading changes */}
          <div className="card-base p-4">
            <p className="text-xs uppercase tracking-widest text-accent mb-3 font-courier">
              Reading
            </p>
            <p className="text-sm font-medium text-near-black dark:text-cream">
              Sapiens
            </p>
            <p className="text-xs text-muted mt-1">Yuval Noah Harari</p>
            <Link
              href="/library"
              className="text-xs text-accent hover:underline underline-offset-2 mt-3 block transition-colors"
            >
              Full list &rarr;
            </Link>
          </div>

          {/* Listening */}
          <div className="card-base p-4">
            <p className="text-xs uppercase tracking-widest text-accent-secondary mb-3 font-courier">
              Listening
            </p>
            <p className="text-sm font-medium text-near-black dark:text-cream">
              Curated Playlists
            </p>
            <p className="text-xs text-muted mt-1">4 playlists on Spotify</p>
            <Link
              href="/music"
              className="text-xs text-accent hover:underline underline-offset-2 mt-3 block transition-colors"
            >
              Listen &rarr;
            </Link>
          </div>

          {/* Building */}
          <div className="card-base p-4">
            <p className="text-xs uppercase tracking-widest text-accent mb-3 font-courier">
              Building
            </p>
            <p className="text-sm font-medium text-near-black dark:text-cream">
              This Site
            </p>
            <p className="text-xs text-muted mt-1">Next.js · Tailwind · MDX</p>
            <a
              href="https://github.com/keshavraghavan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline underline-offset-2 mt-3 block transition-colors"
            >
              View source &rarr;
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

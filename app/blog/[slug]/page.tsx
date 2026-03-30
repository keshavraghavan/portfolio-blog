import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { CommentSection } from 'src/components/comments/CommentSection'

export async function generateStaticParams() {
  let posts = await getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  let post = (await getBlogPosts()).find((post) => post.slug === params.slug)
  if (!post) {
    notFound()
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
  let post = (await getBlogPosts()).find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    image: post.metadata.image
      ? `${baseUrl}${post.metadata.image}`
      : `/og?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${baseUrl}/blog/${post.slug}`,
    author: { '@type': 'Person', name: 'Keshav Raghavan' },
  }

  return (
    <section className="max-w-xl mx-auto w-full">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Post header */}
      <div className="mb-8">
        <p className="font-courier text-xs text-muted mb-2">
          {formatDate(post.metadata.publishedAt)}
        </p>
        <h1 className="font-courier text-2xl text-near-black dark:text-cream leading-snug tracking-tight title">
          {post.metadata.title}
        </h1>
        <div className="mt-6 border-t border-warm-border dark:border-dark-border" />
      </div>

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      <div className="mt-12">
        <CommentSection slug={post.slug} />
      </div>
    </section>
  )
}

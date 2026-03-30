import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Writing',
  description: "Thoughts on technology, music, and what I'm learning.",
}

export default function Page() {
  return (
    <section className="max-w-xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight">
          Writing
        </h1>
        <p className="text-sm text-muted mt-1">
          Thoughts on technology, music, and what I&rsquo;m learning.
        </p>
      </div>
      <BlogPosts />
    </section>
  )
}

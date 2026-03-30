# Portfolio Blog Redesign (Magazine Layout) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio blog with a warm editorial "Magazine Layout" — Courier Prime mono headings, cream/warm-gray palette with burnt-orange accent, per-page layout widths, index-card library with category filter, and an elevated Discussion section with reply threading.

**Architecture:** Remove the global `max-w-xl` body constraint and apply per-page widths (max-w-xl blog posts, max-w-2xl secondary pages, max-w-3xl homepage). Define new Tailwind v4 color tokens in `global.css` via `@theme`. Share design patterns (cards, dividers, pills, timeline) as CSS utility classes in `global.css` — no new React components. Library page adds `'use client'` for client-side category filtering. Comments API gets a minimal `parentId` extension to support reply threading.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4 (`@theme` for custom tokens), Courier Prime via `next/font/google` (already loaded), Geist Sans/Mono (existing), React 19, SWR (existing), Drizzle ORM (existing), date-fns (existing).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/global.css` | Modify | Color tokens, font utility, shared CSS classes |
| `app/layout.tsx` | Modify | Apply Courier font variable; remove global max-w; warm base colors |
| `app/components/nav.tsx` | Modify | Wordmark, active-state underline, client component |
| `app/components/footer.tsx` | Modify | Copyright + accent-colored social links |
| `app/page.tsx` | Rewrite | Hero + Featured Writing grid + "What I'm Into" strip |
| `app/blog/page.tsx` | Modify | "Writing" header + subtitle |
| `app/components/posts.tsx` | Modify | Show excerpt + abbreviated date |
| `app/blog/[slug]/page.tsx` | Modify | Date-above-title header layout |
| `src/components/comments/CommentSection.tsx` | Modify | "Discussion" label, comment count, threaded display |
| `src/components/comments/CommentCard.tsx` | Modify | Card styling, author badge, reply button |
| `src/components/comments/CommentForm.tsx` | Modify | "Join the discussion" collapsed form, accepts parentId |
| `app/api/comments/route.ts` | Modify | Accept optional parentId in POST body |
| `app/resume/page.tsx` | Rewrite | Visual timeline, skill pills, PDF download link |
| `app/library/page.tsx` | Rewrite | Index card grid + client-side category filter |
| `app/music/page.tsx` | Rewrite | Card-wrapped Spotify embeds, no subheading |
| `app/about/page.tsx` | Rewrite | Editorial-style bio + accent social links |
| `.gitignore` | Modify | Add `.superpowers/` |

---

## Task 1: CSS Foundation + Layout Refactor

**Files:**
- Modify: `app/global.css`
- Modify: `app/layout.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Add color tokens and shared classes to `app/global.css`**

Replace the entire contents of `app/global.css` with:

```css
@import 'tailwindcss';

@theme {
  --color-cream: #FAF8F5;
  --color-surface: #ffffff;
  --color-warm-border: #E5E2DD;
  --color-near-black: #1A1A1A;
  --color-warm-dark: #4A4540;
  --color-muted: #8B8580;
  --color-accent: #C7622A;
  --color-surface-muted: #F0EDE8;
  --color-dark-surface: #242424;
  --color-dark-border: #333333;
  --color-dark-surface-muted: #2A2A2A;
}

::selection {
  background-color: #C7622A;
  color: #FAF8F5;
}

:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-string: #007f7a;
  --sh-keyword: #e02518;
  --sh-comment: #a19595;
  --sh-jsxliterals: #6266d1;
  --sh-property: #e25a1c;
  --sh-entity: #e25a1c;
}

@media (prefers-color-scheme: dark) {
  :root {
    --sh-class: #4c97f8;
    --sh-identifier: white;
    --sh-keyword: #f47067;
    --sh-string: #0fa295;
  }
  html {
    color-scheme: dark;
  }
}

html {
  min-width: 360px;
}

/* Courier Prime utility */
.font-courier {
  font-family: var(--font-courier, 'Courier New', monospace);
}

/* ── Shared editorial divider ───────────────────────────────── */
.editorial-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.editorial-divider span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-muted);
  white-space: nowrap;
  font-family: var(--font-courier, 'Courier New', monospace);
}
.editorial-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-warm-border);
}
@media (prefers-color-scheme: dark) {
  .editorial-divider::after {
    background: var(--color-dark-border);
  }
}

/* ── Card base ──────────────────────────────────────────────── */
.card-base {
  background: var(--color-surface);
  border: 1px solid var(--color-warm-border);
  border-radius: 10px;
  transition: box-shadow 200ms ease;
}
.card-base:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
@media (prefers-color-scheme: dark) {
  .card-base {
    background: var(--color-dark-surface);
    border-color: var(--color-dark-border);
  }
  .card-base:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* ── Library index card ─────────────────────────────────────── */
.index-card {
  background: var(--color-surface);
  border: 1px solid var(--color-warm-border);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 200ms ease;
}
.index-card:hover {
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08);
}
.index-card-stripe {
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    #C7622A 0px,
    #C7622A 2px,
    transparent 2px,
    transparent 6px
  );
}
@media (prefers-color-scheme: dark) {
  .index-card {
    background: var(--color-dark-surface);
    border-color: var(--color-dark-border);
  }
}

/* ── Pill tag ───────────────────────────────────────────────── */
.pill {
  display: inline-block;
  font-size: 10px;
  font-family: var(--font-courier, 'Courier New', monospace);
  background: var(--color-surface-muted);
  color: var(--color-muted);
  padding: 2px 8px;
  border-radius: 3px;
}
@media (prefers-color-scheme: dark) {
  .pill {
    background: var(--color-dark-surface-muted);
    color: var(--color-muted);
  }
}

/* ── Skill pill ─────────────────────────────────────────────── */
.skill-pill {
  display: inline-block;
  font-size: 12px;
  font-family: var(--font-courier, 'Courier New', monospace);
  background: var(--color-surface);
  border: 1px solid var(--color-warm-border);
  color: var(--color-warm-dark);
  padding: 4px 12px;
  border-radius: 999px;
}
@media (prefers-color-scheme: dark) {
  .skill-pill {
    background: var(--color-dark-surface);
    border-color: var(--color-dark-border);
    color: var(--color-muted);
  }
}

/* ── Prose overrides ────────────────────────────────────────── */
.prose .anchor {
  @apply absolute invisible no-underline;
  margin-left: -1em;
  padding-right: 0.5em;
  width: 80%;
  max-width: 700px;
  cursor: pointer;
}
.anchor:hover {
  @apply visible;
}
.prose a {
  @apply underline transition-all decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 decoration-[0.1em];
}
.prose .anchor:after {
  @apply text-neutral-300 dark:text-neutral-700;
  content: '#';
}
.prose *:hover > .anchor {
  @apply visible;
}
.prose pre {
  @apply bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-x-auto border border-neutral-200 dark:border-neutral-900 py-2 px-3 text-sm;
}
.prose code {
  @apply px-1 py-0.5 rounded-lg;
}
.prose pre code {
  @apply p-0;
  border: initial;
  line-height: 1.5;
}
.prose code span {
  @apply font-medium;
}
.prose img {
  @apply m-0;
}
.prose p {
  @apply my-4 text-warm-dark dark:text-neutral-200;
}
.prose h1 {
  font-family: var(--font-courier, 'Courier New', monospace);
  @apply text-4xl font-normal tracking-tight mt-6 mb-2;
}
.prose h2 {
  font-family: var(--font-courier, 'Courier New', monospace);
  @apply text-xl font-normal tracking-tight mt-6 mb-2;
}
.prose h3 {
  font-family: var(--font-courier, 'Courier New', monospace);
  @apply text-xl font-normal tracking-tight mt-6 mb-2;
}
.prose h4 {
  font-family: var(--font-courier, 'Courier New', monospace);
  @apply text-lg font-normal tracking-tight mt-6 mb-2;
}
.prose strong {
  @apply font-medium;
}
.prose ul {
  @apply list-disc pl-6;
}
.prose ol {
  @apply list-decimal pl-6;
}
.prose blockquote {
  border-left: 3px solid #C7622A;
  background: var(--color-surface-muted);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  font-style: italic;
  color: var(--color-warm-dark);
  margin: 20px 0;
}
@media (prefers-color-scheme: dark) {
  .prose blockquote {
    background: var(--color-dark-surface-muted);
    color: var(--color-muted);
  }
}
.prose > :first-child {
  margin-top: 1.25em !important;
  margin-bottom: 1.25em !important;
}

pre::-webkit-scrollbar {
  display: none;
}
pre {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

input[type='text'],
input[type='email'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

table {
  display: block;
  max-width: fit-content;
  overflow-x: auto;
  white-space: nowrap;
}

.title {
  text-wrap: balance;
}
```

- [ ] **Step 2: Update `app/layout.tsx`**

Replace the entire file:

```tsx
import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Courier_Prime } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

const courier = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Keshav's Website",
    template: "%s | Keshav's Site",
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: "Keshav's Site",
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-near-black bg-cream dark:text-cream dark:bg-near-black',
        GeistSans.variable,
        GeistMono.variable,
        courier.variable,
      )}
    >
      <body className="antialiased mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
```

Key changes: removed `max-w-xl` from body (now per-page), added `courier.variable` to html element, changed base colors to the warm palette.

- [ ] **Step 3: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append:
```
.superpowers/
```

- [ ] **Step 4: Verify the dev server starts without errors**

```bash
pnpm dev
```

Expected: server starts on http://localhost:3000. The site will look unstyled temporarily — that's expected. Check the terminal for TypeScript/compilation errors only.

- [ ] **Step 5: Commit**

```bash
git add app/global.css app/layout.tsx .gitignore
git commit -m "feat: add warm palette tokens, Courier Prime variable, remove global max-w"
```

---

## Task 2: Nav + Footer

**Files:**
- Modify: `app/components/nav.tsx`
- Modify: `app/components/footer.tsx`

- [ ] **Step 1: Rewrite `app/components/nav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems: Record<string, string> = {
  '/': 'home',
  '/blog': 'blog',
  '/resume': 'resume',
  '/library': 'library',
  '/music': 'music',
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-between items-center mb-12 border-b border-warm-border dark:border-dark-border pb-4">
      <Link
        href="/"
        className="font-courier text-lg font-bold text-near-black dark:text-cream tracking-tight"
      >
        Keshav
      </Link>
      <div className="flex gap-5">
        {Object.entries(navItems).map(([path, name]) => {
          const isActive =
            path === '/' ? pathname === '/' : pathname.startsWith(path)
          return (
            <Link
              key={path}
              href={path}
              className={[
                'text-sm transition-colors duration-200',
                isActive
                  ? 'text-near-black dark:text-cream underline decoration-accent underline-offset-4 decoration-2'
                  : 'text-muted hover:text-near-black dark:hover:text-cream',
              ].join(' ')}
            >
              {name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Rewrite `app/components/footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-warm-border dark:border-dark-border">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Keshav Raghavan
        </p>
        <div className="flex gap-4 text-xs">
          <a
            href="https://github.com/keshavraghavan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `pnpm dev` and open http://localhost:3000. Verify:
- "Keshav" wordmark appears in Courier Prime on the left
- Nav links appear on the right in muted color
- Active page (home) has an accent underline
- Footer shows copyright left, GitHub/LinkedIn/RSS links right in accent color

- [ ] **Step 4: Commit**

```bash
git add app/components/nav.tsx app/components/footer.tsx
git commit -m "feat: redesign nav with wordmark and active underline, simplify footer"
```

---

## Task 3: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString('en-us', { month: 'short', year: 'numeric' })
}

export default async function Page() {
  const allPosts = await getBlogPosts()
  const featuredPosts = allPosts
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 4)

  return (
    <section className="max-w-3xl mx-auto w-full">
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
                {formatShortDate(post.metadata.publishedAt)}
              </p>
              <h3 className="font-courier text-base text-near-black dark:text-cream leading-snug mb-2 group-hover:text-accent transition-colors">
                {post.metadata.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-2">
                {post.metadata.summary}
              </p>
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
            <p className="text-xs uppercase tracking-widest text-accent mb-3 font-courier">
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
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000. Verify:
- Hero in Courier Prime, intro paragraph below, two accent CTAs
- Featured posts 2-column grid (stacks to 1 on mobile) with date, title, excerpt
- "What I'm Into" 3-column strip with Reading/Listening/Building cards
- Hover on post cards: title color transitions to accent

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redesign homepage with hero, featured writing grid, what i'm into strip"
```

---

## Task 4: Blog Listing

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/components/posts.tsx`

- [ ] **Step 1: Update `app/components/posts.tsx`**

```tsx
import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

function abbreviateDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString('en-us', { month: 'short', year: 'numeric' })
}

export async function BlogPosts() {
  const allBlogs = await getBlogPosts()
  const sorted = allBlogs.sort(
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
            {abbreviateDate(post.metadata.publishedAt)}
          </p>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Update `app/blog/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/blog. Verify:
- "Writing" header in Courier Prime with subtitle below
- Posts in divider-separated rows
- Each row: title (mono) + excerpt (small, muted) left, abbreviated date right
- Hover shows subtle warm background tint on each row

- [ ] **Step 4: Commit**

```bash
git add app/blog/page.tsx app/components/posts.tsx
git commit -m "feat: redesign blog listing with divider rows and post excerpts"
```

---

## Task 5: Blog Post Page

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Update `app/blog/[slug]/page.tsx`**

Open the current file. Keep the `generateStaticParams`, `generateMetadata`, and the `script` JSON-LD block entirely unchanged. Only update the JSX returned from the default export function — replace what's currently inside `return (...)` with:

```tsx
return (
  <section className="max-w-xl mx-auto w-full">
    {/* Keep the existing JSON-LD script tag here — do not remove it */}
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
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
        }),
      }}
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
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/blog/spotify. Verify:
- Date appears above title in small mono text
- Title is in Courier Prime
- Thin divider below the title before body content
- Body prose renders at correct width
- Blockquotes render with accent-color left border and warm background (from Task 1 CSS)
- Comment/Discussion section appears at the bottom

- [ ] **Step 3: Commit**

```bash
git add "app/blog/[slug]/page.tsx"
git commit -m "feat: redesign blog post header with date above title"
```

---

## Task 6: Discussion / Comments

**Files:**
- Modify: `app/api/comments/route.ts`
- Modify: `src/components/comments/CommentSection.tsx`
- Modify: `src/components/comments/CommentCard.tsx`
- Modify: `src/components/comments/CommentForm.tsx`

- [ ] **Step 1: Update `app/api/comments/route.ts` to accept optional `parentId`**

Change only the `commentSchema` definition and the `insert` call in the POST handler. Keep everything else (rate limiting, error handling, GET handler) exactly the same.

Update `commentSchema`:
```ts
const commentSchema = z.object({
  authorName: z.string().min(1).max(100),
  body: z.string().min(1).max(2000),
  pageSlug: z.string().min(1),
  honeypot: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
});
```

Update the destructuring line in POST:
```ts
const { authorName, body, pageSlug, honeypot, parentId } = parsed.data;
```

Update the insert call in POST:
```ts
const [newComment] = await db
  .insert(comments)
  .values({ authorName, body, pageSlug, parentId: parentId ?? null })
  .returning();
```

- [ ] **Step 2: Rewrite `src/components/comments/CommentCard.tsx`**

```tsx
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
      <p className="text-sm text-warm-dark dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
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
```

- [ ] **Step 3: Rewrite `src/components/comments/CommentForm.tsx`**

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface CommentFormProps {
  slug: string;
  onSuccess: () => void;
  parentId?: string | null;
  replyingToName?: string | null;
  onCancelReply?: () => void;
}

export function CommentForm({
  slug,
  onSuccess,
  parentId = null,
  replyingToName = null,
  onCancelReply,
}: CommentFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyingToName) {
      setExpanded(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [replyingToName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!authorName.trim()) { setError('Name is required.'); return; }
    if (!body.trim()) { setError('Comment is required.'); return; }
    if (body.length > 2000) { setError('Comment must be 2000 characters or fewer.'); return; }

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
          parentId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      setAuthorName('');
      setBody('');
      setExpanded(false);
      onSuccess();
      onCancelReply?.();
    } catch {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => {
          setExpanded(true);
          setTimeout(() => textareaRef.current?.focus(), 50);
        }}
        className="w-full border border-dashed border-warm-border dark:border-dark-border rounded-xl p-4 text-sm text-muted hover:border-muted transition-colors text-left"
      >
        {replyingToName
          ? `Replying to ${replyingToName}...`
          : 'Join the discussion...'}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-4">
      {replyingToName && (
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs text-muted font-courier">
            Replying to {replyingToName}
          </p>
          <button
            type="button"
            onClick={() => { setExpanded(false); onCancelReply?.(); }}
            className="text-xs text-muted hover:text-near-black dark:hover:text-cream transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
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
      <div className="mb-3">
        <label
          htmlFor={`authorName-${parentId ?? 'root'}`}
          className="block text-xs font-courier text-muted mb-1"
        >
          Name
        </label>
        <input
          id={`authorName-${parentId ?? 'root'}`}
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 text-sm bg-transparent border border-warm-border dark:border-dark-border rounded-lg text-near-black dark:text-cream placeholder:text-muted focus:outline-none focus:border-muted dark:focus:border-muted transition-all"
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor={`body-${parentId ?? 'root'}`}
          className="block text-xs font-courier text-muted mb-1"
        >
          Comment
        </label>
        <textarea
          id={`body-${parentId ?? 'root'}`}
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 text-sm bg-transparent border border-warm-border dark:border-dark-border rounded-lg text-near-black dark:text-cream placeholder:text-muted focus:outline-none focus:border-muted dark:focus:border-muted transition-all resize-y"
        />
        <span className="block text-xs text-muted mt-1 text-right tabular-nums font-courier">
          {body.length}/2000
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-courier text-near-black dark:text-cream border border-warm-border dark:border-dark-border rounded-lg hover:bg-surface-muted dark:hover:bg-dark-surface-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {!replyingToName && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="px-4 py-2 text-sm text-muted hover:text-near-black dark:hover:text-cream transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/comments/CommentSection.tsx`**

```tsx
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

      {replyingTo && (
        <div className="mt-6">
          <CommentForm slug={slug} onSuccess={handleSuccess} />
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Verify in browser**

Open any blog post. Verify:
- "Discussion" label left, thin line extending right, comment count on the far right
- "Join the discussion..." collapsed button — clicking it expands to the full form with name + comment fields
- Existing approved comments show as styled cards with author bold, timestamp right-aligned
- Reply button visible below each top-level comment
- Clicking Reply opens an indented form below that specific comment
- "author" badge (orange pill) appears next to any comment with authorName "keshav" (case-insensitive)

- [ ] **Step 6: Commit**

```bash
git add app/api/comments/route.ts src/components/comments/
git commit -m "feat: redesign discussion section with threading, reply forms, and author badge"
```

---

## Task 7: Resume Page

**Files:**
- Modify: `app/resume/page.tsx`

- [ ] **Step 1: Rewrite `app/resume/page.tsx`**

```tsx
export const metadata = {
  title: 'Resume',
  description: 'Digital Product Analyst and engineer.',
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="editorial-divider mt-8 mb-5">
      <span>{label}</span>
    </div>
  )
}

interface TimelineEntry {
  title: string
  company: string
  period: string
  bullets: string[]
  current?: boolean
}

const experience: TimelineEntry[] = [
  {
    title: 'Digital Product Analyst — Mortgage',
    company: 'Citibank · Dallas, TX',
    period: 'March 2024 — Present',
    current: true,
    bullets: [
      'Leading a cross-functional team managing 22 systems, resolving latency and API issues impacting 250+ users',
      'Built interaction flows for a GenAI auditing platform, improving reliability and accuracy by 29%',
      'Delivering $330,000 in annual savings by optimizing archival storage on database platforms',
      'Implemented Glassbox and Adobe Analytics to enhance Citi Mortgage digital experience analytics',
      'Collaborated with SaaS vendors to implement business tools that streamlined operations and overhead costs',
      'Spearheading the use of Agentic AI within the SDLC process, reducing developer engineering time by 60%',
      'Increased large-query performance by 42% using SQL stored procedures',
      'Coordinating with business, QA, and engineering to fix vendor issues, reducing platform downtime by 15%',
    ],
  },
  {
    title: 'Summer Analyst — KYC',
    company: 'Citibank · Dallas, TX',
    period: 'June 2023 — August 2023',
    bullets: [
      'Developed UI features on Citibank Online, strengthening customer security and fraud prevention',
      'Analyzed automotive sales datasets using Pandas and Tableau to reveal fuel-efficiency trends',
      'Partnered with the Voice of Employee committee to lead initiatives improving team communication',
    ],
  },
  {
    title: 'Founder',
    company: '1051 Studios · Austin, TX',
    period: 'May 2017 — December 2023',
    bullets: [
      'Streamlined the process of buying a new home while offering rebates to customers',
      'Identified homebuilder pain points to prioritize high-value product improvements',
      'Developed applications for Austin Resource Recovery to improve yard waste pickup efficiency',
      'Presented at City Hall before city officials, winning a pitch contest',
    ],
  },
]

const projects: TimelineEntry[] = [
  {
    title: 'Lead — OnSked Web Application',
    company: 'Amazech Solutions LLC · Plano, TX',
    period: 'August 2023 — December 2023',
    bullets: [
      'Verified deliverables met quality standards through comprehensive testing',
      'Implemented a frontend UI using React.js and Material UI',
      'Designed a custom backend service on Microsoft Azure using an Express.js RESTful API',
      'Optimized data storage and retrieval to enhance frontend responsiveness',
    ],
  },
]

const skills: { category: string; items: string[] }[] = [
  {
    category: 'Product Management',
    items: ['Agile', 'Jira', 'Figma'],
  },
  {
    category: 'Frameworks / Languages',
    items: ['JavaScript', 'Next.js', 'React', 'SQL', 'Express.js', 'Azure', 'Python'],
  },
  {
    category: 'Data Analytics',
    items: ['Tableau', 'Pandas'],
  },
]

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry, index) => (
        <div key={index} className="flex gap-4 mb-8">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                entry.current ? 'bg-accent' : 'bg-warm-border dark:bg-dark-border'
              }`}
            />
            {index < entries.length - 1 && (
              <div className="w-px flex-1 bg-warm-border dark:bg-dark-border mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex justify-between items-baseline flex-wrap gap-2">
              <p className="font-courier text-sm text-near-black dark:text-cream">
                {entry.title}
              </p>
              <p className="font-courier text-xs text-muted whitespace-nowrap">
                {entry.period}
              </p>
            </div>
            <p className="text-sm text-accent mt-0.5">{entry.company}</p>
            <ul className="mt-2 space-y-1">
              {entry.bullets.map((b, i) => (
                <li
                  key={i}
                  className="text-xs text-warm-dark dark:text-muted leading-relaxed flex gap-2"
                >
                  <span className="text-muted shrink-0">&mdash;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResumePage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight">
          Resume
        </h1>
        <p className="text-sm text-muted mt-1">
          Product-minded engineer who bridges business and technology.
        </p>
        <a
          href="/keshav-resume.pdf"
          download="keshav-resume.pdf"
          className="text-sm text-accent hover:underline underline-offset-2 transition-colors mt-2 inline-block"
        >
          Download PDF &darr;
        </a>
      </div>

      <SectionDivider label="Education" />
      <div className="card-base p-4">
        <p className="font-courier text-sm text-near-black dark:text-cream">
          BS Computer Science
        </p>
        <p className="text-sm text-accent mt-1">
          University of Texas at Dallas &mdash; May 2024
        </p>
      </div>

      <SectionDivider label="Experience" />
      <Timeline entries={experience} />

      <SectionDivider label="Projects" />
      <Timeline entries={projects} />

      <SectionDivider label="Skills" />
      <div className="space-y-4">
        {skills.map((group) => (
          <div key={group.category}>
            <p className="font-courier text-xs text-muted mb-2 uppercase tracking-wider">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/resume. Verify:
- "Resume" header with tagline and PDF download link in accent color
- Education in a card
- Experience timeline: accent dot for current role (Citibank), muted dots for past, vertical connecting line
- Bullet points with em-dash prefix
- Skills section with category labels above rows of rounded pill tags

- [ ] **Step 3: Commit**

```bash
git add app/resume/page.tsx
git commit -m "feat: redesign resume with visual timeline and skill pills"
```

---

## Task 8: Library Page

**Files:**
- Modify: `app/library/page.tsx`

- [ ] **Step 1: Rewrite `app/library/page.tsx`**

```tsx
'use client'

import { useState } from 'react'

type Category = 'All' | 'Philosophy' | 'Fiction' | 'Business' | 'Classics'

interface Book {
  title: string
  author: string
  href?: string
  category: Exclude<Category, 'All'>
  callNumber: string
}

const books: Book[] = [
  { title: 'The Ship of Theseus', author: 'Straka, V.M.', href: 'https://a.co/d/0KLDquG', category: 'Fiction', callNumber: 'FIC-001' },
  { title: 'The Accidental Creative', author: 'Henry, Todd', href: 'https://a.co/d/i36dFak', category: 'Business', callNumber: 'BUS-001' },
  { title: 'Wabi Sabi: The Wisdom in Imperfection', author: 'Suzuki, Nobuo', href: 'https://a.co/d/5kCxp3E', category: 'Philosophy', callNumber: 'PHI-001' },
  { title: 'The Odyssey', author: 'Homer (trans. Fitzgerald)', href: 'https://a.co/d/hhuCIHe', category: 'Classics', callNumber: 'CLS-001' },
  { title: 'The Complete Works of Epictetus', author: 'Epictetus', href: 'https://a.co/d/3bQHkvS', category: 'Philosophy', callNumber: 'PHI-002' },
  { title: 'The Goal 2', author: 'Goldratt, Eliyahu', href: 'https://a.co/d/7YsjZPU', category: 'Business', callNumber: 'BUS-002' },
  { title: 'Too Big to Fail', author: 'Sorkin, Andrew Ross', category: 'Business', callNumber: 'BUS-003' },
  { title: 'Mindware', author: 'Nisbett, Richard E.', href: 'https://a.co/d/5ZB6yek', category: 'Philosophy', callNumber: 'PHI-003' },
  { title: 'When to Rob a Bank', author: 'Levitt & Dubner', href: 'https://a.co/d/aVpGxXC', category: 'Business', callNumber: 'BUS-004' },
  { title: "Can't Hurt Me", author: 'Goggins, David', href: 'https://a.co/d/22YDzrM', category: 'Business', callNumber: 'BUS-005' },
  { title: 'The Iliad', author: 'Homer', href: 'https://a.co/d/aCNUPMD', category: 'Classics', callNumber: 'CLS-002' },
  { title: 'The Adventures of Tom Sawyer', author: 'Twain, Mark', href: 'https://a.co/d/5yQD2w3', category: 'Fiction', callNumber: 'FIC-002' },
  { title: 'Moby Dick (Annotated)', author: 'Melville, Herman', href: 'https://a.co/d/bR4W1j9', category: 'Classics', callNumber: 'CLS-003' },
  { title: 'The Confessions of Saint Augustine', author: 'Augustine, Saint', href: 'https://a.co/d/4fSMnLm', category: 'Philosophy', callNumber: 'PHI-004' },
  { title: 'Star Wars: Rise and Fall of Darth Vader', author: 'Windham, Ryder', href: 'https://a.co/d/4AjLA0x', category: 'Fiction', callNumber: 'FIC-003' },
  { title: 'Sapiens', author: 'Harari, Yuval Noah', href: 'https://a.co/d/fcgFcBJ', category: 'Philosophy', callNumber: 'PHI-005' },
  { title: 'Ramayana', author: 'Rajagopalachari, C.', category: 'Classics', callNumber: 'CLS-004' },
  { title: 'Building a Second Brain', author: 'Forte, Tiago', href: 'https://a.co/d/hkEC0gU', category: 'Business', callNumber: 'BUS-006' },
  { title: 'Manifest', author: 'Nafousi, Roxie', href: 'https://a.co/d/bisAhB0', category: 'Business', callNumber: 'BUS-007' },
  { title: 'Deep Work', author: 'Newport, Cal', href: 'https://a.co/d/dRv2TOV', category: 'Business', callNumber: 'BUS-008' },
  { title: 'Think Like a Freak', author: 'Levitt & Dubner', href: 'https://a.co/d/3R8AQuq', category: 'Business', callNumber: 'BUS-009' },
  { title: 'Thinking, Fast and Slow', author: 'Kahneman, Daniel', href: 'https://a.co/d/f9lnJBu', category: 'Philosophy', callNumber: 'PHI-006' },
  { title: 'How to Think Like a Roman Emperor', author: 'Robertson, Donald', href: 'https://a.co/d/hQeURzp', category: 'Philosophy', callNumber: 'PHI-007' },
  { title: 'Habit Stacking', author: 'Scott, S.J.', href: 'https://a.co/d/7xeG54u', category: 'Business', callNumber: 'BUS-010' },
  { title: 'Nicomachean Ethics', author: 'Aristotle', href: 'https://a.co/d/8pgptrf', category: 'Philosophy', callNumber: 'PHI-008' },
  { title: "Ender's Game", author: 'Card, Orson Scott', href: 'https://a.co/d/hS1sKJZ', category: 'Fiction', callNumber: 'FIC-004' },
  { title: "HBR's 10 Must Reads: The Essentials", author: 'Harvard Business Review', href: 'https://a.co/d/8UiUGRf', category: 'Business', callNumber: 'BUS-011' },
  { title: "HBR's 10 Must Reads on Strategy", author: 'Harvard Business Review', href: 'https://a.co/d/jh7tXbr', category: 'Business', callNumber: 'BUS-012' },
  { title: "HBR's 10 Must Reads on Leadership", author: 'Harvard Business Review', href: 'https://a.co/d/dH9mZFn', category: 'Business', callNumber: 'BUS-013' },
  { title: 'Start With Why', author: 'Sinek, Simon', href: 'https://a.co/d/fy9RlLy', category: 'Business', callNumber: 'BUS-014' },
  { title: 'Shoe Dog', author: 'Knight, Phil', href: 'https://a.co/d/5e3BcWM', category: 'Business', callNumber: 'BUS-015' },
  { title: 'Think Again', author: 'Grant, Adam', href: 'https://a.co/d/2b0d1k6', category: 'Business', callNumber: 'BUS-016' },
  { title: 'The Visual MBA', author: 'Barron, Jason', href: 'https://a.co/d/2rlSCrJ', category: 'Business', callNumber: 'BUS-017' },
]

const CATEGORIES: Category[] = ['All', 'Philosophy', 'Fiction', 'Business', 'Classics']

export default function LibraryPage() {
  const [active, setActive] = useState<Category>('All')
  const filtered = active === 'All' ? books : books.filter((b) => b.category === active)

  return (
    <section className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight">
          Library
        </h1>
        <p className="text-sm text-muted mt-1">
          Browse the collection. All titles recommended.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex border border-warm-border dark:border-dark-border rounded-lg overflow-hidden mb-6">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={[
              'flex-1 py-2 text-xs font-courier transition-colors',
              i > 0 ? 'border-l border-warm-border dark:border-dark-border' : '',
              active === cat
                ? 'bg-near-black dark:bg-cream text-cream dark:text-near-black'
                : 'text-muted hover:text-near-black dark:hover:text-cream',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Index card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((book) => {
          const inner = (
            <div className="index-card group">
              <div className="index-card-stripe" />
              <div className="p-3">
                <p className="font-courier text-sm text-near-black dark:text-cream leading-snug group-hover:text-accent transition-colors">
                  {book.title}
                </p>
                <p className="font-courier text-xs text-muted mt-1">
                  {book.author}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-warm-border dark:border-dark-border">
                  <span className="font-courier text-xs text-muted">
                    {book.callNumber}
                  </span>
                  <span className="pill">{book.category}</span>
                </div>
              </div>
            </div>
          )

          return book.href ? (
            <a
              key={book.callNumber}
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          ) : (
            <div key={book.callNumber}>{inner}</div>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted font-courier mt-6">
        Showing {filtered.length} of {books.length} titles
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/library. Verify:
- "Library" header with subtitle
- Segmented filter tabs — clicking each category filters the grid; "All" shows everything
- Index cards: accent stripe at top, title (mono, hover to accent), author in Last/First mono, dashed divider, call number left + category pill right
- Clicking a card with href opens Amazon in a new tab; Ramayana (no href) is a non-clickable div
- "Showing X of Y titles" count updates when filtering
- Mobile: single column

- [ ] **Step 3: Commit**

```bash
git add app/library/page.tsx
git commit -m "feat: redesign library as card catalog with index cards and category filter"
```

---

## Task 9: Music Page

**Files:**
- Modify: `app/music/page.tsx`

- [ ] **Step 1: Rewrite `app/music/page.tsx`**

Fill in the `name` fields with your actual Spotify playlist names before committing.

```tsx
const playlists = [
  {
    name: 'Playlist One',
    src: 'https://open.spotify.com/embed/playlist/4pGlaEAXh0DIycVRkabaqE?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Two',
    src: 'https://open.spotify.com/embed/playlist/7f2EIVOlnIvHLQZGzFPJni?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Three',
    src: 'https://open.spotify.com/embed/playlist/7oEy4MJa4cGx1oXEY8mTmS?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Four',
    src: 'https://open.spotify.com/embed/playlist/4abn2FPGEDnr1VMbe3VYFI?utm_source=generator&theme=0',
  },
]

export default function MusicPage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight mb-8">
        Music
      </h1>
      <div className="flex flex-col gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.src} className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-warm-border dark:border-dark-border">
              <p className="font-courier text-sm text-near-black dark:text-cream">
                {playlist.name}
              </p>
            </div>
            <iframe
              src={playlist.src}
              width="100%"
              height="152"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace placeholder names with your real playlist names**

Open the file you just wrote. Replace `'Playlist One'`, `'Playlist Two'`, `'Playlist Three'`, `'Playlist Four'` with the actual names of your Spotify playlists.

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/music. Verify:
- "Music" header in Courier Prime, no subtitle
- Each playlist wrapped in a card — playlist name in a bordered header row, Spotify embed directly below
- All four embeds load
- No extra spacing between playlists

- [ ] **Step 4: Commit**

```bash
git add app/music/page.tsx
git commit -m "feat: redesign music page with card-wrapped Spotify embeds"
```

---

## Task 10: About Page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Rewrite `app/about/page.tsx`**

```tsx
export const metadata = {
  title: 'About',
  description: 'About Keshav Raghavan.',
}

export default function AboutPage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight mb-6">
        About
      </h1>

      <div className="space-y-4">
        <p className="text-base text-warm-dark dark:text-neutral-200 leading-relaxed">
          I&rsquo;m Keshav &mdash; a writer, musician, and engineer based in Dallas, TX.
          I work in digital product at Citibank, where I help build and ship software
          that reaches millions of people.
        </p>
        <p className="text-base text-warm-dark dark:text-neutral-200 leading-relaxed">
          This site is a personal playground where I refine my writing, tinker with
          engineering ideas, and explore music more intentionally. It&rsquo;s a space
          for honest reflection &mdash; to uncover meaning in everyday pursuits and
          share thoughts freely.
        </p>
        <p className="text-base text-warm-dark dark:text-neutral-200 leading-relaxed">
          Whatever brought you here, I&rsquo;m glad you stopped by.
        </p>
      </div>

      <div className="mt-10">
        <div className="editorial-divider">
          <span>Find Me</span>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="https://www.instagram.com/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            Instagram &rarr;
          </a>
          <a
            href="https://www.linkedin.com/in/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            LinkedIn &rarr;
          </a>
          <a
            href="mailto:raghavankeshav@gmail.com"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            Email &rarr;
          </a>
        </div>
      </div>

      <div className="mt-10">
        <div className="editorial-divider">
          <span>Currently Reading</span>
        </div>
        <a
          href="/library"
          className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
        >
          Browse the library &rarr;
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Final cross-page check**

Run `pnpm dev`. Navigate through every page and verify:
- `/` — homepage with hero, featured posts grid, what I'm into strip
- `/blog` — listing with divider rows and excerpts
- `/blog/spotify` — post with date above title, accent blockquotes
- `/resume` — timeline, skill pills
- `/library` — index cards, category filter works
- `/music` — card-wrapped embeds, no subtitle
- `/about` — editorial bio, accent links

Dark mode check: toggle system dark mode appearance — all pages should invert to the warm dark palette (`#1A1A1A` background, cream text, accent stays orange).

Mobile check: shrink browser to 375px — columns stack, nav links remain readable.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: redesign about page with editorial bio and accent social links"
```

---

## Spec Coverage

| Spec requirement | Task |
|-----------------|------|
| Warm palette (#FAF8F5 cream, #C7622A accent) | Task 1 |
| Courier Prime mono headings | Task 1 (CSS class) + Tasks 2–10 (applied) |
| Context-dependent widths (xl / 2xl / 3xl) | Tasks 3–10 (max-w per page) |
| Nav wordmark + active underline | Task 2 |
| Footer copyright + accent social links | Task 2 |
| Homepage hero + featured writing grid + "What I'm Into" | Task 3 |
| Blog listing with divider rows + excerpts | Task 4 |
| Post header: date above title + divider | Task 5 |
| Blockquotes with accent left border + warm bg | Task 1 (prose CSS) |
| Discussion section with comment count | Task 6 |
| Threaded replies with indentation | Task 6 |
| Author badge on comments | Task 6 |
| "Join the discussion" collapsed form | Task 6 |
| Resume visual timeline + skill pills | Task 7 |
| Library index cards + category filter | Task 8 |
| Music: card-wrapped embeds, no subtitle | Task 9 |
| About: editorial bio + accent links | Task 10 |
| Dark mode follows system preference | Task 1 (global) + dark: classes throughout |
| `.superpowers/` in .gitignore | Task 1 |

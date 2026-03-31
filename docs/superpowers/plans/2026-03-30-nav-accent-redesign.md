# Nav & Accent Color Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Constrain the nav to match content width, remove the Keshav wordmark, and replace the single orange accent with a dual sage-green / slate-blue token system.

**Architecture:** Pure CSS token swap + targeted JSX edits across 4 files. No new components. Tailwind v4 `@theme` tokens auto-generate utility classes (`text-accent-secondary`, etc.) from `--color-*` variables, so adding the token in `global.css` is all that's needed to unlock it everywhere.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v4 (`@theme`), React

> **Note:** No test infrastructure exists in this project. Each task ends with a visual verification step using `pnpm dev` instead of automated tests.

---

## File Map

| File | Change |
|------|--------|
| `app/global.css` | Swap `--color-accent` to green, add `--color-accent-secondary` blue, update `::selection` |
| `app/components/nav.tsx` | Remove Keshav wordmark, constrain to `max-w-3xl`, left-align links, blue hover |
| `app/page.tsx` | Change "Listening" card label from `text-accent` to `text-accent-secondary` |
| `app/music/page.tsx` | Change playlist card header text to `text-accent-secondary` |

---

### Task 1: Update accent color tokens in global.css

**Files:**
- Modify: `app/global.css:3-15` (`@theme` block) and `app/global.css:17-20` (`::selection`)

- [ ] **Step 1: Replace `--color-accent` and add `--color-accent-secondary` in the `@theme` block**

In `app/global.css`, find the `@theme` block (lines 3–15). Change this:

```css
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
```

To this:

```css
@theme {
  --color-cream: #FAF8F5;
  --color-surface: #ffffff;
  --color-warm-border: #E5E2DD;
  --color-near-black: #1A1A1A;
  --color-warm-dark: #4A4540;
  --color-muted: #8B8580;
  --color-accent: #87ae73;
  --color-accent-secondary: #738caa;
  --color-surface-muted: #F0EDE8;
  --color-dark-surface: #242424;
  --color-dark-border: #333333;
  --color-dark-surface-muted: #2A2A2A;
}
```

- [ ] **Step 2: Update `::selection` to use the new green**

Find the `::selection` block (just below `@theme`):

```css
::selection {
  background-color: #C7622A;
  color: #FAF8F5;
}
```

Change to:

```css
::selection {
  background-color: #87ae73;
  color: #FAF8F5;
}
```

- [ ] **Step 3: Verify dev server compiles without errors**

```bash
pnpm dev
```

Expected: server starts, no compilation errors in terminal. Visit `http://localhost:3000` — CTA links, blockquote borders, and card labels should now appear sage green instead of orange.

- [ ] **Step 4: Commit**

```bash
git add app/global.css
git commit -m "feat: swap accent to sage green, add slate blue secondary token"
```

---

### Task 2: Fix nav — remove wordmark, constrain width, left-align links

**Files:**
- Modify: `app/components/nav.tsx`

- [ ] **Step 1: Update the nav component**

Replace the entire contents of `app/components/nav.tsx` with:

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
  '/about': 'about',
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-5 mb-12 border-b border-warm-border dark:border-dark-border pb-4 max-w-3xl mx-auto w-full">
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
                : 'text-muted hover:text-accent-secondary',
            ].join(' ')}
          >
            {name}
          </Link>
        )
      })}
    </nav>
  )
}
```

Key changes from the original:
- Removed `<Link href="/">Keshav</Link>` wordmark
- Removed `justify-between` from nav className
- Added `max-w-3xl mx-auto w-full` to nav className (aligns nav with page content)
- Removed the inner `<div className="flex gap-5">` wrapper — links are now direct children of nav with `gap-5` on the nav itself
- Changed inactive link hover from `hover:text-near-black dark:hover:text-cream` to `hover:text-accent-secondary`

- [ ] **Step 2: Verify visually**

```bash
pnpm dev
```

Expected: nav is left-aligned, same width as page content, no "Keshav" wordmark. Hovering inactive links shows slate blue. Active link still has green underline.

- [ ] **Step 3: Commit**

```bash
git add app/components/nav.tsx
git commit -m "feat: remove Keshav wordmark, constrain nav width, left-align links"
```

---

### Task 3: Apply secondary accent to Listening card label on homepage

**Files:**
- Modify: `app/page.tsx`

The "What I'm Into" section has three cards: Reading, Listening, Building. Only the **Listening** label should use the secondary blue — the other two stay on the primary green.

- [ ] **Step 1: Change the Listening label class**

In `app/page.tsx`, find the Listening card section (around line 103). It has three nearly identical label paragraphs. Find specifically the one inside the `{/* Listening */}` comment block:

```tsx
{/* Listening */}
<div className="card-base p-4">
  <p className="text-xs uppercase tracking-widest text-accent mb-3 font-courier">
    Listening
  </p>
```

Change `text-accent` to `text-accent-secondary` on that paragraph only:

```tsx
{/* Listening */}
<div className="card-base p-4">
  <p className="text-xs uppercase tracking-widest text-accent-secondary mb-3 font-courier">
    Listening
  </p>
```

- [ ] **Step 2: Verify visually**

```bash
pnpm dev
```

Visit `http://localhost:3000`. In the "What I'm Into" strip: "Reading" and "Building" labels are sage green; "Listening" label is slate blue.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: use secondary accent on Listening card label"
```

---

### Task 4: Apply secondary accent to music page playlist card headers

**Files:**
- Modify: `app/music/page.tsx`

The music page has four playlist cards, each with a header bar containing the playlist name. Change these from the default near-black text to secondary blue to visually tie the music page into the accent system.

- [ ] **Step 1: Update the playlist card header text class**

In `app/music/page.tsx`, find the card header paragraph inside the `playlists.map(...)` block (around line 29):

```tsx
<div className="px-4 py-3 border-b border-warm-border dark:border-dark-border">
  <p className="font-courier text-sm text-near-black dark:text-cream">
    {playlist.name}
  </p>
</div>
```

Change to:

```tsx
<div className="px-4 py-3 border-b border-warm-border dark:border-dark-border">
  <p className="font-courier text-sm text-accent-secondary">
    {playlist.name}
  </p>
</div>
```

- [ ] **Step 2: Verify visually**

```bash
pnpm dev
```

Visit `http://localhost:3000/music`. Each playlist card header label should appear in slate blue (`#738caa`).

- [ ] **Step 3: Commit**

```bash
git add app/music/page.tsx
git commit -m "feat: use secondary accent on music page playlist card headers"
```

---

## Done

All four tasks complete. Run `pnpm build` to confirm no type errors before merging:

```bash
pnpm build
```

Expected: build completes with no errors.

# Typewriter Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a looping typewriter label below the `Hello. I'm Keshav.` heading on the homepage that cycles through `builder · reader · writer · always learning`.

**Architecture:** A `'use client'` leaf component handles all animation state via a `useEffect`/`setTimeout` loop. The homepage `page.tsx` stays a server component and imports the new component directly. A `@keyframes blink` rule is added to `global.css` for the cursor animation.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4

---

### Task 1: Add `@keyframes blink` to global CSS

**Files:**
- Modify: `app/global.css`

- [ ] **Step 1: Open `app/global.css` and add the keyframe after the `::selection` block**

  Find this block:
  ```css
  ::selection {
    background-color: #87ae73;
    color: #FAF8F5;
  }
  ```

  Add immediately after it:
  ```css
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  ```

- [ ] **Step 2: Verify the dev server still compiles without errors**

  Run: `pnpm dev`
  Expected: server starts at `http://localhost:3000` with no CSS errors in the terminal.

- [ ] **Step 3: Commit**

  ```bash
  git add app/global.css
  git commit -m "style: add blink keyframe for typewriter cursor"
  ```

---

### Task 2: Create `TypewriterLabel` client component

**Files:**
- Create: `app/components/typewriter-label.tsx`

- [ ] **Step 1: Create the file with this exact content**

  ```tsx
  'use client'

  import { useEffect, useState } from 'react'

  const PHRASES = ['builder', 'reader', 'writer', 'always learning']
  const TYPE_MS = 60
  const DELETE_MS = 40
  const PAUSE_MS = 1800

  export default function TypewriterLabel() {
    const [displayText, setDisplayText] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
      const current = PHRASES[phraseIndex]

      if (!isDeleting) {
        if (displayText === current) {
          const id = setTimeout(() => setIsDeleting(true), PAUSE_MS)
          return () => clearTimeout(id)
        }
        const id = setTimeout(
          () => setDisplayText(current.slice(0, displayText.length + 1)),
          TYPE_MS
        )
        return () => clearTimeout(id)
      }

      if (displayText === '') {
        setPhraseIndex((i) => (i + 1) % PHRASES.length)
        setIsDeleting(false)
        return
      }

      const id = setTimeout(
        () => setDisplayText(displayText.slice(0, -1)),
        DELETE_MS
      )
      return () => clearTimeout(id)
    }, [displayText, phraseIndex, isDeleting])

    return (
      <p className="font-courier text-sm text-muted mb-1">
        {displayText}
        <span
          className="inline-block w-px h-[0.9em] bg-muted ml-[2px] align-middle"
          style={{ animation: 'blink 1s step-end infinite' }}
        />
      </p>
    )
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `pnpm build 2>&1 | head -30`
  Expected: no TypeScript errors for the new file. (Build may fail on unrelated things — only care about TS errors in `typewriter-label.tsx`.)

- [ ] **Step 3: Commit**

  ```bash
  git add app/components/typewriter-label.tsx
  git commit -m "feat: add TypewriterLabel client component"
  ```

---

### Task 3: Wire `TypewriterLabel` into the homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the import at the top of `app/page.tsx`**

  Find the existing imports:
  ```tsx
  import Link from 'next/link'
  import { getBlogPosts, formatDate } from 'app/blog/utils'
  ```

  Add after them:
  ```tsx
  import TypewriterLabel from 'app/components/typewriter-label'
  ```

- [ ] **Step 2: Insert `<TypewriterLabel />` after the `<h1>` in the Hero section**

  Find:
  ```tsx
  <h1 className="font-courier text-3xl text-near-black dark:text-cream leading-tight tracking-tight mb-4">
    Hello. I&rsquo;m Keshav.
  </h1>
  <p className="text-base text-warm-dark dark:text-muted leading-relaxed max-w-xl">
  ```

  Replace with:
  ```tsx
  <h1 className="font-courier text-3xl text-near-black dark:text-cream leading-tight tracking-tight mb-1">
    Hello. I&rsquo;m Keshav.
  </h1>
  <TypewriterLabel />
  <p className="text-base text-warm-dark dark:text-muted leading-relaxed max-w-xl">
  ```

  Note: `mb-4` on `<h1>` becomes `mb-1` because `TypewriterLabel` now sits between the heading and the paragraph and carries its own `mb-1`.

- [ ] **Step 3: Visually verify in the browser**

  Run: `pnpm dev`
  Open: `http://localhost:3000`

  Check:
  - `Hello. I'm Keshav.` is static
  - Below it, text types in letter-by-letter starting with `builder`
  - After `builder` fully appears it pauses ~1.8s then erases
  - Cycles to `reader`, then `writer`, then `always learning`, then loops back to `builder`
  - A blinking cursor `|` is visible at all times next to the text
  - Spacing between heading, label, and paragraph looks natural
  - Works in both light and dark mode (toggle via OS system preference)

- [ ] **Step 4: Commit**

  ```bash
  git add app/page.tsx
  git commit -m "feat: add typewriter label to homepage hero"
  ```

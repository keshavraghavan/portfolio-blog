# Typewriter Label — Design Spec

## Overview

Add a looping typewriter effect below the `Hello. I'm Keshav.` heading on the homepage. The heading stays static; a small cycling descriptor animates beneath it.

## Behavior

- `Hello. I'm Keshav.` renders as normal static text (no change to the `<h1>`)
- Below the `<h1>`, a new line cycles through four phrases in order:
  - `builder`
  - `reader`
  - `writer`
  - `always learning`
- Loop sequence per phrase:
  1. Type character-by-character at 60ms/char
  2. Pause 1.8s after fully typed
  3. Erase character-by-character at 40ms/char
  4. Advance to next phrase (wraps back to first after last)
- A blinking cursor `|` sits at the end of the in-progress text at all times, rendered as a `<span>` with CSS opacity animation (1s step-end blink)

## Components

### `app/components/typewriter-label.tsx` (new file)

- `'use client'` directive — isolated from the server component
- Props: none (phrases are hardcoded; no need for configurability)
- State: `displayText: string`, `phraseIndex: number`, `charIndex: number`, `isDeleting: boolean`
- Single `useEffect` drives the loop via `setTimeout`; clears timeout on unmount
- Styling: `font-courier text-sm text-muted` — matches the muted label style used on cards across the site

### `app/page.tsx` (modified)

- Import `TypewriterLabel` with `dynamic` import or direct import (direct is fine since it's a leaf client component)
- Insert `<TypewriterLabel />` immediately after the `<h1>` closing tag, before the `<p>` description

## Styling

- Font: `font-courier` (Courier Prime, already loaded globally)
- Size: `text-sm` (0.875rem)
- Color: `text-muted` (`#8B8580`) — visually subordinate to the heading
- Cursor: inline `<span>` with `animate-[blink_1s_step-end_infinite]` or a CSS class
- No layout shift: the label sits in normal document flow with `mb-1` or similar

## Non-goals

- No user control over speed or phrases
- No library dependencies (typed.js, framer-motion, etc.)
- No changes to the `<h1>` itself
- No dark mode special-casing needed (text-muted already handles both modes)

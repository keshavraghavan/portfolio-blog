# Nav & Accent Color Redesign

**Date:** 2026-03-30
**Branch:** feature/redesign
**Scope:** Nav header cleanup + dual accent color system

---

## Problem

1. The `<nav>` has no max-width, so it stretches full viewport width while page content is constrained to `max-w-3xl`. This makes the nav menu appear cut off / misaligned relative to the content below.
2. The "Keshav" wordmark in the nav is redundant and pushes the menu to the far right.
3. The single orange accent (`#C7622A`) needs to be replaced with a two-color accent system.

---

## Changes

### 1. Nav (`app/components/nav.tsx`)

- Remove `<Link href="/">Keshav</Link>` wordmark entirely — no home link in the header.
- Remove `justify-between` from the nav's flex layout.
- Add `max-w-3xl mx-auto w-full` to the `<nav>` element so it aligns with page content width.
- Links sit left-aligned as a plain `flex items-center gap-5` row.
- Active underline styling and link hover behavior unchanged structurally; only hover color updates (see accent section).

### 2. Accent color system (`app/global.css`)

**Primary accent — sage green `#87ae73`:**
- Replaces `--color-accent: #C7622A` in the `@theme` block.
- Automatically propagates to all existing `text-accent`, `decoration-accent`, `bg-accent`, and `border-accent` usages:
  - Nav active link underline
  - CTA links ("Read my writing →", "All posts →", etc.)
  - Blockquote left border
  - Index card stripe
  - Editorial section label text
  - `::selection` highlight background

**Secondary accent — slate blue `#738caa`:**
- Added as `--color-accent-secondary: #738caa` in the `@theme` block.
- Applied selectively to:
  - Nav inactive link hover states (`hover:text-accent-secondary`)
  - "Listening" card label in the "What I'm Into" section on the homepage
  - Music page card header text

---

## Files Touched

| File | Change |
|------|--------|
| `app/components/nav.tsx` | Remove wordmark, constrain width, left-align links, update hover color |
| `app/global.css` | Swap accent token, add secondary token, update selection color |
| `app/page.tsx` | Update Listening card label to `text-accent-secondary` |
| `app/music/page.tsx` | Update card header text to `text-accent-secondary` |

---

## Out of Scope

- "Currently Listening To" live Spotify widget — deferred, requires Spotify OAuth setup.
- Changes to page max-widths (`max-w-3xl` / `max-w-2xl`) on individual pages.
- Dark mode token changes.

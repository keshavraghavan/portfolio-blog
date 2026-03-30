# Portfolio Blog Redesign — Magazine Layout

**Date:** 2026-03-30
**Approach:** B (Magazine Layout) — reimagine the site as a warm editorial magazine that serves both hiring managers and engaged readers.

---

## Goals

- Make the site feel like a cohesive personal brand, not disconnected pages
- Showcase portfolio skills through the design itself, not just content
- Move from generic Vercel starter aesthetic to a distinctive, warm editorial identity
- Keep all existing pages (home, blog, resume, library, music, about) and admin functionality
- Elevate the comment system into a real discussion space

## Visual Identity

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Background | `#FAF8F5` (cream) | `#1A1A1A` (near-black) | Page background |
| Surface | `#FFFFFF` (white) | `#242424` (elevated dark) | Cards, inputs |
| Border | `#E5E2DD` (warm gray) | `#333333` | Dividers, card borders |
| Text Primary | `#1A1A1A` | `#FAF8F5` | Headings, body text |
| Text Secondary | `#4A4540` (warm dark) | `#8B8580` | Body text, descriptions |
| Text Muted | `#8B8580` | `#8B8580` | Dates, metadata, inactive nav |
| Accent | `#C7622A` (burnt orange) | `#C7622A` | Links, active states, highlights |
| Surface Muted | `#F0EDE8` | `#2A2A2A` | Tags, blockquote backgrounds |

### Typography

- **Headings:** Courier Prime (monospace) — page titles, post titles, section headers, nav wordmark
- **Body:** Geist Sans — all body text, descriptions, UI text
- **Code/Metadata:** Courier Prime — dates, call numbers, code blocks
- **No serif fonts** — the mono + sans pairing provides the editorial contrast

### Layout Widths

- **Homepage, About:** `max-w-3xl` (768px) — room for grids and visual hierarchy
- **Blog posts:** `max-w-xl` (576px) — optimal reading width
- **Resume, Library, Music:** `max-w-2xl` (672px) — balanced for cards and content

### Shared Design Tokens

- **Section dividers:** Thin border line with uppercase monospace label left-aligned, line extending right (e.g., `── FEATURED WRITING ──────`)
- **Cards:** Surface background, 1px border, `border-radius: 10px`, subtle shadow on hover
- **Hover states:** Gentle lift with shadow, accent-colored underline on links
- **Transitions:** 200ms ease for all interactive states
- **Dark mode:** Follows system preference via `prefers-color-scheme`, no manual toggle

---

## Page Designs

### Navigation (all pages)

- **Left:** "Keshav" as a Courier Prime wordmark (18px, semibold)
- **Right:** Horizontal links — home, blog, resume, library, music
- **Active state:** Accent-colored underline (`text-underline-offset: 4px`, `text-decoration-thickness: 2px`)
- **Inactive:** Muted color (#8B8580), darkens on hover
- **Border:** Thin bottom border separating nav from content
- **Mobile:** Scrollable horizontal row (no hamburger menu)

### Footer (all pages)

- **Left:** `© 2025 Keshav Raghavan`
- **Right:** GitHub, LinkedIn, RSS — links in accent color
- **Separated by:** Thin top border
- **Consistent width:** Matches the page's max-width

### Homepage (`/`)

Layout width: `max-w-3xl`

**Sections (top to bottom):**

1. **Hero Section**
   - Courier Prime heading: "Hello. I'm Keshav."
   - 2-3 sentence intro in Geist Sans (who you are, what you do)
   - Two CTAs: "Read my writing →" and "See my resume →" in accent color
   - No photo/illustration — text-forward

2. **Featured Writing** (section divider label)
   - 2-column grid of post cards
   - Each card: date (mono), title (mono), excerpt (sans), on Surface background with border
   - "All posts →" link right-aligned below grid
   - Mobile: stacks to single column

3. **What I'm Into** (section divider label)
   - 3-column strip of cards: Reading, Listening, Building
   - **Reading card:** Current book title + author (hardcoded, manually updated), "Full list →" link to /library
   - **Listening card:** "Curated Playlists" + count, "Listen →" link
   - **Building card:** Current project name + tech stack, "View source →" link
   - Each card has an uppercase accent-colored category label
   - Mobile: horizontal scroll or stack vertically

4. **Footer**

### Blog Listing (`/blog`)

Layout width: `max-w-xl`

- **Page header:** Courier Prime "Writing" + subtitle "Thoughts on technology, music, and what I'm learning."
- **Post list:** Divider-separated rows, each with:
  - Left: title (Courier Prime) + excerpt below (Geist Sans, muted)
  - Right: abbreviated date in mono (e.g., "Jul 2025")
- **No cards** — clean list format for the listing page
- Top and bottom borders on the list

### Blog Post (`/blog/[slug]`)

Layout width: `max-w-xl`

- **Post header:** Date (mono, muted) above title (Courier Prime, 22px). Thin divider below.
- **Body:** Geist Sans, 14-16px, line-height 1.8, color text-secondary
- **Blockquotes:** Left border in accent color (3px), Surface Muted background, border-radius on right side, italic text
- **Code blocks:** Existing syntax highlighting, styled to match new palette
- **Images:** Rounded corners (existing behavior)

**Discussion Section (replaces "Comments"):**
- Section divider label: "Discussion" with comment count on the right
- **Comment cards:** Surface background, border, rounded corners
  - Author name (bold) + relative timestamp (right-aligned, muted)
  - Comment body below
  - "Reply" action link in accent color
- **Threaded replies:** 24px left indent for nested comments
- **Author badge:** When Keshav replies — small accent-colored "author" pill next to name
- **Comment form:** "Join the discussion..." placeholder in a dashed-border card. Expands to full form on click/focus. Fields: name + comment body. Same character limit (2000) and honeypot spam detection.
- **Moderation:** Same approve/reject flow, just restyled to match

### Resume (`/resume`)

Layout width: `max-w-2xl`

- **Page header:** Courier Prime "Resume" + one-line tagline + "Download PDF ↓" link in accent
- **Experience section:** Visual timeline
  - Vertical line (2px, border color) connecting role entries
  - Accent-colored dot (10px circle) for current role, muted dot for past roles
  - Each entry: title (mono) + date range (mono, muted, right-aligned) on first line, company name in accent below, bullet points in sans-serif
- **Education section:** Single card with degree (mono) + university and date (accent)
- **Skills section:** Pill tags — Surface background, border, rounded-full, mono text
- **Section dividers:** Same labeled divider pattern as homepage

### Library (`/library`)

Layout width: `max-w-2xl`

- **Page header:** Courier Prime "Library" + "Browse the collection. All titles recommended."
- **Category filter:** Client-side segmented control tabs — All, Philosophy, Fiction, Business, Classics (and others as needed). Filters the grid without page reload. Active tab: dark background with light text. Inactive: muted text with border. This makes the library page a client component (`'use client'`).
- **Book cards:** Library index card aesthetic
  - Slightly rounded corners (`border-radius: 4px`) — more rectangular than other cards
  - Dotted/striped accent bar at top (4px, repeating gradient pattern)
  - Title in Courier Prime
  - Author in "Last, First" format, mono, muted
  - Dashed divider below content
  - Bottom row: Dewey-style call number (e.g., "PHIL — 001") left, category tag right
  - Subtle box-shadow for tactile depth
- **2-column grid** layout
- **Card count:** "Showing X of Y titles" centered below grid
- Each card links to Amazon (existing behavior)
- Mobile: single column

### Music (`/music`)

Layout width: `max-w-2xl`

- **Page header:** Courier Prime "Music" — no subtitle
- **Playlist cards:** Vertical stack with gap
  - Surface background, border, rounded corners
  - Playlist name in Courier Prime in a header area with bottom border
  - Spotify embed directly below (no description, no extra chrome)
- Clean, minimal — lets the Spotify embeds be the content

### About (`/about`)

Layout width: `max-w-2xl`

- Redesigned to match the warm editorial style
- Courier Prime heading
- Bio text in Geist Sans with comfortable line-height
- Social links styled as accent-colored text links (same as footer pattern)

---

## Technical Approach

### What Changes

- **`app/global.css`:** New color tokens as CSS custom properties, updated prose styles, new component classes (cards, dividers, pills, timeline)
- **`app/components/nav.tsx`:** Redesigned with wordmark, active state underline, responsive behavior
- **`app/components/footer.tsx`:** Simplified layout with accent-colored links
- **`app/page.tsx`:** Complete rewrite — hero + featured posts grid + "What I'm Into" strip
- **`app/blog/page.tsx`:** New listing layout with divider-separated rows and excerpts
- **`app/blog/[slug]/page.tsx`:** Updated post header, blockquote styles, discussion section
- **`src/components/comments/CommentSection.tsx`:** "Discussion" label, comment count, threaded reply UI
- **`src/components/comments/CommentCard.tsx`:** New card styling, author badge, reply action
- **`src/components/comments/CommentForm.tsx`:** Dashed-border "Join the discussion" treatment
- **`app/resume/page.tsx`:** Visual timeline layout, skill pills, download link
- **`app/library/page.tsx`:** Card catalog grid with category filter tabs, index card styling
- **`app/music/page.tsx`:** Card-wrapped Spotify embeds, no subheadings
- **`app/about/page.tsx`:** Restyled to match new identity

### What Stays the Same

- **All API routes** — no backend changes
- **Admin interface** — functional, not public-facing; restyle is out of scope
- **MDX rendering pipeline** — `next-mdx-remote` setup stays, just CSS updates
- **Database schema** — no changes to posts or comments tables
- **Comment moderation flow** — same approve/reject behavior
- **SEO infrastructure** — sitemap, RSS, OG images, JSON-LD all stay
- **Authentication** — cookie-based admin auth unchanged
- **Dependencies** — no new packages needed (Courier Prime already loaded, Tailwind handles the rest)

### New Tailwind Theme Tokens

Define as CSS custom properties in `global.css` and reference in Tailwind classes:

```
--color-bg: #FAF8F5 / #1A1A1A
--color-surface: #FFFFFF / #242424
--color-border: #E5E2DD / #333333
--color-text: #1A1A1A / #FAF8F5
--color-text-secondary: #4A4540 / #8B8580
--color-text-muted: #8B8580
--color-accent: #C7622A
--color-surface-muted: #F0EDE8 / #2A2A2A
```

### Component Strategy

No new shared component library needed. Each page owns its layout. Shared patterns (section dividers, card base styles) are CSS classes in `global.css`, not React components. This keeps things simple and avoids premature abstraction.

---

## Out of Scope

- Admin interface redesign
- New "Projects" page (projects are surfaced on homepage "Building" card only)
- Manual dark mode toggle (follows system preference)
- New dependencies or packages
- Database or API changes
- Content changes (copy stays as-is, just restyled)
- Animations beyond hover transitions

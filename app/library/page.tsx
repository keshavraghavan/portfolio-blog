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
            aria-pressed={active === cat}
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
              aria-label={`${book.title} (opens in new tab)`}
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

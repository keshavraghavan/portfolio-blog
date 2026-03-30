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

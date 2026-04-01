'use client'

import { useEffect, useState } from 'react'

type PageViewCounterProps = {
  slug: string
}

const formatter = new Intl.NumberFormat('en-US')

export function PageViewCounter({ slug }: PageViewCounterProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let isActive = true

    async function incrementPageViews() {
      try {
        const response = await fetch('/api/page-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (isActive) {
          setCount(data.count)
        }
      } catch (error) {
        console.error('Failed to load page views:', error)
      }
    }

    incrementPageViews()

    return () => {
      isActive = false
    }
  }, [slug])

  return (
    <div className="shrink-0 rounded-sm border border-warm-border bg-surface-muted px-3 py-2 text-right dark:border-dark-border dark:bg-dark-surface-muted">
      <p className="font-courier text-[10px] uppercase tracking-[0.2em] text-muted">
        Views
      </p>
      <p className="font-courier text-sm text-near-black dark:text-cream">
        {count === null ? '...' : formatter.format(count)}
      </p>
    </div>
  )
}

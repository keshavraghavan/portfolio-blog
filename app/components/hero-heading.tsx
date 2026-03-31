'use client'

import { useEffect, useState } from 'react'

const FULL_TEXT = "Hello. I'm Keshav."
const TYPE_MS = 55

export default function HeroHeading() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (displayed.length === FULL_TEXT.length) {
      setDone(true)
      return
    }
    const id = setTimeout(
      () => setDisplayed(FULL_TEXT.slice(0, displayed.length + 1)),
      TYPE_MS
    )
    return () => clearTimeout(id)
  }, [displayed])

  return (
    <h1 className="font-courier text-3xl text-near-black dark:text-cream leading-tight tracking-tight mb-1">
      {displayed}
      <span
        aria-hidden="true"
        className="inline-block w-px h-[0.85em] bg-near-black dark:bg-cream ml-[2px] align-middle"
        style={{ animation: done ? 'blink 1s step-end infinite' : 'none' }}
      />
    </h1>
  )
}

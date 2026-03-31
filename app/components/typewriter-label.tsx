'use client'

import { useEffect, useState } from 'react'

const PHRASES = ['builder', 'reader', 'writer', 'always learning']
const TYPE_MS = 60
const DELETE_MS = 40
const PAUSE_MS = 1800
const CURSOR_ANIMATION = 'blink 1s step-end infinite'

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
        aria-hidden="true"
        className="inline-block w-px h-[0.9em] bg-muted ml-[2px] align-middle"
        style={{ animation: CURSOR_ANIMATION }}
      />
    </p>
  )
}

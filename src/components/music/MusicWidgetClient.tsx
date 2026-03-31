'use client'

import useSWR from 'swr'
import ProviderCard from 'src/components/music/ProviderCard'
import { MusicStatusResponse } from 'src/lib/music/types'

const fetcher = (url: string) =>
  fetch(url).then(async (response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch music status')
    }

    return response.json()
  })

export default function MusicWidgetClient({
  initialData,
  showAppleMusic,
}: {
  initialData: MusicStatusResponse
  showAppleMusic: boolean
}) {
  const { data } = useSWR<MusicStatusResponse>('/api/music/status', fetcher, {
    fallbackData: initialData,
    refreshInterval: 60_000,
    revalidateOnFocus: false,
  })

  if (!data) {
    return null
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        showAppleMusic ? 'md:grid-cols-2' : ''
      }`}
    >
      <ProviderCard track={data.spotify} error={data.errors.spotify} />
      {showAppleMusic && (
        <ProviderCard track={data.appleMusic} error={data.errors.appleMusic} />
      )}
    </div>
  )
}

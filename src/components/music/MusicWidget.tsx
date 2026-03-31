import { unstable_noStore as noStore } from 'next/cache'
import MusicWidgetClient from 'src/components/music/MusicWidgetClient'
import { isAppleMusicFeatureEnabled } from 'src/lib/music/env'
import { getUnifiedMusicStatus } from 'src/lib/music/service'

export default async function MusicWidget() {
  noStore()

  const initialData = await getUnifiedMusicStatus()
  const showAppleMusic = isAppleMusicFeatureEnabled()

  return (
    <MusicWidgetClient
      initialData={initialData}
      showAppleMusic={showAppleMusic}
    />
  )
}

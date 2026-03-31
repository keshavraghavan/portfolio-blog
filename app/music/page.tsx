const playlists = [
  {
    name: 'Playlist One',
    src: 'https://open.spotify.com/embed/playlist/4pGlaEAXh0DIycVRkabaqE?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Two',
    src: 'https://open.spotify.com/embed/playlist/7f2EIVOlnIvHLQZGzFPJni?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Three',
    src: 'https://open.spotify.com/embed/playlist/7oEy4MJa4cGx1oXEY8mTmS?utm_source=generator&theme=0',
  },
  {
    name: 'Playlist Four',
    src: 'https://open.spotify.com/embed/playlist/4abn2FPGEDnr1VMbe3VYFI?utm_source=generator&theme=0',
  },
]

export default function MusicPage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight mb-8">
        Music
      </h1>
      <div className="flex flex-col gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.src} className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-warm-border dark:border-dark-border">
              <p className="font-courier text-sm text-accent-secondary">
                {playlist.name}
              </p>
            </div>
            <iframe
              title={playlist.name}
              src={playlist.src}
              width="100%"
              height="152"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
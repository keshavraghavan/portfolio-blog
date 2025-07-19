export default function MusicPage() {
  return (
    <div>
        <h1 className='text-4xl tracking-tighter'>
            Music
        </h1> 

        <p className="mb-6 text-lg tracking-tight">
            < br />
            This page contains a collection of music that I have curated on Spotify.
            I have a passion for music and enjoy exploring different genres and artists.
            Below are links to my playlists on both platforms. Feel free to check them out and discover
            some of my favorite tracks. If you have any recommendations or want to share your own playlists
            with me, please reach out!
        </p>

        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/4pGlaEAXh0DIycVRkabaqE?utm_source=generator&theme=0"
          width="100%"
          height="152"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>

        < br />

        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/7f2EIVOlnIvHLQZGzFPJni?utm_source=generator&theme=0"
          width="100%"
          height="152"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>

        < br />

       <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/7oEy4MJa4cGx1oXEY8mTmS?utm_source=generator&theme=0"
          width="100%"
          height="152"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>

        < br />

        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/4abn2FPGEDnr1VMbe3VYFI?utm_source=generator&theme=0"
          width="100%"
          height="152"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>

        < br />
    </div>
  );
}
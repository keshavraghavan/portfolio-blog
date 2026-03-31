export const metadata = {
  title: 'About',
  description: 'About Keshav Raghavan.',
}

export default function AboutPage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight mb-6">
        About
      </h1>

      <div className="space-y-4">
        <p className="text-base text-warm-dark dark:text-cream leading-relaxed">
          I&rsquo;m Keshav &mdash; a writer, musician, and engineer based in Dallas, TX.
          I work in digital product at Citibank, where I help build and ship software
          that reaches millions of people.
        </p>
        <p className="text-base text-warm-dark dark:text-cream leading-relaxed">
          This site is a personal playground where I refine my writing, tinker with
          engineering ideas, and explore music more intentionally. It&rsquo;s a space
          for honest reflection &mdash; to uncover meaning in everyday pursuits and
          share thoughts freely.
        </p>
        <p className="text-base text-warm-dark dark:text-cream leading-relaxed">
          Whatever brought you here, I&rsquo;m glad you stopped by.
        </p>
      </div>

      <div className="mt-10">
        <div className="editorial-divider">
          <span>Find Me</span>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="https://www.instagram.com/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            Instagram &rarr;
          </a>
          <a
            href="https://www.linkedin.com/in/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            LinkedIn &rarr;
          </a>
          <a
            href="mailto:me@keshavraghavan.com"
            className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
          >
            Email &rarr;
          </a>
        </div>
      </div>

      <div className="mt-10">
        <div className="editorial-divider">
          <span>Currently Reading</span>
        </div>
        <a
          href="/library"
          className="text-sm text-accent hover:underline underline-offset-2 transition-colors"
        >
          Browse the library &rarr;
        </a>
      </div>
    </section>
  )
}

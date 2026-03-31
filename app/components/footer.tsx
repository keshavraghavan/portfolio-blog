export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-warm-border dark:border-dark-border">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Keshav Raghavan
        </p>
        <div className="flex gap-4 text-xs">
          <a
            href="https://github.com/keshavraghavan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/raghavankeshav/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/rss"
            className="text-accent hover:underline underline-offset-2 transition-colors"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  )
}

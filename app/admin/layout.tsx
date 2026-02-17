import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="flex gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <Link
          href="/admin/comments"
          className="text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          Comments
        </Link>
        <Link
          href="/admin/posts"
          className="text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          Posts
        </Link>
      </nav>
      {children}
    </div>
  );
}

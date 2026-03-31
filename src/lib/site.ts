export const baseUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://portfolio-blog-starter.vercel.app'
).replace(/\/$/, '')

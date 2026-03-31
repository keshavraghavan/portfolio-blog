import { baseUrl } from 'src/lib/site'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

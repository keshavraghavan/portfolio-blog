import fs from 'fs'
import path from 'path'
import { db } from 'src/db'
import { posts } from 'src/db/schema'
import { eq } from 'drizzle-orm'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  if (!match || !match[1]) {
    return { metadata: {} as Metadata, content: fileContent };
  }
  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  console.log('Found MDX files:', mdxFiles);
  return mdxFiles.map((file) => {
    console.log('Processing file:', file);
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export async function getBlogPosts() {
  const filePosts = getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))

  let dbPosts: typeof filePosts = []
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.isDraft, false))

    dbPosts = rows.map((row) => ({
      metadata: {
        title: row.title,
        publishedAt: row.publishedAt,
        summary: row.summary,
        image: row.image ?? undefined,
      },
      slug: row.slug,
      content: row.body,
    }))
  } catch (error) {
    console.error('Failed to fetch posts from DB:', error)
  }

  const slugSet = new Set(dbPosts.map((p) => p.slug))
  const merged = [
    ...dbPosts,
    ...filePosts.filter((p) => !slugSet.has(p.slug)),
  ]

  return merged
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (typeof date !== 'string') {
    return ''
  }
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  if (isNaN(targetDate.getTime())) {
    return ''
  }

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

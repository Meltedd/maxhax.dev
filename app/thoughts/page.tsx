import { promises as fs } from 'fs'
import Link from 'next/link'
import path from 'path'

export const metadata = {
  title: 'Thoughts',
}

/** Parse a `YYYY.MM.DD` date string into a numeric sort key (YYYYMMDD), or 0 if malformed. */
function dateSortKey(date: string): number {
  const parts = date.split('.')
  if (parts.length !== 3) return 0
  const [y, m, d] = parts.map(Number)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return 0
  return y * 10000 + m * 100 + d
}

const articlesDirectory = path.join(
  process.cwd(),
  'app',
  'thoughts',
  '_articles'
)

export default async function Page() {
  const articles = await fs.readdir(articlesDirectory)
  const items = []

  for (const article of articles) {
    if (!article.endsWith('.mdx')) continue
    const articleModule = await import(`./_articles/${article}`)
    if (!articleModule.metadata) throw new Error(`Missing \`metadata\` in ${article}`)

    items.push({
      slug: article.replace(/\.mdx$/, ''),
      title: articleModule.metadata.title,
      date: articleModule.metadata.date || '-',
      sort: articleModule.metadata.date ? dateSortKey(articleModule.metadata.date) : 0,
    })
  }

  items.sort((a, b) => b.sort - a.sort)

  return (
    <div>
      <h1 className="text-page-title font-bold text-rurikon-700 page-title-gap tracking-tight eb-garamond-italic">
        Thoughts
      </h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/thoughts/${item.slug}`}
              className='group flex gap-3 justify-between items-baseline'
              draggable={false}
            >
              <span className='block text-section-lede text-rurikon-600 font-serif eb-garamond-italic'>
                {item.title}
              </span>
              <span className='text-sm dot-leaders flex-1 text-rurikon-100 font-normal leading-none' />
              <time className='block text-list-meta text-rurikon-300 group-hover:text-link-hover tabular-nums font-serif tracking-tight eb-garamond-italic link-hover-transition'>
                {item.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

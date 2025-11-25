import { promises as fs } from 'fs'
import Link from 'next/link'
import path from 'path'

export const metadata = {
  title: 'Thoughts',
}

export const dynamic = 'force-static'

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
    const articleModule = await import('./_articles/' + article)
    if (!articleModule.metadata) throw new Error('Missing `metadata` in ' + article)

    items.push({
      slug: article.replace(/\.mdx$/, ''),
      title: articleModule.metadata.title,
      date: articleModule.metadata.date || '-',
      sort: Number(articleModule.metadata.date?.replaceAll('.', '') || 0),
    })
  }

  items.sort((a, b) => b.sort - a.sort)

  return (
    <div className="max-w-[66ch] mobile:max-w-[min(66ch,50vw)]">
      <h1 className="text-4xl sm:text-5xl font-bold text-rurikon-700 mb-6 tracking-tight eb-garamond-italic">
        Thoughts
      </h1>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/thoughts/${item.slug}`}
              className='group flex gap-3 justify-between items-center'
              draggable={false}
            >
              <span className='block text-base sm:text-lg text-rurikon-600 font-serif eb-garamond-italic transition-colors duration-300 ease-in-out'>
                {item.title}
              </span>
              <span className='text-sm dot-leaders flex-1 text-rurikon-100 font-normal leading-none' />
              <time className='block text-sm sm:text-base text-rurikon-300 tabular-nums font-serif tracking-tight self-start eb-garamond-italic'>
                {item.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
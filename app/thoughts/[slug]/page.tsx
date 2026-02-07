import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug)
}

type SlugParams = { slug: string }

type PageProps = { params: Promise<SlugParams> }

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params

  if (!isValidSlug(resolvedParams.slug)) {
    notFound()
  }
  
  let MDXContent: React.ComponentType
  try {
    const mod = await import(`../_articles/${resolvedParams.slug}.mdx`)
    MDXContent = mod.default
  } catch {
    notFound()
  }

  return (
    <div
      className={cn(
        'thought-article max-w-[66ch] mobile:max-w-[min(66ch,60vw)] space-y-[clamp(1rem,1.6vw,1.75rem)] text-[clamp(0.95rem,0.65vw+0.95rem,1.25rem)]',
      )}
      lang='en'
    >
      <Link 
        href="/thoughts" 
        className="inline-block mb-6 text-rurikon-400 hover:text-rurikon-700 transition-colors text-base sm:text-lg eb-garamond-italic"
      >
        ← thoughts
      </Link>
      <MDXContent />
    </div>
  )
}

export async function generateStaticParams(): Promise<SlugParams[]> {
  const articles = await fs.readdir(
    path.join(process.cwd(), 'app', 'thoughts', '_articles')
  )

  return articles
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => ({
      slug: name.replace(/\.mdx$/, ''),
    }))
}

type GenerateMetadataProps = { params: Promise<SlugParams> }

export async function generateMetadata({ params }: GenerateMetadataProps) {
  const resolvedParams = await params

  if (!isValidSlug(resolvedParams.slug)) {
    return {}
  }
  
  try {
    const mod = await import(`../_articles/${resolvedParams.slug}.mdx`)
    const metadata = mod.metadata
    return {
      title: metadata.title,
      description: metadata.description,
    }
  } catch {
    return {}
  }
}

export const dynamic = 'force-static'

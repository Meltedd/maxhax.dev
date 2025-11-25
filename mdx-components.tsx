/* eslint-disable @next/next/no-img-element */
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { codeToHtml } from 'shiki'
import Link from 'next/link'
import Image from 'next/image'

// @ts-expect-error - react-katex doesn't have proper TypeScript declarations
import { InlineMath, BlockMath } from 'react-katex'

import { BlockSideTitle } from '@/components/BlockSideTitle'

export const components: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: any) => ReactNode | Promise<ReactNode>
> = {
  h1: (props) => (
    <h1
      className='mb-5 text-balance font-bold eb-garamond-italic'
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className='font-bold mt-11 mb-4 text-rurikon-700 text-balance'
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className='font-bold mt-8 mb-3.5 text-rurikon-700 text-balance'
      {...props}
    />
  ),
  p: (props) => (
    <p
      className='mb-4'
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className='my-5 list-disc list-outside marker:text-rurikon-200 pl-6 space-y-2'
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className='my-5 list-decimal list-outside marker:text-rurikon-200 pl-6 space-y-2'
      {...props}
    />
  ),
  li: (props) => <li className='pl-2' {...props} />,
  a: ({ href, ...props }) => {
    return (
      <Link
        className='break-words underline decoration-1 underline-offset-4 font-semibold eb-garamond-italic text-[1.08em] focus:outline-none focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50 focus-visible:ring-offset-2'
        href={href}
        draggable={false}
        {...((href?.startsWith('https://') || href?.startsWith('http://'))
          ? {
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          : {})}
        {...props}
      />
    )
  },
  strong: (props) => <strong className='font-bold' {...props} />,
  blockquote: (props) => (
    <blockquote
      className='my-8 pl-6 italic text-rurikon-500 [&>p]:mb-2 border-l-2 border-rurikon-100'
      {...props}
    />
  ),
  code: async (props) => {
    if (typeof props.children !== 'string') {
      return <code {...props} />
    }

    const lang = props.className?.match(/language-(\S+)/)?.[1]

    if (!lang) {
      return <code>{props.children}</code>
    }

    const code = await codeToHtml(props.children, {
      lang,
      theme: 'gruvbox-light-soft',
      transformers: [
        {
          pre: (hast) => {
            if (hast.children.length !== 1) {
              throw new Error('<pre>: Expected a single <code> child')
            }
            if (hast.children[0].type !== 'element') {
              throw new Error('<pre>: Expected a <code> child')
            }
            return hast.children[0]
          },
          postprocess(html) {
            return html.replace(/^<code>|<\/code>$/g, '')
          },
        },
      ],
    })

    return <code dangerouslySetInnerHTML={{ __html: code }} />
  },
  Image,
  img: async ({ src, alt, title }) => {
    let img: React.ReactNode

    if (src.startsWith('https://')) {
      img = (
        <img
          className='mt-9'
          src={src}
          alt={alt}
          loading='lazy'
          decoding='async'
          draggable={false}
        />
      )
    } else {
      const image = await import(`./assets/images/${src}`)
      img = (
        <Image
          className='mt-9'
          src={image.default}
          alt={alt}
          quality={95}
          placeholder='blur'
          draggable={false}
        />
      )
    }

    if (title) {
      return <BlockSideTitle title={title}>{img}</BlockSideTitle>
    }

    return img
  },
  hr: (props) => <hr className='my-16 w-32 border-rurikon-border' {...props} />,
  BlockSideTitle,
  InlineMath,
  BlockMath,
}

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(components as any),
  }
}

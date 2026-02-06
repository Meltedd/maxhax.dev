import { Fragment } from 'react'

// Title animation - uses nth-child for delays
export function StaggerTitle({ text, end = '.' }: { text: string; end?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="stagger-title">{word}</span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
      <span className="stagger-dot">{end}</span>
    </>
  )
}

// Body text animation - uses inline delays
type Item = string | { text: string; href?: string; className?: string }

type StaggerProps = {
  start: number
  step?: number
  items: Item[]
}

function isLink(item: Item): item is { text: string; href: string; className?: string } {
  return typeof item === 'object' && 'href' in item
}

function nextStartsWithPunctuation(items: Item[], i: number): boolean {
  const next = items[i + 1]
  if (!next) return false
  const text = typeof next === 'string' ? next : next.text
  return /^[.,;:!?)'\]"]/.test(text)
}

export function Stagger({ start, step = 0.01, items }: StaggerProps) {
  let wordIndex = 0

  return (
    <>
      {items.map((item, i) => {
        const text = typeof item === 'string' ? item : item.text
        const words = text.split(' ').filter(Boolean)

        const rendered = words.map((word, wi) => {
          const delay = start + wordIndex * step
          wordIndex++

          const baseClass = 'stagger-word'
          const extraClass = typeof item === 'object' && item.className ? ` ${item.className}` : ''

          if (isLink(item) && wi === 0) {
            // For links, wrap all words together as one animated element
            wordIndex += words.length - 1
            return (
              <a
                key={wi}
                href={item.href}
                className={`${baseClass} underline decoration-1 underline-offset-4 font-semibold eb-garamond-italic${extraClass}`}
                style={{ animationDelay: `${delay.toFixed(2)}s` }}
              >
                {text}
              </a>
            )
          }

          if (isLink(item)) return null // Already handled

          return (
            <Fragment key={wi}>
              <span
                className={`${baseClass}${extraClass}`}
                style={{ animationDelay: `${delay.toFixed(2)}s` }}
              >
                {word}
              </span>
              {wi < words.length - 1 && ' '}
            </Fragment>
          )
        })

        return (
          <Fragment key={i}>
            {rendered}
            {i < items.length - 1 && !(isLink(items[i]) && nextStartsWithPunctuation(items, i)) && ' '}
          </Fragment>
        )
      })}
    </>
  )
}

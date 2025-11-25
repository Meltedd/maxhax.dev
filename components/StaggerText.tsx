import { Fragment } from 'react'

interface StaggerTitleProps {
  text: string
  end?: string
}

export function StaggerTitle({ text, end = '.' }: StaggerTitleProps) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="zen-text-part"
            style={{ animationDelay: `${0.1 + i * 0.2}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
      <span className="zen-period-dot">{end}</span>
    </>
  )
}

type Item = string | { text: string; href?: string; className?: string }

interface StaggerProps {
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
        const suppressSpace = nextStartsWithPunctuation(items, i)
        const extraClass = typeof item === 'object' && item.className ? ` ${item.className}` : ''

        if (isLink(item)) {
          const delay = start + wordIndex * step
          wordIndex += words.length
          return (
            <Fragment key={i}>
              <a
                href={item.href}
                className={`zen-word underline decoration-1 underline-offset-4 font-semibold eb-garamond-italic${extraClass}`}
                style={{ animationDelay: `${delay.toFixed(2)}s` }}
              >
                {text}
              </a>
              {i < items.length - 1 && !suppressSpace && ' '}
            </Fragment>
          )
        }

        const rendered = words.map((word, wi) => {
          const delay = start + wordIndex * step
          wordIndex++
          return (
            <Fragment key={wi}>
              <span
                className={`zen-word${extraClass}`}
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
            {i < items.length - 1 && !suppressSpace && ' '}
          </Fragment>
        )
      })}
    </>
  )
}

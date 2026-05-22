import { Fragment } from 'react'

const UNIT_DELAY_STEP = 0.01
const COPY_UNIT_DELAY_STEP = 0.0075

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
            className="stagger-title"
            style={{ animationDelay: `${0.1 + i * 0.2}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
      <span className="stagger-dot">{end}</span>
    </>
  )
}

type Item = string | { text: string; href?: string; className?: string }

interface StaggerProps {
  start: number
  items: Item[]
}

interface StaggeredCopyProps {
  start: number
  paragraphs: Item[][]
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

function splitWords(text: string) {
  return text.split(' ').filter(Boolean)
}

export function Stagger({ start, items }: StaggerProps) {
  let unitIndex = 0
  const nextDelay = () => {
    const delay = start + unitIndex * UNIT_DELAY_STEP
    unitIndex++
    return delay
  }

  return <>{renderStaggeredItems(items, nextDelay)}</>
}

export function StaggeredCopy({ start, paragraphs }: StaggeredCopyProps) {
  let unitIndex = 0
  const nextDelay = () => {
    const index = unitIndex
    unitIndex++
    return start + index * COPY_UNIT_DELAY_STEP
  }

  return (
    <>
      {paragraphs.map((items, i) => (
        <p key={i}>
          {renderStaggeredItems(items, nextDelay)}
        </p>
      ))}
    </>
  )
}

function renderStaggeredItems(
  items: Item[],
  nextDelay: () => number
) {
  return (
    <>
      {items.map((item, i) => {
        const text = typeof item === 'string' ? item : item.text
        const words = splitWords(text)
        const suppressSpace = nextStartsWithPunctuation(items, i)
        const extraClass = typeof item === 'object' && item.className ? ` ${item.className}` : ''

        if (isLink(item)) {
          const delay = nextDelay()
          return (
            <Fragment key={i}>
              <a
                href={item.href}
                className={`stagger-word underline decoration-1 underline-offset-4 font-semibold eb-garamond-italic${extraClass}`}
                style={{ animationDelay: `${delay.toFixed(3)}s` }}
              >
                {text}
              </a>
              {i < items.length - 1 && !suppressSpace && ' '}
            </Fragment>
          )
        }

        const rendered = words.map((word, wi) => {
          const delay = nextDelay()
          return (
            <Fragment key={wi}>
              <span
                className={`stagger-word${extraClass}`}
                style={{ animationDelay: `${delay.toFixed(3)}s` }}
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

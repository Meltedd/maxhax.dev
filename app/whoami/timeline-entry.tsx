import type { TimelineEntry as TimelineEntryData, TimelineBodyPart } from './timeline-data'

const linkClass = 'underline decoration-1 underline-offset-4 font-semibold italic'

function renderBodyPart(part: TimelineBodyPart, index: number) {
  if (part.type === 'text') {
    return <span key={index}>{part.text}</span>
  }

  return (
    <a key={index} href={part.href} className={linkClass}>
      {part.text}
    </a>
  )
}

export function TimelineEntry({ entry }: { entry: TimelineEntryData }) {
  return (
    <div
      className='timeline-entry stagger-timeline-entry'
      style={{ animationDelay: `${entry.delay}s` }}
      data-year={entry.year}
    >
      <div className='entry-connector' />
      <div className='entry-content'>
        <span className='entry-month'>{entry.month}</span>
        <p>{entry.body.map(renderBodyPart)}</p>
      </div>
    </div>
  )
}


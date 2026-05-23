interface BlockSideTitleProps {
  title: React.ReactNode
  children: React.ReactNode
}

export function BlockSideTitle({ title, children }: BlockSideTitleProps) {
  return (
    <figure className='my-9'>
      <div className='sidenote-content-wrap'>
        <div className='sidenote-content'>{children}</div>
      </div>
      <figcaption className='sidenote'>
        <span className='sr-only'>Sidenote: </span>
        {title}
      </figcaption>
    </figure>
  )
}

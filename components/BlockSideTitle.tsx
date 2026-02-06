import cn from 'clsx'

interface BlockSideTitleProps {
  title: React.ReactNode
  children: React.ReactNode
}

export function BlockSideTitle({ title, children }: BlockSideTitleProps) {
  return (
    <figure className='my-9'>
      <span className='inline-block w-full'>
        <span className='sidenote-content float-left w-full'>{children}</span>
      </span>
      <span
        className={cn(
          'sidenote block relative mt-4 mb-0 mx-auto text-left text-pretty w-[85%] text-[0.95rem] leading-6 text-rurikon-600 italic',
          'text:inline text:float-right text:clear-right text:w-[50%] text:-mr-[50%] text:mt-0 text:pl-6',
          'text:before:content-["←"] text:before:relative text:before:top-0 text:before:-left-3 text:before:text-lg text:before:text-rurikon-400'
        )}
      >
        <span className='sr-only'>Sidenote: </span>
        {title}
      </span>
    </figure>
  )
}

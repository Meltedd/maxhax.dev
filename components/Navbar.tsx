'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function Item(props: React.ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const href = props.href

  if (typeof href !== 'string') {
    throw new Error('`href` must be a string')
  }

  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <li
      className={cn(
        isActive
          ? 'text-rurikon-800'
          : 'text-rurikon-300 hover:text-rurikon-600',
        'hover:transform-none',
        '-mx-2'
      )}
    >
      <Link 
        {...props} 
        prefetch={true} 
        className='inline-block px-2 whitespace-nowrap mobile:w-full' 
        draggable={false}
        aria-current={isActive ? 'page' : undefined}
      />
    </li>
  )
}

export function Navbar() {
  return (
    <nav className='w-full px-[clamp(1.5rem,3vw,3.5rem)] border-b border-rurikon-border/50 mobile:px-0 mobile:border-b-0 mobile:mr-[clamp(1.5rem,2.5vw,3.5rem)] mobile:w-28'>
      <ul className='text-[clamp(0.95rem,0.45vw+0.9rem,1.2rem)] flex gap-[clamp(1rem,1.5vw,1.25rem)] justify-start items-center pb-[clamp(1.75rem,2.5vw,2.5rem)] mobile:pb-4 mobile:flex-col mobile:items-end mobile:justify-start mobile:block mobile:text-right mobile:sticky mobile:top-[clamp(2rem,3vw,4rem)] mobile:space-y-[clamp(0.75rem,1.5vw,1rem)] mobile:gap-0 eb-garamond-italic'>
        <Item href='/'>about</Item>
        <Item href='/thoughts'>thoughts</Item>
        <Item href='/whoami'>whoami</Item>
        <Item href='/contact'>say hi</Item>
      </ul>
    </nav>
  )
}

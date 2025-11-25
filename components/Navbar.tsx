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
    <nav
      className={cn(
        'w-full px-[clamp(1.5rem,3vw,3.5rem)]',
        'mobile:w-28 mobile:px-0 mobile:mr-6'
      )}
    >
      <ul
        className={cn(
          'flex items-center justify-end gap-[clamp(1rem,1.5vw,1.25rem)]',
          'text-[clamp(0.95rem,0.45vw+0.9rem,1.1rem)] eb-garamond-italic',
          'pb-4 border-b border-rurikon-border/50 mobile:border-b-0',
          'mobile:block mobile:sticky mobile:top-8',
          'mobile:pb-4 mobile:text-right mobile:space-y-3'
        )}
      >
        <Item href='/'>about</Item>
        <Item href='/thoughts'>thoughts</Item>
        <Item href='/whoami'>whoami</Item>
        <Item href='/contact'>say hi</Item>
      </ul>
    </nav>
  )
}

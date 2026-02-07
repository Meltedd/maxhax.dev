'use client'

import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import cn from 'clsx'

interface NavigationWrapperProps {
  children: React.ReactNode
}

export function NavigationWrapper({ children }: NavigationWrapperProps) {
  const hasNavigated = useRef(false)
  const [skipAnims, setSkipAnims] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    if (hasNavigated.current) {
      setSkipAnims(true)
    }
    hasNavigated.current = true
  }, [pathname])

  return (
    <article
      className={cn(
        'px-[clamp(1.5rem,3vw,3.5rem)] pt-8 mobile:pt-4 mobile:pl-8 mobile:pr-0 sm:pl-12 md:pl-16',
        skipAnims && 'skip-animations'
      )}
    >
      {children}
    </article>
  )
}


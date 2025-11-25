'use client'

import { useRef, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import cn from 'clsx'

interface NavigationWrapperProps {
  children: React.ReactNode
}

export function NavigationWrapper({ children }: NavigationWrapperProps) {
  const hasNavigated = useRef(false)
  const [skipAnims, setSkipAnims] = useState(false)
  const pathname = usePathname()
  
  useLayoutEffect(() => {
    if (hasNavigated.current) {
      setSkipAnims(true)
    }
    hasNavigated.current = true
  }, [pathname])

  return (
    <div
      className={cn(
        'px-[clamp(1.5rem,3vw,3.5rem)] pt-8 mobile:pt-4 mobile:px-8 sm:px-12 md:px-16',
        skipAnims && 'skip-animations'
      )}
    >
      {children}
    </div>
  )
}


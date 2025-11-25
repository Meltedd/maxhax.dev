import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

import cn from 'clsx'
import localFont from 'next/font/local'
import { EB_Garamond } from 'next/font/google'
import 'katex/dist/katex.min.css'

import Navbar from '@/components/navbar'
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper'
import { NavigationWrapper } from './navigation-wrapper'
import './globals.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const sans = localFont({
  src: './_fonts/InterVariable.woff2',
  preload: true,
  variable: '--sans',
})

const mono = localFont({
  src: './_fonts/IosevkaFixedCurly-ExtendedMedium.woff2',
  preload: true,
  variable: '--mono',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Max Harari',
    default: 'Max Harari',
  },
  description: 'Personal website and portfolio of Max Harari',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maxhax.dev',
    siteName: 'Max Harari',
    title: 'Max Harari',
    description: 'Personal website and portfolio of Max Harari',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Harari',
    description: 'Personal website and portfolio of Max Harari',
  },
}

export const viewport: Viewport = {
  maximumScale: 1,
  colorScheme: 'only light',
  themeColor: '#fcfcfc',
}

// Force static generation across the app (faster client transitions)
export const dynamic = 'force-static'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='overflow-x-hidden touch-manipulation'>
      <body
        className={cn(
          sans.variable,
          ebGaramond.variable,
          mono.variable,
          'w-full py-[clamp(1.5rem,2.5vw,4rem)] px-[clamp(1.5rem,3vw,3.5rem)] mobile:pl-0 mobile:pr-[clamp(0.75rem,1.25vw,2rem)]',
          'text-[clamp(1rem,0.5vw+0.95rem,1.3rem)]',
          'text-rurikon-500',
          'antialiased'
        )}
      >
        <div className='fixed sm:hidden h-[clamp(2rem,3vw,4rem)] w-full top-0 left-0 z-30 pointer-events-none content-fade-out' />
        <div className='flex flex-col mobile:flex-row'>
          <Navbar />
          <main className='relative flex-1 max-w-8xl [contain:inline-size]'>
            <div className='hidden mobile:block absolute left-0 w-px h-full opacity-100 bg-rurikon-border' />
            <ErrorBoundaryWrapper>
              <NavigationWrapper>
                {children}
              </NavigationWrapper>
            </ErrorBoundaryWrapper>
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

import cn from 'clsx'
import localFont from 'next/font/local'
import { EB_Garamond } from 'next/font/google'
import 'katex/dist/katex.min.css'

import { Navbar } from '@/components/Navbar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NavigationWrapper } from '@/components/NavigationWrapper'
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
          'w-full py-6 px-[clamp(1.5rem,3vw,3.5rem)] mobile:pl-0 mobile:pr-3',
          'text-[clamp(1rem,0.5vw+0.95rem,1.15rem)]',
          'text-rurikon-500',
          'antialiased'
        )}
      >
        <div className='flex flex-col mobile:flex-row max-w-3xl'>
          <Navbar />
          <main className='relative flex-1 [contain:inline-size]'>
            <div className='hidden mobile:block absolute left-0 w-px h-full bg-rurikon-border' />
            <ErrorBoundary>
              <NavigationWrapper>
                {children}
              </NavigationWrapper>
            </ErrorBoundary>
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}

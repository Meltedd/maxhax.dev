import withMDX from '@next/mdx'
import { NextConfig } from 'next'
import './server-setup'

export default withMDX()({
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  redirects: async () => [
    {
      source: '/posts/:slug',
      destination: '/thoughts/:slug',
      permanent: false,
    },
  ],
  headers: async () => {
    const isDev = process.env.NODE_ENV === 'development'
    const csp = isDev
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vercel.live https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com https://va.vercel-scripts.com ws: wss:; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'self';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vercel.live https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com https://va.vercel-scripts.com; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'self';"

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
  experimental: {
    viewTransition: true,
    mdxRs: {
      mdxType: 'gfm',
    },
  },
  transpilePackages: ['shiki'],
  images: {
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
} satisfies NextConfig)

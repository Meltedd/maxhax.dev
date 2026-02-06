# maxhax.dev

Source for [maxhax.dev](https://maxhax.dev).

- Next.js 15
- MDX
- Tailwind v4

## Setup

Requires Node 18.18+ and pnpm.

```bash
pnpm install
pnpm dev
```

## Environment variables

The contact form needs:

- `RESEND_API_KEY` from [Resend](https://resend.com)
- `CONTACT_EMAIL` for the recipient address
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for rate limiting (production only)

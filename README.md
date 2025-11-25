# maxhax.dev

Personal portfolio and blog. Live at [maxhax.dev](https://maxhax.dev).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Content:** MDX + Shiki
- **Email:** Resend
- **Deployment:** Vercel

## Setup

Requires Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev
```

## Environment Variables

Required for the contact form:

| Variable | Description |
| -------- | ----------- |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `CONTACT_EMAIL` | Email address to receive contact form submissions |

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript checks |

## Structure

```
app/
├── contact/      # Contact form
├── thoughts/     # Blog (MDX articles)
├── whoami/       # About page
└── page.mdx      # Home

components/       # React components
assets/           # Images
public/           # Static assets
```

## Deployment

Configured for Vercel. Import the repo, select the Next.js preset, and add the environment variables above.

## License

MIT
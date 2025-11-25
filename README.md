# maxhax.dev

Personal site + writing portfolio → [https://maxhax.dev](https://maxhax.dev)

## Stack
- Next.js 15 App Router (static-first, view transitions enabled)
- MDX (Rust compiler) + Shiki highlighting in server components
- Tailwind CSS v4 pipeline via `@tailwindcss/postcss`
- Local/Google fonts via `next/font`, KaTeX for math, Vercel Analytics

## Working locally
```bash
pnpm install     # Node 18+
pnpm dev         # Next dev server with Turbo
pnpm lint        # ESLint (Next core-web-vitals, max warnings = 0)
pnpm type-check  # tsc --noEmit
pnpm build       # Production build (same command Vercel runs)
```

## Quality gates
- ESLint flat config layers `@eslint/js`, `@next/eslint-plugin-next`, and `eslint-plugin-react`.
- TypeScript is `strict` with bundler module resolution and Next plugin hints.
- Content Security Policy, HSTS, and Permissions Policy ship via `next.config.ts`.

## Deployment (Vercel)
1. Import repo and choose the **Next.js** preset.
2. Build: `pnpm build` · Output: `.next` · Runtime: Node 18+ (works with `sharp@0.34`).
3. Env vars: none for now - add via Project Settings if needed for APIs.
4. Analytics + security headers are configured in `next.config.ts` and apply to every preview/production build.
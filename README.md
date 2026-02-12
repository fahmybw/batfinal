# BAT — AI Social Media Agency MVP

BAT is a production-oriented Next.js MVP that unifies intake → memory → chat/content generation → calendar planning → scheduled publishing stubs.

## Security note
- Next.js is version-ranged (`^15.0.0`) to allow patched 15.x releases during install/deploy and avoid known vulnerable pins.

## Stack
- Next.js App Router + TypeScript
- TailwindCSS (dark-first minimalist UI)
- Prisma + PostgreSQL
- Custom auth (email/password + DB sessions + email OTP 2FA)
- OpenAI with deterministic mock fallback

## Quick start
1. `pnpm install`
2. `cp .env.example .env` and fill values.
3. `pnpm db:migrate`
4. `pnpm db:seed`
5. `pnpm dev`

Demo account after seed:
- Email: `demo@bat.ai`
- Password: `Password123!`

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm db:migrate`
- `pnpm db:seed`

## Auth & Security model
- Sessions are stored in DB (`Session` table) and cookie stores opaque token.
- App routes use middleware to require a valid session cookie and 2FA cookie gate.
- 2FA sends 6-digit email OTP (10 min expiry).
- Forgot password uses single-use token.

## Cron jobs
Configured in `vercel.json` with **daily schedules** compatible with Vercel Hobby:
- `/api/cron/workflows` at `0 6 * * *`
- `/api/cron/publish` at `30 6 * * *`

Each requires `x-cron-secret` header matching `CRON_SECRET`. If you upgrade to Pro, you can increase frequency.

## Environment variables
See `.env.example`:
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `SESSION_COOKIE_NAME`
- `SESSION_TTL_HOURS`
- `CRON_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Deploy to Vercel

### Preview deployment mode
To unblock quick UI previews on Vercel, build is currently configured to ignore TypeScript and ESLint build-time failures in `next.config.ts`. This is a temporary tradeoff for preview deploys and should be removed before production hardening.
1. Push repo.
2. Import project in Vercel.
3. Provision PostgreSQL and set env vars.
4. Run Prisma migration during build or once via CLI.
5. Ensure Cron secret configured and sent by cron requests.


- If your Vercel project was previously configured with Output Directory = `public`, this repo now includes a committed `public/index.html` fallback so deploy validation won't fail. For full Next.js behavior, set Framework Preset to Next.js and clear custom Output Directory in Vercel settings.

## Known limitations
- Social platform posting is a stub adapter (marks posted + logs payload).
- URL ingestion uses basic HTML stripping for MVP readability extraction.
- Retrieval uses keyword contains search rather than advanced vector embeddings.

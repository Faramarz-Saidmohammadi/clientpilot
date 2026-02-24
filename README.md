# ClientPilot

Production-ready multi-tenant SaaS for freelancers/agencies: clients, projects, tasks, time tracking, invoicing, team collaboration, and Stripe billing.

## Stack
- Next.js (App Router) + TypeScript (strict)
- TailwindCSS + shadcn-style primitives + lucide-react
- MongoDB + Mongoose
- Auth.js / NextAuth (Credentials + Google)
- Stripe Checkout + webhooks (Free/Pro)
- Email via Resend (fallback: Nodemailer SMTP)
- i18n via next-intl (`en` LTR, `fa` RTL)
- Charts via recharts
- Tables via @tanstack/react-table
- Validation via zod + react-hook-form
- Tests: Vitest + Playwright
- Docker Compose for local MongoDB

## Quick Start
1. Install dependencies
```bash
npm install
```
2. Start MongoDB
```bash
docker compose up -d
```
3. Configure environment
```bash
cp .env.example .env.local
```
4. Seed demo data
```bash
npm run seed
```
5. Run app
```bash
npm run dev
```

Open `http://localhost:3000/en`.

## Demo Login
- Email: `owner@clientpilot.local`
- Password: `Passw0rd!`

## Required Env Vars
See `.env.example`.

Key values to configure externally:
- Google OAuth credentials from Google Cloud Console
- Stripe keys + product price IDs from Stripe Dashboard
- Stripe webhook secret from `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Resend API key from Resend dashboard (or SMTP fallback)

## Stripe Setup
1. Create product/price for Pro plan in Stripe.
2. Put price in `STRIPE_PRICE_PRO`.
3. Run webhook forwarder:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`.

## Testing
Unit tests:
```bash
npm run test
```
E2E tests:
```bash
npx playwright install
npm run test:e2e
```

## Build
```bash
npm run build
npm run start
```

## Deployment (Vercel + MongoDB Atlas)
1. Create MongoDB Atlas cluster and user.
2. Set `MONGODB_URI` in Vercel project env variables.
3. Add all auth/stripe/email env vars in Vercel.
4. Deploy from `main` branch.
5. Configure Stripe webhook URL to `https://your-domain/api/stripe/webhook`.

## Architecture Notes
- Multi-tenant via `workspaceId` on domain models
- Server-side RBAC guard (`requireMembership`) on all domain actions
- Audit logs for write actions
- In-memory rate limiting on sensitive actions (login/register/invite)
- Local uploads in dev with metadata persisted in Mongo; replace adapter for S3/R2 in prod

## Commands
```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
npm run seed
```


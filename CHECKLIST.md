# ClientPilot Implementation Checklist

## Core
- [x] Next.js App Router + strict TypeScript
- [x] TailwindCSS + reusable UI primitives
- [x] MongoDB + Mongoose models for required collections
- [x] Multi-tenant `workspaceId` scoping across domain data
- [x] RBAC roles: owner/admin/member/viewer with server-side enforcement

## Marketing
- [x] `/[locale]` landing page
- [x] `/[locale]/pricing`
- [x] `/[locale]/privacy`
- [x] `/[locale]/terms`
- [x] Light/dark mode toggle
- [x] Locale switch (`en`/`fa`) and RTL/LTR direction switch

## Auth + Onboarding
- [x] Credentials auth (email/password)
- [x] Google OAuth provider wiring
- [x] Register API + sign-in page
- [x] Workspace creation onboarding flow
- [x] Invite by email + invite acceptance endpoint

## App Pages
- [x] `/[locale]/app` overview with KPIs + chart + recent activity
- [x] `/[locale]/app/clients` CRUD (create + list)
- [x] `/[locale]/app/projects` CRUD (create + list)
- [x] `/[locale]/app/projects/[id]` overview + files + tabs placeholder
- [x] `/[locale]/app/tasks` Kanban columns + create
- [x] `/[locale]/app/time` create/list with overlap validation
- [x] `/[locale]/app/invoices` create/list/mark-paid/PDF/email
- [x] `/[locale]/app/reports`
- [x] `/[locale]/app/team`
- [x] `/[locale]/app/settings`
- [x] `/[locale]/app/billing` + Stripe checkout trigger

## Billing + Invoicing
- [x] Stripe checkout session endpoint
- [x] Stripe webhook signature verification
- [x] Subscription upsert/update from webhook events
- [x] Invoice numbering, totals, statuses
- [x] Generate invoice PDF server-side
- [x] Email invoice to client
- [x] Overdue cron endpoint
- [x] Create invoice from selected time entries action

## Files + Search + Audit
- [x] Upload endpoint + local storage adapter
- [x] Project file metadata persistence
- [x] Global search endpoint and topbar search UI
- [x] Audit log model + write-action logging

## Quality
- [x] Vitest setup + unit test
- [x] Playwright setup + e2e smoke test
- [x] Docker Compose for MongoDB
- [x] Seed script for demo data
- [x] `.env.example` documented
- [x] README with setup/test/build/deploy flow

## Notes
- [ ] S3/R2 adapter implementation is left as production adapter extension point (`src/lib/storage/local.ts` currently local disk).
- [ ] Advanced feature completeness (full kanban drag-drop, recurring invoices, full billing portal resume/cancel) is scaffolded minimally.


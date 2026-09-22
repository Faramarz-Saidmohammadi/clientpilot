# ClientPilot

ClientPilot is a multi-tenant workspace for managing client relationships, projects, tasks, time, invoices, team access, reporting, and subscription billing from one application.

## Product Capabilities

- Client CRM with contacts and notes
- Project and task management
- Time tracking with billable utilization reporting
- Invoice creation, PDF delivery, email delivery, and payment status workflows
- Workspace-scoped dashboard analytics and six-month revenue trends
- Team membership with role-based access control
- Stripe subscription billing and webhook synchronization
- Audit logging for important workspace actions
- English and Dari interfaces with LTR/RTL support
- Responsive light and dark themes

## Technology Stack

### Application

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Lucide icons
- Recharts
- TanStack Table

### Backend and Data

- MongoDB
- Mongoose
- Server Actions and route handlers
- Zod validation

### Authentication and Integrations

- NextAuth with credentials and Google sign-in
- Stripe Checkout and webhooks
- Resend transactional email

### Quality

- ESLint
- Vitest
- Playwright
- GitHub Actions
- Production dependency auditing

## Architecture

ClientPilot isolates application data by workspace. Domain records carry a `workspaceId`, and server-side membership guards resolve the authenticated user's active workspace before protected actions execute.

Key boundaries include:

- **Authentication:** session and provider configuration under `src/lib/auth`
- **Authorization:** role hierarchy and workspace membership checks under `src/lib/auth/rbac.ts`
- **Workspace context:** shared tenant resolution under `src/lib/workspace.ts`
- **Domain actions:** server-side operations under `src/actions`
- **Persistence:** Mongoose models under `src/models`
- **Billing:** Stripe integration under `src/lib/billing` and `/api/stripe/*`
- **Transactional email:** Resend-based delivery under `src/lib/email`
- **Internationalization:** localized English and Dari message catalogs with RTL direction for Dari

The dashboard and reports use workspace-scoped database aggregates rather than hard-coded portfolio metrics.

## Local Development

### Prerequisites

- Node.js 22 or newer
- npm
- MongoDB, locally or remotely

### Setup

```bash
npm install
cp .env.example .env.local
docker compose up -d
npm run seed
npm run dev
```

Open `http://localhost:3000/en` for English or `http://localhost:3000/fa` for Dari.

The seed script creates local demonstration data for development. Review `scripts/seed.ts` before using it against any non-local database.

## Environment Configuration

Use `.env.example` as the reference. Configure real credentials outside version control.

Core groups include:

- MongoDB connection
- authentication secret, public application URL, and optional Google OAuth credentials
- independent secrets for signed invoice links and scheduled-job authentication
- Stripe secret, price IDs, and webhook secret
- Resend API key and verified sender address

Never commit production credentials or populated environment files.

The database name is taken from `MONGODB_URI`; use distinct database names for development, CI, staging, and production.

## Testing and Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Playwright starts the application automatically and validates the public conversion path in English as well as RTL rendering in Dari.

GitHub Actions runs the same quality categories on pull requests: lint, unit tests, production build, production dependency audit, and browser-level E2E verification with MongoDB.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm test
npm run test:watch
npm run test:e2e
npm run seed
```

## Deployment Notes

ClientPilot can run on a Node-compatible deployment platform with MongoDB and the required environment variables configured. Before production use:

1. Configure a production MongoDB database and restricted database user.
2. Set authentication, Google OAuth, Stripe, and email credentials in the deployment environment.
3. Configure the public authentication URL for the production domain.
4. Register the production Stripe webhook endpoint.
5. Use durable object storage instead of the development-oriented local upload adapter where required by the hosting environment.
6. Run the full CI-equivalent verification suite before release.

## Security

Security-sensitive changes should preserve tenant isolation, authorization checks, input validation, webhook verification, signed external invoice links, authenticated scheduled jobs, and secret handling. Project files are limited to approved types and 5 MB. See `SECURITY.md` for reporting guidance and review expectations.

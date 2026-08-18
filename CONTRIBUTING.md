# Contributing

## Development Workflow

1. Create a focused branch from the default branch.
2. Keep each change limited to one coherent engineering goal.
3. Preserve workspace isolation and authorization boundaries.
4. Update tests and documentation when behavior changes.
5. Run the relevant verification commands before opening or updating a pull request.

## Required Checks

```bash
npm ci
npm run lint
npm test
npm run build
npm audit --omit=dev --audit-level=high
npm run test:e2e
```

## Review Checklist

Reviewers should pay particular attention to:

- tenant-scoped queries and aggregates
- role and membership checks
- authentication and session behavior
- validation of user-controlled input
- Stripe webhook and billing changes
- transactional email behavior
- upload and file access controls
- internationalization and RTL behavior
- accessibility and responsive behavior
- dependency and deployment risk

## Repository Hygiene

Do not commit credentials, populated environment files, production data, browser session exports, generated reports, build output, or temporary debugging artifacts.

Use concise commit messages that describe the engineering intent. Pull requests should explain what changed, why it changed, how it was verified, and any deployment or migration implications.

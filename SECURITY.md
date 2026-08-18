# Security Policy

## Reporting a Vulnerability

Do not publish exploitable security findings in a public issue. Report them privately to the repository owner with enough detail to reproduce and evaluate the impact.

Useful reports include:

- affected route, action, component, or dependency
- reproduction steps
- expected and observed behavior
- potential impact
- suggested remediation when known

## Security-Critical Areas

Changes in these areas require additional review:

- authentication and session handling
- workspace membership and role-based authorization
- tenant-scoped database queries
- invitations and onboarding
- Stripe checkout and webhook verification
- invoice and transactional email delivery
- file uploads and access controls
- server actions and user-controlled filters
- secrets and deployment configuration
- dependency updates affecting authentication, database, billing, or routing behavior

## Tenant Isolation

Protected operations must derive workspace context from the authenticated membership and must not trust a client-supplied workspace identifier as an authorization boundary.

Database reads, writes, aggregates, and searches that operate on tenant data should include the resolved workspace scope.

## Secret Handling

Never commit passwords, API keys, OAuth secrets, Stripe secrets, database credentials, populated environment files, session exports, or production user data.

Use `.env.example` only for sanitized variable names and development-safe placeholders.

## Supported Version

Security maintenance targets the current default branch unless a separate supported release line is explicitly documented.

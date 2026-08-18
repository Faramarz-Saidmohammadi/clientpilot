## Summary

Describe the problem being solved and the approach taken.

## Verification

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm audit --omit=dev --audit-level=high`
- [ ] `npm run test:e2e` when user-facing behavior or routing changes

## Engineering Review

- [ ] Workspace-scoped reads and writes preserve tenant isolation
- [ ] Authentication and authorization behavior is unchanged or intentionally documented
- [ ] User-controlled input is validated
- [ ] Billing, webhook, email, and upload changes have been reviewed for security implications
- [ ] English/Dari and LTR/RTL behavior has been considered for UI changes
- [ ] Responsive and accessibility behavior has been considered
- [ ] No credentials, session data, production data, or temporary debugging artifacts are included
- [ ] Documentation reflects any configuration or behavior changes

## Deployment Notes

Document environment, migration, dependency, webhook, or rollout considerations when applicable.

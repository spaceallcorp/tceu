# Change Management & Traceability

This document defines how production changes to this repository are recorded so
the process is auditable against **ISO/IEC 27001:2022** and **ISO 9001:2015**.

## Principles

1. Every production change has a **change request issue** (or an **incident** that
   leads to one).
2. Code reaches `prod` only through a **pull request** with review.
3. CI proves the build; a **post-deploy smoke test** proves the change is live.
4. Evidence (issue, PR, commit, CI run, deploy result) is retained.
5. Changes are reversible: every change documents a **rollback**.
6. Implementer and approver are different people.

## Lifecycle

```
Issue (change_request.yml / incident.yml)
      │  approved by a reviewer
      ▼
Branch ──► Pull Request (PULL_REQUEST_TEMPLATE.md, "Closes #<n>")
      │  required status checks (build + smoke test)
      ▼
Merge to prod ──► GitHub Actions deploy (environment: production)
      │  deploy evidence comment posted on the linked issue
      ▼
Release tag + issue closed as completed
```

## Identity of records

| Artifact | Purpose | ISO mapping |
|---|---|---|
| Issue (`CHG:` / `INC:`) | Change request, risk, rollback, approval | 27001 A.8.32; 9001 8.5.6 |
| Pull request | Review, authorization, diff | 27001 A.8.32; 9001 8.5.6 |
| Commit SHA | Immutable implementation record | 27001 A.8.32 |
| Actions run | Build + test + deploy evidence | 27001 A.8.15, A.8.16; 9001 8.5.1 |
| Deploy evidence comment | Run URL, SHA, time, result on the issue | 27001 A.8.16 |
| Release tag | Version deployed to production | 27001 A.8.32; 9001 7.5 |
| Nonconformity issue | Incident and corrective action | 9001 8.7, 10.2 |

## How to reference a change

In a commit message or PR body use:

```
Closes #12
Fixes #12
Refs #12
```

The deploy workflow posts a comment with the run URL and commit SHA on every
referenced issue.

## Branch protection for `prod` (configure in repository settings)

Repository → Settings → Branches → Add branch protection rule for `prod`:

- [x] Require a pull request before merging
- [x] Require approvals: **1** (dismiss stale approvals on new commits)
- [x] Require status checks to pass before merging
- [x] Require conversation resolution
- [x] Do not allow bypassing the above settings
- [x] Restrict force pushes
- [x] Restrict deletions

Equivalent API call (requires admin token):

```bash
curl -X PUT \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/spaceallcorp/tceu/branches/prod/protection \
  -d '{
    "required_status_checks": { "strict": true, "contexts": ["build-and-deploy"] },
    "enforce_admins": true,
    "required_pull_request_reviews": { "required_approving_review_count": 1, "dismiss_stale_reviews": true },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false
  }'
```

> Enabling "Require a pull request" changes the current workflow: direct pushes
> to `prod` stop deploying. That is intentional for ISO conformity and must be
> agreed with the team before enabling.

## Deployment authorization (environment)

Repository → Settings → Environments → `production`:

- [x] Required reviewers (at least 1)
- [x] Prevent self-review
- [ ] (optional) Deployment branches: only `prod`

The workflow associates the deploy job with `environment: production`, so an
approval is required before each production deployment once this is enabled.

## Retention

- Keep issues and pull requests **open/closed indefinitely** (do not delete).
- Keep Actions logs/artifacts for the period defined in the ISMS (commonly
  12–36 months). Settings → Actions → General → Artifact and log retention.
- Export the organization audit log periodically if required by the ISMS.
- Tag each production deploy, e.g. `v2026.11.24-8088d4a`.

## Access and secrets

- The repository is public: **never** put secrets in issues, PRs, commits or
  workflow logs.
- Use least-privilege tokens; rotate long-lived personal access tokens.
- Enable 2FA, secret scanning and Dependabot alerts.

## Related documents

- `ISSUE_BLANK_SITE_AFTER_DEPLOY.md` — incident record for INC-2026-11-23.

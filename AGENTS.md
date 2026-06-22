# AGENTS.md

## Authority

You are assisting Joshua J. Karpilo on a Karpilo Endeavor Technologies LLC project.

This file governs work in the `karpilo-loadiq-website` repository. Read it before changing code. Repository evidence overrides assumptions. If business intent is not defined in the repo or by Joshua, state the gap instead of inventing it.

Operate as an engineering auditor, systems architect, technical reviewer, and implementation assistant.

## KET Architecture Baseline

Keep these concepts separate:

- Product: something users interact with, license, purchase, or operate.
- Governance state: authority, validation, rollout safety, operational oversight, support demand, infrastructure protection, and AI governance.
- Rollout phase: adoption pacing for infrastructure, cost, AI cost, staffing, support, and operational stability.
- Commercial subscription tier: monetization. Current defined tiers are Silver, Gold, Platinum, and Pro.
- Product entitlement: a permission or capability. Entitlements do not define pricing, governance, or rollout state.

Pilot Access, Launch Phase 1, and Launch Phase 2 are rollout/enrollment phases, not commercial tier names. Do not collapse rollout phase into billing tier.

If code mixes product, governance, rollout, tier, or entitlement concepts, identify the coupling, explain the risk, explain alternatives, and do not assume business intent.

## Repository Scope

This repository is the public LoadIQ website, not the LoadIQ application.

LoadIQ is a transportation profitability intelligence platform. Its public website may explain the product, capture interest, route users, and support marketing or education flows. It must not become the operational application, billing authority, dispatch system, broker workflow, ELD, tax advisor, legal advisor, compliance authority, or guaranteed-profit system.

`app.karpilo-liq.com` is the web account-access portal for profile, settings, billing, Fit Check, access/request status, and related account-side flows. Its `/portal` routes are bridge routes only. The website should link to that account bridge when an action belongs to account access, but must not treat the bridge as website-owned business logic or as the limiting definition of the full LoadIQ app project.

The LoadIQ app project includes protected product application work and future Apple App Store / Google Play application surfaces. Do not reduce the app project to the website bridge, account portal, billing portal, or public website.

Keep these boundaries explicit:

- Website content can describe LoadIQ capabilities that are already defined.
- Website content must not invent product capabilities, subscription capabilities, or operational promises.
- Acquisition, contact, fit-check, newsletter, analytics, and marketing flows must not duplicate application business logic.
- Public pages must not expose product operations data.
- Reserved or future capabilities must be labeled accurately and kept out of entitlement logic unless explicitly designed.

Atlas may be referenced only as defined KET intelligence architecture. Do not present Atlas as a subscription tier or product replacement.

FleetOS must not be treated as a LoadIQ feature.

## Technical Evidence

Repository evidence at the time this file was written:

- Next.js app using `src/app`.
- `package.json` declares Next.js `16.2.6`, React `19.2.4`, Tailwind CSS 4, Sentry, Supabase, Upstash Redis, PostHog, Resend, Framer Motion, and Lucide.
- Existing surfaces include `src/app`, `src/config`, `src/content`, `src/components`, and `src/lib`.
- README is still a default create-next-app README, so do not treat it as product authority.

Do not rely on older Next.js assumptions. For version-sensitive framework behavior, inspect the local Next.js documentation in `node_modules/next/dist/docs/` or the local package source before changing APIs, routing, metadata, middleware/proxy behavior, server actions, or config.

## Development Workflow

Before implementation:

- Inspect affected routes, config, content, components, and integrations.
- Identify affected product claims, governance implications, rollout language, commercial tiers, entitlements, analytics, contact flows, and operational risk.
- Separate repository evidence from assumptions.
- Explain findings, risks, and alternatives before making significant architectural changes.

During implementation:

- Prefer small correct changes over broad rewrites.
- Preserve working systems.
- Use existing config/content structures before creating new ones.
- Keep public claims centralized when the repo provides a config layer.
- Do not create duplicate analytics, contact, or fit-check systems.
- Do not weaken privacy, consent, or server/client boundaries.

Permanent repo-safety rules:

- Before making code changes, always check the current branch and working tree status. Do not work on main. Create or switch to a dedicated task branch before editing. If the working tree is dirty, stop and report the existing changes before proceeding. Do not commit or deploy unless explicitly instructed.
- Never replace the existing app experience with a temporary portal, bridge page, launch gate, or controlled-access shell. Temporary access surfaces must be isolated and must not remove calculator, dashboard, settings, billing, saved loads, Fit Check, or core application routes.
- Preserve existing product pillars unless explicitly instructed. Do not remove, rename, deprecate, or replace calculator, mileage, fuel, billing, settings, saved loads, Supabase, Stripe, Sentry, PostHog, auth, dashboard, pricing, or app routing logic without explicit approval.

After implementation, validate when possible:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Never claim validation passed if it was not executed.

## Data, Secrets, And Integrations

- Do not commit real `.env` values.
- Keep service-only credentials server-side.
- Do not expose private Supabase, Sentry, PostHog, Redis, or Resend credentials to client code.
- Treat contact, interest, fit-check, and analytics data as sensitive visitor data.
- Do not put LoadIQ operational data in website-only storage.

## Reporting Standard

When reporting work, state what was inspected, what changed, what was validated, what was not validated, and what assumptions remain. Do not say a UI works unless it was verified in the rendered app.

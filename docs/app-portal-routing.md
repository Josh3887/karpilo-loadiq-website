# LoadIQ Website And App Portal Routing

## Boundary

`karpilo-liq.com` is the public Karpilo LoadIQ marketing website. It explains the product, launch phases, pricing language, trust boundaries, and controlled access status.

`app.karpilo-liq.com` is the authenticated app portal. It owns login, request-access status, billing status, settings, Fit Check, and protected product workflows.

The website must not duplicate app business logic, billing authority, entitlement logic, operational data, dispatch workflows, calculator internals, reports, maps, AI insights, admin tools, Sentry, or PostHog as customer-facing features.

## Canonical App Links

The website centralizes app routing in `src/config/loadiq.ts`:

- `LOADIQ_URLS.appLogin` -> `https://app.karpilo-liq.com/login`
- `LOADIQ_URLS.appRequestAccess` -> `https://app.karpilo-liq.com/request-access`
- `LOADIQ_URLS.appPortal` -> `https://app.karpilo-liq.com/portal`
- `LOADIQ_URLS.appBilling` -> `https://app.karpilo-liq.com/portal/billing`
- `LOADIQ_URLS.appSettings` -> `https://app.karpilo-liq.com/portal/settings`
- `LOADIQ_URLS.appFitCheck` -> `https://app.karpilo-liq.com/portal/fit-check`

Public website CTAs should use these URLs instead of internal website signup routes when the action belongs to the app.

## Controlled Launch Copy

Use clear controlled-launch language:

Public signup is not available at this time. Karpilo LoadIQ is preparing controlled access for beta, legacy, and founding operator launch phases.

Pricing pages may describe Silver, Gold, Platinum, and Pro as commercial plan keys, but the website must remain informational unless checkout is safely enabled in the app.

## Product Claims

Do not describe Karpilo LoadIQ as a dispatch tool, broker, carrier, ELD, tax advisor, legal advisor, compliance service, insurance advisor, or guaranteed-profit system.

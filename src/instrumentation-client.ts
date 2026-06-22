import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

import {
  getSentryEnvironment,
  getSentryRelease,
  getSentryReplayOnErrorSampleRate,
  getSentryReplaySessionSampleRate,
  getSentryTraceSampleRate,
  sentryBeforeSend,
} from "@/lib/sentry-config";

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn,
  enabled: Boolean(sentryDsn),
  environment: getSentryEnvironment(),
  release: getSentryRelease(),
  sendDefaultPii: false,
  beforeSend: sentryBeforeSend,
  tracesSampleRate: getSentryTraceSampleRate(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
  ),
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: getSentryReplaySessionSampleRate(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
  ),
  replaysOnErrorSampleRate: sentryDsn
    ? getSentryReplayOnErrorSampleRate(
        process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE
      )
    : 0,
  initialScope: {
    tags: {
      product: "loadiq_website",
    },
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

const posthogProjectToken =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (
  process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true" &&
  posthogProjectToken
) {
  posthog.init(posthogProjectToken, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-01-30",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: process.env.NEXT_PUBLIC_POSTHOG_AUTOCAPTURE === "true",
    disable_session_recording:
      process.env.NEXT_PUBLIC_POSTHOG_SESSION_REPLAY !== "true",
  });
}

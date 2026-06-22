"use client";

import { SentryRouteError } from "@/components/observability/sentry-route-error";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SentryRouteError
      error={error}
      reset={reset}
      boundary="website-app"
      title="This page did not load."
      message="Retry the page. Public website content, pricing, signup, and support routes remain unchanged."
    />
  );
}

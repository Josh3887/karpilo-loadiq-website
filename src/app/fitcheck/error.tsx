"use client";

import { SentryRouteError } from "@/components/observability/sentry-route-error";

export default function FitCheckError({
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
      boundary="website-fitcheck"
      feature="fitcheck"
      title="Fit Check page did not load."
      message="Retry the page. Website Fit Check remains a lightweight public intake surface."
    />
  );
}

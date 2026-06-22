"use client";

import { SentryRouteError } from "@/components/observability/sentry-route-error";

export default function BillingError({
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
      boundary="website-billing"
      feature="billing"
      title="Billing page did not load."
      message="Retry the page. Billing copy and subscription terms were not changed by this boundary."
    />
  );
}

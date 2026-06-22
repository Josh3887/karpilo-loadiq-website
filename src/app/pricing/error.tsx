"use client";

import { SentryRouteError } from "@/components/observability/sentry-route-error";

export default function PricingError({
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
      boundary="website-pricing"
      feature="billing"
      title="Pricing page did not load."
      message="Retry the page. Pricing data and signup routing remain unchanged."
    />
  );
}

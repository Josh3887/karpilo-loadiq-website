"use client";

import { SentryRouteError } from "@/components/observability/sentry-route-error";

export default function SignupError({
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
      boundary="website-signup"
      feature="auth"
      title="Signup page did not load."
      message="Retry the page. Public signup routing and app access rules remain unchanged."
    />
  );
}

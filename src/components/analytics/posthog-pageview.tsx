"use client";

import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function isPostHogEnabled() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true" &&
    Boolean(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
        process.env.NEXT_PUBLIC_POSTHOG_KEY,
    )
  );
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPostHogEnabled()) return;

    const queryString = searchParams.toString();
    const currentUrl = `${window.location.origin}${pathname}${
      queryString ? `?${queryString}` : ""
    }`;

    posthog.capture("$pageview", {
      $current_url: currentUrl,
    });
  }, [pathname, searchParams]);

  return null;
}

import "server-only";

import { PostHog } from "posthog-node";

export type PostHogServerEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

function getPostHogProjectToken() {
  return (
    process.env.POSTHOG_PROJECT_TOKEN ??
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  );
}

export function createPostHogServerClient() {
  const isEnabled =
    process.env.POSTHOG_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true";
  const projectToken = getPostHogProjectToken();

  if (!isEnabled || !projectToken) return null;

  return new PostHog(projectToken, {
    host:
      process.env.POSTHOG_HOST ??
      process.env.NEXT_PUBLIC_POSTHOG_HOST ??
      "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function capturePostHogServerEvent(event: PostHogServerEvent) {
  const posthog = createPostHogServerClient();

  if (!posthog) return;

  try {
    posthog.capture(event);
  } finally {
    await posthog.shutdown();
  }
}

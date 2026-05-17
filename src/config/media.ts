export type VideoMedia = {
  title: string;
  description: string;
  src: string;
  poster: string;
  caption: string;
};

export const MEDIA = {
  demoWalkthrough: {
    title: "Video walkthrough",
    description:
      "Watch a guided walkthrough of Karpilo LoadIQ and see how operators can estimate profitability, evaluate freight assumptions, and manage operational inputs before making independent load decisions.",
    src: "/media/demo/loadiq-demo-walkthrough-v1.mp4",
    poster: "/media/demo/loadiq-demo-poster-v1.jpg",
    caption:
      "Instructional demo video. The interactive calculator below remains available for hands-on testing.",
  },
  futureVideos: {
    dashboardTour: "/media/demo/loadiq-dashboard-tour-v1.mp4",
    onboardingGuide: "/media/demo/loadiq-onboarding-guide-v1.mp4",
    profitabilityDemo: "/media/demo/loadiq-profitability-demo-v1.mp4",
  },
} as const satisfies {
  demoWalkthrough: VideoMedia;
  futureVideos: Record<string, string>;
};

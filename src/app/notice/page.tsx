import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

import LegalDocumentPage from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Notice | Karpilo LoadIQ",
  description:
    "Proprietary notice for Karpilo LoadIQ, Karpilo Endeavor Technologies LLC, and related website materials.",
};

export default function NoticePage() {
  const content = readFileSync(join(process.cwd(), "NOTICE"), "utf8");

  return (
    <LegalDocumentPage
      eyebrow="Notice"
      title="Karpilo LoadIQ Notice"
      description="This page publishes the proprietary notice for the public website, product concepts, visual systems, and related LoadIQ materials."
      content={content}
    />
  );
}

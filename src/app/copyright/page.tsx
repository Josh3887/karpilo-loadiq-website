import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

import LegalDocumentPage from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Copyright | Karpilo LoadIQ",
  description:
    "Copyright notice for Karpilo LoadIQ and Karpilo Endeavor Technologies LLC website materials.",
};

export default function CopyrightPage() {
  const content = readFileSync(join(process.cwd(), "COPYRIGHT"), "utf8");

  return (
    <LegalDocumentPage
      eyebrow="Copyright"
      title="Karpilo LoadIQ Copyright"
      description="This page publishes the repository copyright notice for the public website and related Karpilo LoadIQ materials."
      content={content}
      tone="red"
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalContent } from "@/components/legal/legal-content";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { legalPages } from "@/config/legal";

type LegalDynamicPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LegalDynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];

  if (!page) {
    return {
      title: "Legal Policy | Karpilo Endeavor Technologies",
    };
  }

  return {
    title: `${page.title} | Karpilo Endeavor Technologies`,
    description: page.description,
  };
}

export default async function LegalDynamicPage({ params }: LegalDynamicPageProps) {
  const { slug } = await params;
  const page = legalPages[slug];

  if (!page) notFound();

  return (
    <LegalPageShell title={page.title} description={page.description}>
      <LegalContent sections={page.sections} />
    </LegalPageShell>
  );
}

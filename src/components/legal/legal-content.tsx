import { ExternalLink, ShieldCheck } from "lucide-react";

import type { LegalSection } from "@/config/legal";

type LegalContentProps = {
  sections: LegalSection[];
};

export function LegalContent({ sections }: LegalContentProps) {
  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="rounded-2xl border border-white/10 bg-[#0B1120]/85 p-5 shadow-[0_0_34px_rgba(56,189,248,0.06)] sm:p-7"
        >
          <div className="flex gap-4">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10 text-sky-300 sm:flex">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              {section.eyebrow ? (
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-red-300">
                  {section.eyebrow}
                </p>
              ) : null}

              <h2 className="text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {section.bullets ? (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-300"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.links ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {section.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/15"
                    >
                      {link.label}
                      {link.external ? (
                        <>
                          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                          <span className="sr-only">opens in a new tab</span>
                        </>
                      ) : null}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

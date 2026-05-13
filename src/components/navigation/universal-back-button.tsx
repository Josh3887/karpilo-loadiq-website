"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function UniversalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 transition hover:border-sky-300/30 hover:text-sky-200"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}

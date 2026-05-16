import { AlertTriangle } from "lucide-react";

import { DEVELOPMENT_READINESS_NOTICE } from "@/config/rollout";

export function DevelopmentReadinessBanner() {
  return (
    <div className="border-b border-sky-300/20 bg-[#06111f] px-6 py-3 text-slate-200">
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
        <p className="text-sm leading-6">
          <span className="font-black text-sky-100">
            {DEVELOPMENT_READINESS_NOTICE.title}
          </span>{" "}
          {DEVELOPMENT_READINESS_NOTICE.paymentNote}
        </p>
      </div>
    </div>
  );
}

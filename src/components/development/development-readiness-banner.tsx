import { AlertTriangle } from "lucide-react";

import { DEVELOPMENT_READINESS_NOTICE } from "@/config/rollout";

export function DevelopmentReadinessBanner() {
  return (
    <div className="border-t border-sky-300/10 bg-[#06111f] px-4 py-2 text-slate-200 sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-7xl items-start gap-2 sm:gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300 sm:h-5 sm:w-5" />
        <p className="text-xs leading-5 sm:text-sm sm:leading-6">
          <span className="font-black text-sky-100">
            {DEVELOPMENT_READINESS_NOTICE.title}
          </span>{" "}
          {DEVELOPMENT_READINESS_NOTICE.paymentNote}
        </p>
      </div>
    </div>
  );
}

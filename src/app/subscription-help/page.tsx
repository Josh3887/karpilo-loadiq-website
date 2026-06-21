import { redirect } from "next/navigation";

import { LOADIQ_ROUTES } from "@/config/loadiq";

export const metadata = {
  title: "Website Billing | Karpilo LoadIQ",
  description:
    "Karpilo LoadIQ subscription help is handled through the canonical website billing page.",
};

export default function SubscriptionHelpPage() {
  redirect(LOADIQ_ROUTES.billing);
}

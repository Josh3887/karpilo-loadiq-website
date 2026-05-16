import { WebsiteBillingPanel } from "@/components/account/website-access-panels";

export const metadata = {
  title: "Manage Billing | Karpilo LoadIQ",
  description:
    "Review Karpilo LoadIQ account readiness, subscription help, trial context, and billing support.",
};

export default function BillingPage() {
  return <WebsiteBillingPanel />;
}

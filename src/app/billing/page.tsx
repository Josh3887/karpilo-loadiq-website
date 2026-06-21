import { WebsiteBillingPanel } from "@/components/account/website-access-panels";

export const metadata = {
  title: "Website Billing | Karpilo LoadIQ",
  description:
    "Website and Stripe billing guidance for Karpilo LoadIQ, with Apple App Store and Google Play billing delegated to their app stores.",
};

export default function BillingPage() {
  return <WebsiteBillingPanel />;
}

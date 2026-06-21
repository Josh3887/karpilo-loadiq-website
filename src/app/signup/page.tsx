import { WebsiteSignupPanel } from "@/components/account/website-access-panels";

export const metadata = {
  title: "Controlled Access | Karpilo LoadIQ",
  description:
    "Public signup is not currently available. Request controlled Karpilo LoadIQ launch access or open the app portal if access has already been issued.",
};

export default function SignupPage() {
  return <WebsiteSignupPanel />;
}

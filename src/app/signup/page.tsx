import { WebsiteSignupPanel } from "@/components/account/website-access-panels";

export const metadata = {
  title: "Signup | Karpilo LoadIQ",
  description: "Create Karpilo LoadIQ website access with shared Supabase identity.",
};

export default function SignupPage() {
  return <WebsiteSignupPanel />;
}

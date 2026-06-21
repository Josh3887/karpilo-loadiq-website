import { redirect } from "next/navigation";

import { LOADIQ_ROUTES } from "@/config/loadiq";

export const metadata = {
  title: "Controlled Access | Karpilo LoadIQ",
  description:
    "Public signup is not currently available. Request controlled Karpilo LoadIQ launch access or open the app portal if access has already been issued.",
};

export default function SignupPage() {
  redirect(LOADIQ_ROUTES.launch);
}

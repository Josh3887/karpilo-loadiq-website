import { redirect } from "next/navigation";

import { LOADIQ_URLS } from "@/config/loadiq";

export const metadata = {
  title: "App Portal | Karpilo LoadIQ",
  description: "Karpilo LoadIQ app access is handled through the app portal.",
};

export default function LoginPage() {
  redirect(LOADIQ_URLS.app);
}

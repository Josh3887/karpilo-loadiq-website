import { redirect } from "next/navigation";

import { LOADIQ_URLS } from "@/config/loadiq";

export const metadata = {
  title: "App Portal | Karpilo LoadIQ",
  description: "Karpilo LoadIQ account settings are handled through the app portal.",
};

export default function AccountSettingsPage() {
  redirect(LOADIQ_URLS.appSettings);
}

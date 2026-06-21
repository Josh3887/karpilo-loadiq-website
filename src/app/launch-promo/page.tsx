import { redirect } from "next/navigation";

import { LOADIQ_ROUTES } from "@/config/loadiq";

export default function Page() {
  redirect(LOADIQ_ROUTES.launch);
}

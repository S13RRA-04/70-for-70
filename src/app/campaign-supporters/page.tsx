import { redirect } from "next/navigation";

/** Campaign supporters now live on the canonical /partners page — see src/app/partners/page.tsx. */
export default function CampaignSupportersPage() {
  redirect("/partners#supporters");
}

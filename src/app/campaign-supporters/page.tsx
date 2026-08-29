import { redirect } from "next/navigation";

/** Campaign supporters now live on the canonical /sponsors page — see src/app/sponsors/page.tsx. */
export default function CampaignSupportersPage() {
  redirect("/sponsors");
}

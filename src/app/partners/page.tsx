import { redirect } from "next/navigation";

/** Retired — split into src/app/beneficiaries/page.tsx (nonprofit fundraising recipients) and src/app/sponsors/page.tsx (gear/resource campaign sponsors). */
export default function PartnersPage() {
  redirect("/beneficiaries");
}

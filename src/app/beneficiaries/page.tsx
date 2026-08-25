import { redirect } from "next/navigation";

/** Beneficiaries now live on the canonical /partners page — see src/app/partners/page.tsx. */
export default function BeneficiariesPage() {
  redirect("/partners#beneficiaries");
}

import { redirect } from "next/navigation";

/**
 * Retired — beneficiaries, mission partners, and commercial sponsors used
 * to be conflated on this one page under "Partners" framing. Beneficiaries
 * now live at /beneficiaries; sponsorship intake is closed pending written
 * federal ethics approval. Content/logic preserved in git history, not
 * deleted.
 */
export default function PartnersPage() {
  redirect("/beneficiaries");
}

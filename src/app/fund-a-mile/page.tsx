import { redirect } from "next/navigation";

/** Retired — donations support the overall $70,000 goal, not individual miles. See src/app/donate/page.tsx. */
export default function FundAMilePage() {
  redirect("/donate");
}

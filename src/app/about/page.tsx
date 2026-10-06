import { redirect } from "next/navigation";

/** Retired — folded into src/app/mission/page.tsx's "Founder's Story" section. */
export default function AboutPage() {
  redirect("/mission#founders-story");
}

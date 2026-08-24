import { redirect } from "next/navigation";

/**
 * Retired — For The 22 is not an athletic team or athlete-affiliation
 * program; public athlete recruitment/onboarding is closed pending written
 * federal ethics approval. Content preserved in git history and in
 * src/lib/content/athletes.ts.
 */
export default function AthletesPage() {
  redirect("/mission");
}

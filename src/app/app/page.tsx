import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOptionalParticipant } from "@/lib/supabase/require-participant";

/**
 * app.forthe22.org's root. Signed-in participants go straight to their
 * dashboard; everyone else sees the first-run welcome screen (spec section
 * 5) rather than a marketing page — this app is reached only by someone
 * who already knows what it is (linked from the registration flow, or
 * installed).
 */
export default async function AppRootPage() {
  const user = await getOptionalParticipant();
  if (user) redirect("/app/home");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Image src="/logo.png" alt="For the 22" width={96} height={96} className="h-24 w-24" />
      <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-tight text-ink">Welcome to For the 22</h1>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-charcoal-light">
        Move with purpose. Track your progress. Carry the mission.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/app/signup"
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Join 22 For the 22
        </Link>
        <Link
          href="/app/signup?next=/app/challenges"
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Explore Challenges
        </Link>
      </div>

      <p className="mt-6 text-sm text-charcoal-light">
        Already have an account?{" "}
        <Link href="/app/login" className="font-semibold text-bronze hover:text-bronze-light">
          Log in
        </Link>
      </p>
    </div>
  );
}

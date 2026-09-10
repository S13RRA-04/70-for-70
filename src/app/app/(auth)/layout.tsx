import Image from "next/image";
import Link from "next/link";

/** Centered card shell for login/signup/reset-password/update-password — no bottom nav, matches a typical mobile auth screen. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Link href="/app" className="mb-8 flex flex-col items-center gap-3">
        <Image src="/logo.png" alt="For the 22" width={64} height={64} className="h-16 w-16" />
        <span className="font-display text-lg font-semibold uppercase tracking-wide text-ink">For the 22</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

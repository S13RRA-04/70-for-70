import type { Metadata } from "next";
import { RegisterServiceWorker } from "@/components/app/register-service-worker";

export const metadata: Metadata = {
  title: { default: "For the 22", template: "%s | For the 22" },
  description: "Move with purpose. Track your progress. Carry the mission.",
};

/**
 * Shared by both the (auth) and (tabs) route groups under here — just
 * registers the service worker so it's active regardless of which one is
 * showing. No visual chrome of its own; see (auth)/layout.tsx and
 * (tabs)/layout.tsx for the actual page shells.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-off-white text-ink">
      <RegisterServiceWorker />
      {children}
    </div>
  );
}

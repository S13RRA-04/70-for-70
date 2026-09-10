import { requireParticipant } from "@/lib/supabase/require-participant";
import { TabNav } from "@/components/app/tab-nav";
import { InstallPrompt } from "@/components/app/install-prompt";

/** Every page in this route group requires a signed-in participant — enforced once here rather than per-page. */
export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  await requireParticipant();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TabNav />
      <div className="flex-1 pb-16 sm:pb-0">{children}</div>
      <InstallPrompt />
    </div>
  );
}

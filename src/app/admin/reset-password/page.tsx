import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Container } from "@/components/shared/container";
import { ResetPasswordForm } from "./reset-password-form";

/**
 * Server Component so isSupabaseConfigured() runs at server request time
 * instead of relying on client-bundle build-time inlining — see the same
 * comment in src/app/admin/login/page.tsx for why that's unreliable here.
 *
 * Deliberately ungated otherwise (no requireAdminUser()) — the recovery
 * session only exists in the browser (Supabase sets it from the URL
 * fragment on page load, same pattern as /admin/login not being gated), so
 * a server-side auth check here would just bounce the visitor before that
 * session is established.
 */
export default function ResetPasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Container className="max-w-md py-20">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Admin</h1>
        <p className="mt-3 text-sm text-charcoal-light">
          Supabase is not configured for this environment.
        </p>
      </Container>
    );
  }

  return <ResetPasswordForm />;
}

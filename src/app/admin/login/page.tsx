import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Container } from "@/components/shared/container";
import { LoginForm } from "./login-form";

/**
 * Server Component so isSupabaseConfigured() runs at server request time
 * (reads the Worker's runtime `vars`), not baked into the client bundle at
 * build time. NEXT_PUBLIC_SUPABASE_ANON_KEY has proven unreliable to inline
 * into client JS in this build pipeline — a client-side check silently read
 * `undefined` for it even when the value was correctly configured, locking
 * out sign-in even though signInAction (a Server Action) never needed the
 * client bundle's value at all.
 */
export default function AdminLoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Container className="max-w-md py-20">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Admin</h1>
        <p className="mt-3 text-sm text-charcoal-light">
          Supabase is not configured for this environment. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable
          admin sign-in.
        </p>
      </Container>
    );
  }

  return <LoginForm />;
}

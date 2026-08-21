"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Container } from "@/components/shared/container";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <Container className="max-w-md py-20">
      <h1 className="font-display text-2xl font-semibold uppercase text-ink">Admin Sign In</h1>
      <p className="mt-2 text-sm text-charcoal-light">
        Restricted to campaign administrators.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </Container>
  );
}

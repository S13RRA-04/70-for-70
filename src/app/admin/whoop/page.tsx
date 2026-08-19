import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { isWhoopConfigured, WHOOP_REDIRECT_URI } from "@/lib/whoop/config";
import { getWhoopConnection } from "@/lib/whoop/tokens";
import { getWhoopProfile } from "@/lib/whoop/client";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { disconnectWhoopAction } from "./actions";

export default async function WhoopAdminPage(props: PageProps<"/admin/whoop">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const configured = isWhoopConfigured();
  const connection = configured ? await getWhoopConnection() : null;

  let profileLabel: string | null = null;
  if (connection) {
    try {
      const profile = await getWhoopProfile(connection.access_token);
      profileLabel = `${profile.firstName} ${profile.lastName} (${profile.email})`;
    } catch {
      profileLabel = null;
    }
  }

  return (
    <Container className="max-w-2xl py-16">
      <Link
        href="/admin"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Overview
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">
        WHOOP Connection
      </h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Connect the athlete&apos;s own WHOOP account to power the public training snapshot on{" "}
        <Link href="/the-race" className="text-bronze hover:underline">
          The Race
        </Link>{" "}
        page. This is a one-time, admin-only connection — it does not collect any data from site
        visitors.
      </p>

      {errorParam && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        {!configured && (
          <div className="text-sm text-charcoal-light">
            <p className="font-semibold text-ink">Not configured.</p>
            <p className="mt-2">
              Set <code className="rounded bg-ink/5 px-1.5 py-0.5">WHOOP_CLIENT_ID</code> and{" "}
              <code className="rounded bg-ink/5 px-1.5 py-0.5">WHOOP_CLIENT_SECRET</code> (from
              the{" "}
              <a
                href="https://developer.whoop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bronze hover:underline"
              >
                WHOOP Developer Dashboard
              </a>
              ) and register this exact redirect URL there:
            </p>
            <p className="mt-2 rounded bg-ink/5 px-3 py-2 font-mono text-xs">{WHOOP_REDIRECT_URI}</p>
          </div>
        )}

        {configured && !connection && (
          <div>
            <p className="text-sm text-charcoal-light">Not connected yet.</p>
            <a
              href="/api/whoop/authorize"
              className="mt-4 inline-flex rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Connect WHOOP Account
            </a>
          </div>
        )}

        {configured && connection && (
          <div>
            <p className="text-sm font-semibold text-olive">Connected</p>
            {profileLabel && <p className="mt-1 text-sm text-ink">{profileLabel}</p>}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="text-charcoal-light">Connected</dt>
                <dd className="text-ink">{formatDateLong(connection.connected_at)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="text-charcoal-light">Token last refreshed</dt>
                <dd className="text-ink">{formatDateLong(connection.updated_at)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="text-charcoal-light">Scopes</dt>
                <dd className="text-ink">{connection.scope}</dd>
              </div>
            </dl>

            <form action={disconnectWhoopAction} className="mt-5">
              <button
                type="submit"
                className="rounded-sm border border-red-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-800 hover:bg-red-50"
              >
                Disconnect
              </button>
            </form>
          </div>
        )}
      </div>
    </Container>
  );
}

import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { isStravaConfigured, STRAVA_REDIRECT_URI } from "@/lib/strava/config";
import { getStravaConnection } from "@/lib/strava/tokens";
import { getStravaAthlete } from "@/lib/strava/client";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { disconnectStravaAction } from "./actions";

export default async function StravaAdminPage(props: PageProps<"/admin/strava">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const configured = isStravaConfigured();
  const connection = configured ? await getStravaConnection() : null;

  let profileLabel: string | null = null;
  if (connection) {
    try {
      const athlete = await getStravaAthlete(connection.access_token);
      profileLabel = `${athlete.firstName} ${athlete.lastName}`.trim();
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
        Strava Connection
      </h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Connect the athlete&apos;s own Strava account to power the public activity feed on{" "}
        <Link href="/journal" className="text-bronze hover:underline">
          the Journal
        </Link>
        . This is a one-time, admin-only connection — it does not collect any data from site
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
              Set <code className="rounded bg-ink/5 px-1.5 py-0.5">STRAVA_CLIENT_ID</code> and{" "}
              <code className="rounded bg-ink/5 px-1.5 py-0.5">STRAVA_CLIENT_SECRET</code> (from{" "}
              <a
                href="https://www.strava.com/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bronze hover:underline"
              >
                My API Application
              </a>{" "}
              in your Strava settings) and register this exact host as the app&apos;s
              &quot;Authorization Callback Domain&quot;:
            </p>
            <p className="mt-2 rounded bg-ink/5 px-3 py-2 font-mono text-xs">
              {new URL(STRAVA_REDIRECT_URI).host}
            </p>
          </div>
        )}

        {configured && !connection && (
          <div>
            <p className="text-sm text-charcoal-light">Not connected yet.</p>
            <a
              href="/api/strava/authorize"
              className="mt-4 inline-flex rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Connect Strava Account
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
                <dd className="text-ink">{connection.scope || "—"}</dd>
              </div>
            </dl>

            <form action={disconnectStravaAction} className="mt-5">
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

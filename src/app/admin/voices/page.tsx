import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import {
  FAILED_DELIVERY_STATUSES,
  OUTREACH_STATUSES,
  OUTREACH_STATUS_LABELS,
  PIPELINE_STAGES,
  SUBMISSION_STATUS_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
  humanize,
  type OutreachStatus,
} from "@/lib/voices/model";
import type {
  VoicesAuditEventRow,
  VoicesOutreachActivityRow,
  VoicesPermissionRow,
  VoicesPublicationRow,
  VoicesSubmissionRow,
  VoicesTalentContactRow,
  VoicesTalentRow,
} from "@/types/voices";
import { BUTTON, BUTTON_SECONDARY, Flash, INPUT, Pill, formatDate, formatDateTime, param } from "./ui";

const VIEWS = [
  { id: "pipeline", label: "Pipeline" },
  { id: "directory", label: "Directory" },
  { id: "submissions", label: "Review queue" },
  { id: "followups", label: "Follow-ups" },
  { id: "delivery", label: "Delivery failures" },
  { id: "permissions", label: "Permissions pending" },
  { id: "calendar", label: "Publication calendar" },
  { id: "published", label: "Published" },
  { id: "activity", label: "Activity" },
] as const;
type View = (typeof VIEWS)[number]["id"];

const CLOSED: OutreachStatus[] = ["declined", "withdrawn", "published"];

function statusTone(status: OutreachStatus) {
  if (status === "published" || status === "approved") return "good" as const;
  if (status === "delivery_failed" || status === "declined" || status === "withdrawn") return "bad" as const;
  if (status === "recording_received" || status === "permissions_pending" || status === "interested") return "warn" as const;
  return "neutral" as const;
}

export default async function VoicesAdminPage(props: PageProps<"/admin/voices">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const view = (VIEWS.find((v) => v.id === param(searchParams, "view"))?.id ?? "pipeline") as View;

  const admin = createAdminClient();
  const [talentRes, contactsRes, activitiesRes, submissionsRes, permissionsRes, publicationsRes, auditRes] = await Promise.all([
    admin.from("voices_talent").select("*").order("name"),
    admin.from("voices_talent_contacts").select("*"),
    admin.from("voices_outreach_activities").select("*").order("occurred_on", { ascending: false }).limit(300),
    admin
      .from("voices_submissions")
      .select("id, reference_code, created_at, submitted_at, review_status, participant_name, submitter_name, relationship, talent_id, embargo_until, suggested_publication_date, video_path, video_link, source")
      .order("created_at", { ascending: false }),
    admin.from("voices_permission_agreements").select("*").order("created_at", { ascending: false }),
    admin.from("voices_publications").select("*").order("publish_at", { ascending: false, nullsFirst: true }),
    admin.from("voices_audit_events").select("*").order("created_at", { ascending: false }).limit(150),
  ]);

  const loadError = [talentRes, contactsRes, submissionsRes, permissionsRes, publicationsRes].find((r) => r.error)?.error;
  const talent = (talentRes.data ?? []) as VoicesTalentRow[];
  const contacts = (contactsRes.data ?? []) as VoicesTalentContactRow[];
  const activities = (activitiesRes.data ?? []) as VoicesOutreachActivityRow[];
  const submissions = (submissionsRes.data ?? []) as Pick<
    VoicesSubmissionRow,
    "id" | "reference_code" | "created_at" | "submitted_at" | "review_status" | "participant_name" | "submitter_name" | "relationship" | "talent_id" | "embargo_until" | "suggested_publication_date" | "video_path" | "video_link" | "source"
  >[];
  const permissions = (permissionsRes.data ?? []) as VoicesPermissionRow[];
  const publications = (publicationsRes.data ?? []) as VoicesPublicationRow[];
  const audit = (auditRes.data ?? []) as VoicesAuditEventRow[];

  const talentById = new Map(talent.map((t) => [t.id, t]));
  const contactsByTalent = new Map<string, VoicesTalentContactRow[]>();
  for (const c of contacts) contactsByTalent.set(c.talent_id, [...(contactsByTalent.get(c.talent_id) ?? []), c]);
  const primaryContact = (id: string) => {
    const list = contactsByTalent.get(id) ?? [];
    return list.find((c) => c.is_primary) ?? list[0];
  };

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nowMs = now.getTime();
  const reviewQueue = submissions.filter((s) => ["received", "under_review", "needs_changes"].includes(s.review_status));
  const incomplete = submissions.filter((s) => s.review_status === "awaiting_upload");
  const followUps = talent.filter((t) => t.follow_up_on && !CLOSED.includes(t.outreach_status)).sort((a, b) => a.follow_up_on!.localeCompare(b.follow_up_on!));

  const counts: Partial<Record<View, number>> = {
    submissions: reviewQueue.length,
    followups: followUps.filter((t) => t.follow_up_on! <= today).length,
    delivery: talent.filter((t) => t.outreach_status === "delivery_failed").length,
    permissions: talent.filter((t) => t.outreach_status === "permissions_pending").length + permissions.filter((p) => p.status === "draft" || p.status === "sent").length,
  };

  const talentLink = (id: string | null) => {
    const t = id ? talentById.get(id) : null;
    return t ? (
      <Link href={`/admin/voices/talent/${t.id}`} className="font-medium text-ink underline-offset-2 hover:underline">
        {t.name}
      </Link>
    ) : (
      <span className="text-charcoal-light">Unlinked</span>
    );
  };

  // ---- Directory filtering ------------------------------------------------
  const q = param(searchParams, "q").toLowerCase();
  const fCategory = param(searchParams, "category");
  const fStatus = param(searchParams, "status");
  const fRep = param(searchParams, "rep").toLowerCase();
  const fOutreachFrom = param(searchParams, "outreach_from");
  const fOutreachTo = param(searchParams, "outreach_to");
  const fFollowFrom = param(searchParams, "follow_from");
  const fFollowTo = param(searchParams, "follow_to");
  const directory = talent.filter((t) => {
    const cs = contactsByTalent.get(t.id) ?? [];
    if (q && ![t.name, t.professional_title, t.internal_notes, ...cs.flatMap((c) => [c.contact_name, c.organization])].some((v) => v?.toLowerCase().includes(q))) return false;
    if (fCategory && t.category !== fCategory) return false;
    if (fStatus && t.outreach_status !== fStatus) return false;
    if (fRep && !cs.some((c) => c.contact_name.toLowerCase().includes(fRep) || c.organization?.toLowerCase().includes(fRep))) return false;
    if (fOutreachFrom && (!t.outreach_on || t.outreach_on < fOutreachFrom)) return false;
    if (fOutreachTo && (!t.outreach_on || t.outreach_on > fOutreachTo)) return false;
    if (fFollowFrom && (!t.follow_up_on || t.follow_up_on < fFollowFrom)) return false;
    if (fFollowTo && (!t.follow_up_on || t.follow_up_on > fFollowTo)) return false;
    return true;
  });
  const exportQuery = new URLSearchParams(
    Object.entries({ q, category: fCategory, status: fStatus, rep: fRep, outreach_from: fOutreachFrom, outreach_to: fOutreachTo, follow_from: fFollowFrom, follow_to: fFollowTo }).filter(([, v]) => v),
  ).toString();

  return (
    <Container className="max-w-7xl py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
            ← Admin overview
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-ink">Voices For The 22 — Talent</h1>
          <p className="mt-1 max-w-2xl text-sm text-charcoal-light">
            Outreach CRM, submission review and permission-gated publishing. Outreach, review, permission and publication
            statuses are tracked separately — nothing here sends email or publishes on its own.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/voices/talent/new" className={BUTTON}>Add talent</Link>
          <Link href="/admin/voices/submissions/new" className={BUTTON_SECONDARY}>Log a recording</Link>
          <a href={`/admin/voices/export${exportQuery ? `?${exportQuery}` : ""}`} className={BUTTON_SECONDARY}>Export CSV</a>
        </div>
      </div>

      <Flash searchParams={searchParams} />
      {loadError && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Couldn&apos;t load Voices data. Has supabase/2026-11-19-voices-talent-portal.sql been applied?
        </p>
      )}

      <nav aria-label="Dashboard views" className="mt-8 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {VIEWS.map((v) => (
          <Link
            key={v.id}
            href={v.id === "pipeline" ? "/admin/voices" : `/admin/voices?view=${v.id}`}
            aria-current={view === v.id ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              view === v.id ? "border-ink bg-ink text-off-white" : "border-ink/20 text-charcoal hover:border-ink/40",
            )}
          >
            {v.label}
            {counts[v.id] ? <span className="rounded-full bg-bronze/20 px-1.5 text-[10px]">{counts[v.id]}</span> : null}
          </Link>
        ))}
      </nav>

      {view === "pipeline" && (
        <div className="mt-6 grid gap-4 overflow-x-auto md:grid-cols-3 xl:grid-cols-6">
          {PIPELINE_STAGES.map((stage) => {
            const items = talent.filter((t) => stage.statuses.includes(t.outreach_status));
            return (
              <section key={stage.label} className="min-w-[220px] rounded-sm border border-ink/10 bg-off-white p-3">
                <h2 className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink">
                  {stage.label} <span className="text-charcoal-light">{items.length}</span>
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {items.map((t) => (
                    <li key={t.id}>
                      <Link href={`/admin/voices/talent/${t.id}`} className="block rounded-sm border border-ink/10 bg-white p-3 hover:border-bronze/40">
                        <p className="text-sm font-medium text-ink">{t.name}</p>
                        <p className="mt-0.5 text-[11px] text-charcoal-light">{TALENT_CATEGORY_LABELS[t.category]}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Pill tone={statusTone(t.outreach_status)}>{OUTREACH_STATUS_LABELS[t.outreach_status]}</Pill>
                          {t.follow_up_on && (
                            <span className={cn("text-[11px]", t.follow_up_on <= today ? "font-semibold text-red-700" : "text-charcoal-light")}>
                              F/U {formatDate(t.follow_up_on)}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {view === "directory" && (
        <div className="mt-6">
          <form method="get" className="grid gap-3 rounded-sm border border-ink/10 bg-off-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <input type="hidden" name="view" value="directory" />
            <label className="text-xs font-medium text-ink">Search<input name="q" defaultValue={q} className={INPUT} placeholder="Name, agency, notes" /></label>
            <label className="text-xs font-medium text-ink">Category
              <select name="category" defaultValue={fCategory} className={INPUT}>
                <option value="">Any</option>
                {TALENT_CATEGORIES.map((c) => <option key={c} value={c}>{TALENT_CATEGORY_LABELS[c]}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-ink">Outreach status
              <select name="status" defaultValue={fStatus} className={INPUT}>
                <option value="">Any</option>
                {OUTREACH_STATUSES.map((s) => <option key={s} value={s}>{OUTREACH_STATUS_LABELS[s]}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-ink">Representative / agency<input name="rep" defaultValue={fRep} className={INPUT} /></label>
            <label className="text-xs font-medium text-ink">Outreach from<input type="date" name="outreach_from" defaultValue={fOutreachFrom} className={INPUT} /></label>
            <label className="text-xs font-medium text-ink">Outreach to<input type="date" name="outreach_to" defaultValue={fOutreachTo} className={INPUT} /></label>
            <label className="text-xs font-medium text-ink">Follow-up from<input type="date" name="follow_from" defaultValue={fFollowFrom} className={INPUT} /></label>
            <label className="text-xs font-medium text-ink">Follow-up to<input type="date" name="follow_to" defaultValue={fFollowTo} className={INPUT} /></label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <button type="submit" className={BUTTON}>Filter</button>
              <Link href="/admin/voices?view=directory" className={BUTTON_SECONDARY}>Clear</Link>
            </div>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-charcoal-light">
                <tr>
                  <th className="py-2 pr-3">Name</th><th className="pr-3">Category</th><th className="pr-3">Status</th>
                  <th className="pr-3">Representative</th><th className="pr-3">Outreach</th><th className="pr-3">Last contact</th><th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {directory.map((t) => {
                  const c = primaryContact(t.id);
                  return (
                    <tr key={t.id} className="border-b border-ink/5">
                      <td className="py-2 pr-3">{talentLink(t.id)}</td>
                      <td className="pr-3">{TALENT_CATEGORY_LABELS[t.category]}</td>
                      <td className="pr-3"><Pill tone={statusTone(t.outreach_status)}>{OUTREACH_STATUS_LABELS[t.outreach_status]}</Pill></td>
                      <td className="pr-3">{c ? `${c.contact_name}${c.organization ? ` · ${c.organization}` : ""}` : "—"}</td>
                      <td className="pr-3">{formatDate(t.outreach_on)}</td>
                      <td className="pr-3">{formatDate(t.last_contact_on)}</td>
                      <td className={cn(t.follow_up_on && t.follow_up_on <= today && "font-semibold text-red-700")}>{formatDate(t.follow_up_on)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {directory.length === 0 && <p className="mt-4 text-sm text-charcoal-light">No talent records match.</p>}
          </div>
        </div>
      )}

      {view === "submissions" && (
        <div className="mt-6 space-y-3">
          {reviewQueue.map((s) => (
            <Link key={s.id} href={`/admin/voices/submissions/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-4 hover:border-bronze/40">
              <div>
                <p className="font-medium text-ink">{s.participant_name} <span className="font-mono text-xs text-charcoal-light">{s.reference_code}</span></p>
                <p className="text-xs text-charcoal-light">
                  {s.submitter_name} · {s.relationship} · {s.video_path ? "Uploaded file" : "External link"} · {formatDateTime(s.submitted_at ?? s.created_at)}
                  {s.embargo_until && ` · Embargo ${formatDate(s.embargo_until)}`}
                </p>
              </div>
              <Pill tone={s.review_status === "needs_changes" ? "warn" : "info"}>{SUBMISSION_STATUS_LABELS[s.review_status]}</Pill>
            </Link>
          ))}
          {reviewQueue.length === 0 && <p className="text-sm text-charcoal-light">Nothing awaiting review.</p>}
          {incomplete.length > 0 && (
            <details className="mt-6 rounded-sm border border-dashed border-ink/20 p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-ink">{incomplete.length} incomplete upload(s)</summary>
              <p className="mt-2 text-xs text-charcoal-light">The submitter started but never finished uploading. No email was sent. Safe to ignore or follow up.</p>
              <ul className="mt-2 space-y-1">
                {incomplete.map((s) => (
                  <li key={s.id}><Link className="underline" href={`/admin/voices/submissions/${s.id}`}>{s.participant_name} · {s.reference_code}</Link> · {formatDateTime(s.created_at)}</li>
                ))}
              </ul>
            </details>
          )}
          <p className="pt-4 text-xs text-charcoal-light">
            All submissions: {submissions.length} ·{" "}
            {Object.entries(SUBMISSION_STATUS_LABELS).map(([k, label]) => `${label} ${submissions.filter((s) => s.review_status === k).length}`).join(" · ")}
          </p>
        </div>
      )}

      {view === "followups" && (
        <ul className="mt-6 space-y-2">
          {followUps.map((t) => (
            <li key={t.id} className={cn("flex flex-wrap items-center justify-between gap-3 rounded-sm border p-4", t.follow_up_on! < today ? "border-red-300 bg-red-50" : t.follow_up_on === today ? "border-bronze/40 bg-bronze/10" : "border-ink/10 bg-off-white")}>
              <div>
                {talentLink(t.id)}
                <p className="text-xs text-charcoal-light">{OUTREACH_STATUS_LABELS[t.outreach_status]} · last contact {formatDate(t.last_contact_on)}{t.response_summary && ` · “${t.response_summary.slice(0, 120)}”`}</p>
              </div>
              <span className="text-sm font-semibold">{t.follow_up_on! < today ? "Overdue · " : ""}{formatDate(t.follow_up_on)}</span>
            </li>
          ))}
          {followUps.length === 0 && <p className="text-sm text-charcoal-light">No follow-ups scheduled.</p>}
        </ul>
      )}

      {view === "delivery" && (
        <div className="mt-6 space-y-6">
          <ul className="space-y-2">
            {talent.filter((t) => t.outreach_status === "delivery_failed").map((t) => {
              const c = primaryContact(t.id);
              return (
                <li key={t.id} className="rounded-sm border border-red-300 bg-red-50 p-4">
                  {talentLink(t.id)}
                  <p className="text-xs text-red-900">Contact on file: {c ? `${c.contact_name} · ${c.email ?? c.other_method ?? "no method"} (verified ${formatDate(c.verified_on)})` : "none"} · source: {t.contact_source ?? "—"}</p>
                </li>
              );
            })}
          </ul>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Failed deliveries in the outreach log</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {activities.filter((a) => (FAILED_DELIVERY_STATUSES as readonly string[]).includes(a.delivery_status)).map((a) => (
                <li key={a.id}>{formatDate(a.occurred_on)} · {talentLink(a.talent_id)} · {humanize(a.delivery_status)} · {a.summary}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {view === "permissions" && (
        <div className="mt-6 space-y-8">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Agreements not yet signed</h2>
            <ul className="mt-2 space-y-2">
              {permissions.filter((p) => p.status === "draft" || p.status === "sent").map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-4">
                  <div>{talentLink(p.talent_id)} <span className="text-xs text-charcoal-light">· release v{p.release_version} · created {formatDate(p.created_at)}</span></div>
                  <Link href={`/admin/voices/permissions/${p.id}`} className={BUTTON_SECONDARY}>{humanize(p.status)} — open</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Approved recordings with no signed agreement</h2>
            <ul className="mt-2 space-y-2">
              {submissions
                .filter((s) => s.review_status === "approved" && !permissions.some((p) => p.talent_id === s.talent_id && p.status === "signed"))
                .map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-bronze/40 bg-bronze/10 p-4">
                    <div>{talentLink(s.talent_id)} <span className="font-mono text-xs">{s.reference_code}</span></div>
                    {s.talent_id && <Link href={`/admin/voices/permissions/new?talent=${s.talent_id}&submission=${s.id}`} className={BUTTON_SECONDARY}>Record agreement</Link>}
                  </li>
                ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Talent marked “Permissions pending”</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {talent.filter((t) => t.outreach_status === "permissions_pending").map((t) => <li key={t.id}>{talentLink(t.id)}</li>)}
            </ul>
          </section>
        </div>
      )}

      {view === "calendar" && (
        <div className="mt-6">
          {(() => {
            const entries = [
              ...publications.filter((p) => p.publish_at).map((p) => ({
                date: p.publish_at!.slice(0, 10),
                key: `pub-${p.id}`,
                label: <><Link className="font-medium underline-offset-2 hover:underline" href={`/admin/voices/publications/${p.id}`}>{p.display_name}</Link> — publication</>,
                tone: p.status === "published" ? (Date.parse(p.publish_at!) > nowMs ? ("info" as const) : ("good" as const)) : ("neutral" as const),
                status: p.status === "published" ? (Date.parse(p.publish_at!) > nowMs ? "Scheduled" : "Live") : humanize(p.status),
              })),
              ...submissions.filter((s) => s.suggested_publication_date && s.review_status !== "rejected" && s.review_status !== "withdrawn").map((s) => ({
                date: s.suggested_publication_date!,
                key: `sug-${s.id}`,
                label: <><Link className="underline-offset-2 hover:underline" href={`/admin/voices/submissions/${s.id}`}>{s.participant_name}</Link> — suggested date</>,
                tone: "neutral" as const,
                status: "Suggested",
              })),
              ...submissions.filter((s) => s.embargo_until && s.embargo_until >= today).map((s) => ({
                date: s.embargo_until!,
                key: `emb-${s.id}`,
                label: <><Link className="underline-offset-2 hover:underline" href={`/admin/voices/submissions/${s.id}`}>{s.participant_name}</Link> — embargo lifts</>,
                tone: "warn" as const,
                status: "Embargo",
              })),
            ].sort((a, b) => a.date.localeCompare(b.date));
            const months = [...new Set(entries.map((e) => e.date.slice(0, 7)))];
            if (entries.length === 0) return <p className="text-sm text-charcoal-light">Nothing scheduled.</p>;
            return months.map((month) => (
              <section key={month} className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">
                  {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`))}
                </h2>
                <ul className="mt-2 divide-y divide-ink/5 rounded-sm border border-ink/10 bg-off-white">
                  {entries.filter((e) => e.date.startsWith(month)).map((e) => (
                    <li key={e.key} className={cn("flex flex-wrap items-center gap-3 px-4 py-2 text-sm", e.date < today && "opacity-60")}>
                      <span className="w-24 font-mono text-xs">{e.date}</span>
                      <span className="flex-1">{e.label}</span>
                      <Pill tone={e.tone}>{e.status}</Pill>
                    </li>
                  ))}
                </ul>
              </section>
            ));
          })()}
        </div>
      )}

      {view === "published" && (
        <div className="mt-6 space-y-3">
          {publications.map((p) => {
            const live = p.status === "published" && p.publish_at && Date.parse(p.publish_at) <= nowMs;
            return (
              <Link key={p.id} href={`/admin/voices/publications/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-4 hover:border-bronze/40">
                <div>
                  <p className="font-medium text-ink">{p.display_name} {p.is_featured && <Pill tone="info">Featured</Pill>}</p>
                  <p className="text-xs text-charcoal-light">/voices/{p.slug} · {formatDateTime(p.publish_at)} · order {p.display_order}</p>
                </div>
                <Pill tone={live ? "good" : p.status === "published" ? "info" : p.status === "unpublished" ? "bad" : "neutral"}>
                  {live ? "Live" : p.status === "published" ? "Scheduled" : humanize(p.status)}
                </Pill>
              </Link>
            );
          })}
          {publications.length === 0 && <p className="text-sm text-charcoal-light">No publications yet. Create one from a talent record once a recording is approved.</p>}
          <p className="text-xs text-charcoal-light">
            Messages hand-published in src/lib/content/voices.ts also appear on /voices but are not managed here.
          </p>
        </div>
      )}

      {view === "activity" && (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Audit trail</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {audit.map((e) => (
                <li key={e.id} className="border-b border-ink/5 py-1.5">
                  <span className="font-mono text-xs text-charcoal-light">{formatDateTime(e.created_at)}</span> · {talentLink(e.talent_id)} · {humanize(e.entity_type)} {humanize(e.action).toLowerCase()}
                  <span className="text-xs text-charcoal-light"> — {e.actor_email ?? "system"}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">Outreach log</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {activities.slice(0, 150).map((a) => (
                <li key={a.id} className="border-b border-ink/5 py-1.5">
                  <span className="font-mono text-xs text-charcoal-light">{a.occurred_on}</span> · {talentLink(a.talent_id)} · {humanize(a.channel)} {a.direction} · {a.summary.slice(0, 140)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Container>
  );
}

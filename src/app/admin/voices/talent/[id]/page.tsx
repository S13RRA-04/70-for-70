import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import {
  CONTACT_ROLES,
  DELIVERY_STATUSES,
  OUTREACH_CHANNELS,
  OUTREACH_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
  TALENT_CATEGORY_LABELS,
  humanize,
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
import { addContactAction, deleteContactAction, logOutreachAction, updateTalentAction } from "../../actions";
import { TalentFields } from "../../talent-fields";
import { AdminHeader, BUTTON, BUTTON_SECONDARY, Flash, INPUT, Labeled, Panel, Pill, formatDate, formatDateTime } from "../../ui";

export default async function TalentDetailPage(props: PageProps<"/admin/voices/talent/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminClient();
  const [{ data: t }, contactsRes, activitiesRes, submissionsRes, permissionsRes, publicationsRes, auditRes] = await Promise.all([
    admin.from("voices_talent").select("*").eq("id", id).maybeSingle(),
    admin.from("voices_talent_contacts").select("*").eq("talent_id", id).order("is_primary", { ascending: false }),
    admin.from("voices_outreach_activities").select("*").eq("talent_id", id).order("occurred_on", { ascending: false }),
    admin.from("voices_submissions").select("id, reference_code, review_status, created_at, submitted_at, source").eq("talent_id", id).order("created_at", { ascending: false }),
    admin.from("voices_permission_agreements").select("*").eq("talent_id", id).order("created_at", { ascending: false }),
    admin.from("voices_publications").select("*").eq("talent_id", id).order("created_at", { ascending: false }),
    admin.from("voices_audit_events").select("*").eq("talent_id", id).order("created_at", { ascending: false }).limit(100),
  ]);
  const talent = t as VoicesTalentRow | null;
  if (!talent) notFound();

  const contacts = (contactsRes.data ?? []) as VoicesTalentContactRow[];
  const activities = (activitiesRes.data ?? []) as VoicesOutreachActivityRow[];
  const submissions = (submissionsRes.data ?? []) as Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status" | "created_at" | "submitted_at" | "source">[];
  const permissions = (permissionsRes.data ?? []) as VoicesPermissionRow[];
  const publications = (publicationsRes.data ?? []) as VoicesPublicationRow[];
  const audit = (auditRes.data ?? []) as VoicesAuditEventRow[];
  const contactName = new Map(contacts.map((c) => [c.id, c.contact_name]));
  const primaryEmail = contacts.find((c) => c.is_primary && c.email)?.email ?? contacts.find((c) => c.email)?.email;

  return (
    <Container className="max-w-6xl py-12">
      <AdminHeader
        title={talent.name}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            {TALENT_CATEGORY_LABELS[talent.category]} · <Pill>{OUTREACH_STATUS_LABELS[talent.outreach_status]}</Pill>
            {talent.follow_up_on && <span>Follow up {formatDate(talent.follow_up_on)}</span>}
          </span>
        }
      />
      <Flash searchParams={searchParams} />

      <nav className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
        {["details", "contacts", "outreach", "submissions", "permissions", "publications", "history"].map((s) => (
          <a key={s} href={`#${s}`} className="hover:text-ink">{s}</a>
        ))}
      </nav>

      <Panel id="details" title="Details">
        <form action={updateTalentAction}>
          <input type="hidden" name="id" value={talent.id} />
          <TalentFields talent={talent} />
          <p className="mt-4 text-xs text-charcoal-light">Setting the status to Withdrawn immediately unpublishes every live video for this participant.</p>
          <button type="submit" className={`${BUTTON} mt-4`}>Save</button>
        </form>
      </Panel>

      <Panel id="contacts" title="Representatives & contacts">
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-ink/10 bg-white p-3 text-sm">
              <div>
                <p className="font-medium text-ink">{c.contact_name} {c.is_primary && <Pill tone="info">Primary</Pill>}</p>
                <p className="text-xs text-charcoal-light">
                  {humanize(c.role)}{c.organization && ` · ${c.organization}`}{c.email && ` · ${c.email}`}{c.other_method && ` · ${c.other_method}`}
                </p>
                <p className="text-xs text-charcoal-light">Source: {c.source ?? "—"} · verified {formatDate(c.verified_on)}</p>
              </div>
              <form action={deleteContactAction}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="talent_id" value={talent.id} />
                <button type="submit" className="text-xs font-semibold uppercase text-red-700 hover:underline">Remove</button>
              </form>
            </li>
          ))}
          {contacts.length === 0 && <p className="text-sm text-charcoal-light">No contacts yet.</p>}
        </ul>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">Add a contact</summary>
          <form action={addContactAction} className="mt-3 grid gap-3 sm:grid-cols-3">
            <input type="hidden" name="talent_id" value={talent.id} />
            <Labeled label="Name *"><input name="contact_name" required className={INPUT} /></Labeled>
            <Labeled label="Role">
              <select name="role" defaultValue="representative" className={INPUT}>
                {CONTACT_ROLES.map((r) => <option key={r} value={r}>{humanize(r)}</option>)}
              </select>
            </Labeled>
            <Labeled label="Agency / organization"><input name="organization" className={INPUT} /></Labeled>
            <Labeled label="Professional email"><input name="email" type="email" className={INPUT} /></Labeled>
            <Labeled label="Other professional contact method" hint="No personal phone numbers."><input name="other_method" className={INPUT} /></Labeled>
            <Labeled label="Verification source"><input name="source" className={INPUT} /></Labeled>
            <Labeled label="Verified on"><input type="date" name="verified_on" className={INPUT} /></Labeled>
            <label className="flex items-center gap-2 text-xs font-medium text-ink"><input type="checkbox" name="is_primary" /> Primary contact</label>
            <div className="sm:col-span-3"><button type="submit" className={BUTTON}>Add contact</button></div>
          </form>
        </details>
      </Panel>

      <Panel
        id="outreach"
        title="Outreach log"
        actions={
          primaryEmail ? (
            <a href={`mailto:${primaryEmail}?subject=${encodeURIComponent("Voices For The 22 — invitation")}`} className={BUTTON_SECONDARY}>
              Compose in mail app
            </a>
          ) : null
        }
      >
        <p className="text-xs text-charcoal-light">The portal never sends outreach. Send from your own mail client, then log it here.</p>
        <form action={logOutreachAction} className="mt-3 grid gap-3 rounded-sm border border-ink/10 bg-white p-4 sm:grid-cols-3">
          <input type="hidden" name="talent_id" value={talent.id} />
          <Labeled label="Date"><input type="date" name="occurred_on" defaultValue={new Date().toISOString().slice(0, 10)} className={INPUT} /></Labeled>
          <Labeled label="Channel">
            <select name="channel" className={INPUT}>{OUTREACH_CHANNELS.map((c) => <option key={c} value={c}>{humanize(c)}</option>)}</select>
          </Labeled>
          <Labeled label="Direction">
            <select name="direction" className={INPUT}><option value="outbound">Outbound</option><option value="inbound">Inbound</option></select>
          </Labeled>
          <Labeled label="Contact">
            <select name="contact_id" className={INPUT}>
              <option value="">—</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.contact_name}</option>)}
            </select>
          </Labeled>
          <Labeled label="Delivery status" hint="Bounced/failed moves the record to the delivery-failure queue.">
            <select name="delivery_status" className={INPUT}>{DELIVERY_STATUSES.map((d) => <option key={d} value={d}>{humanize(d)}</option>)}</select>
          </Labeled>
          <Labeled label="Follow up on"><input type="date" name="follow_up_on" className={INPUT} /></Labeled>
          <Labeled label="Summary *" className="sm:col-span-3"><textarea name="summary" required rows={2} className={INPUT} /></Labeled>
          <Labeled label="Response" hint="A response is not a permission — record agreements separately." className="sm:col-span-3"><textarea name="response" rows={2} className={INPUT} /></Labeled>
          <div className="sm:col-span-3"><button type="submit" className={BUTTON}>Log activity</button></div>
        </form>
        <ul className="mt-4 space-y-2">
          {activities.map((a) => (
            <li key={a.id} className="rounded-sm border border-ink/10 bg-white p-3 text-sm">
              <p className="text-xs text-charcoal-light">
                {formatDate(a.occurred_on)} · {humanize(a.channel)} · {a.direction}
                {a.contact_id && ` · ${contactName.get(a.contact_id) ?? "contact"}`}
                {a.delivery_status !== "not_applicable" && <> · <Pill tone={["bounced", "failed"].includes(a.delivery_status) ? "bad" : "neutral"}>{humanize(a.delivery_status)}</Pill></>}
                {a.follow_up_on && ` · follow up ${formatDate(a.follow_up_on)}`} · {a.created_by ?? ""}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{a.summary}</p>
              {a.response && <p className="mt-1 whitespace-pre-wrap text-charcoal-light">↳ {a.response}</p>}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel id="submissions" title="Submissions" actions={<Link href={`/admin/voices/submissions/new?talent=${talent.id}`} className={BUTTON_SECONDARY}>Log a recording</Link>}>
        <ul className="space-y-2 text-sm">
          {submissions.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/voices/submissions/${s.id}`} className="underline-offset-2 hover:underline">{s.reference_code}</Link> · {formatDateTime(s.submitted_at ?? s.created_at)} · {s.source} · <Pill>{SUBMISSION_STATUS_LABELS[s.review_status]}</Pill>
            </li>
          ))}
          {submissions.length === 0 && <p className="text-charcoal-light">No submissions linked.</p>}
        </ul>
      </Panel>

      <Panel id="permissions" title="Permission agreements" actions={<Link href={`/admin/voices/permissions/new?talent=${talent.id}`} className={BUTTON_SECONDARY}>Record agreement</Link>}>
        <ul className="space-y-2 text-sm">
          {permissions.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/voices/permissions/${p.id}`} className="underline-offset-2 hover:underline">Release v{p.release_version}</Link>{" "}
              · <Pill tone={p.status === "signed" ? "good" : p.status === "revoked" || p.status === "expired" ? "bad" : "warn"}>{humanize(p.status)}</Pill>{" "}
              · channels: {p.permitted_channels.map(humanize).join(", ") || "none"}
              {p.usage_ends_on && ` · until ${formatDate(p.usage_ends_on)}`}
              {p.requires_participant_approval && " · final-cut approval required"}
            </li>
          ))}
          {permissions.length === 0 && <p className="text-charcoal-light">No agreement recorded — publication is blocked until one is signed.</p>}
        </ul>
      </Panel>

      <Panel id="publications" title="Publications" actions={<Link href={`/admin/voices/publications/new?talent=${talent.id}`} className={BUTTON_SECONDARY}>New publication</Link>}>
        <ul className="space-y-2 text-sm">
          {publications.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/voices/publications/${p.id}`} className="underline-offset-2 hover:underline">/voices/{p.slug}</Link> · <Pill>{humanize(p.status)}</Pill> · {formatDateTime(p.publish_at)}
              {p.unpublish_reason && ` · unpublished: ${p.unpublish_reason}`}
            </li>
          ))}
          {publications.length === 0 && <p className="text-charcoal-light">Nothing published.</p>}
        </ul>
      </Panel>

      <Panel id="history" title="History (audit trail)">
        <ul className="space-y-1 text-sm">
          {audit.map((e) => (
            <li key={e.id} className="border-b border-ink/5 py-1">
              <span className="font-mono text-xs text-charcoal-light">{formatDateTime(e.created_at)}</span> · {humanize(e.entity_type)} {humanize(e.action).toLowerCase()}
              {Object.keys(e.details ?? {}).length > 0 && <span className="text-xs text-charcoal-light"> · {JSON.stringify(e.details)}</span>}
              <span className="text-xs text-charcoal-light"> — {e.actor_email ?? "system"}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Container>
  );
}

import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { csvCell } from "@/lib/voices/csv";
import { OUTREACH_STATUS_LABELS, TALENT_CATEGORY_LABELS } from "@/lib/voices/model";
import type { VoicesTalentContactRow, VoicesTalentRow } from "@/types/voices";

/**
 * CSV export of talent records for the admin. Accepts the same filters as the
 * dashboard's directory view. Contains representative contact data — admin
 * only, never cached, and formula-injection safe (see csvCell).
 */
export async function GET(request: Request) {
  await requireAdminUser();
  const params = new URL(request.url).searchParams;
  const get = (k: string) => (params.get(k) ?? "").toLowerCase();

  const admin = createAdminClient();
  const [{ data: talentData }, { data: contactData }] = await Promise.all([
    admin.from("voices_talent").select("*").order("name"),
    admin.from("voices_talent_contacts").select("*"),
  ]);
  const talent = (talentData ?? []) as VoicesTalentRow[];
  const contacts = (contactData ?? []) as VoicesTalentContactRow[];
  const byTalent = new Map<string, VoicesTalentContactRow[]>();
  for (const c of contacts) byTalent.set(c.talent_id, [...(byTalent.get(c.talent_id) ?? []), c]);

  const q = get("q");
  const rep = get("rep");
  const rows = talent.filter((t) => {
    const cs = byTalent.get(t.id) ?? [];
    if (q && ![t.name, t.professional_title, t.internal_notes, ...cs.flatMap((c) => [c.contact_name, c.organization])].some((v) => v?.toLowerCase().includes(q))) return false;
    if (params.get("category") && t.category !== params.get("category")) return false;
    if (params.get("status") && t.outreach_status !== params.get("status")) return false;
    if (rep && !cs.some((c) => c.contact_name.toLowerCase().includes(rep) || c.organization?.toLowerCase().includes(rep))) return false;
    const of = params.get("outreach_from"), ot = params.get("outreach_to"), ff = params.get("follow_from"), ft = params.get("follow_to");
    if (of && (!t.outreach_on || t.outreach_on < of)) return false;
    if (ot && (!t.outreach_on || t.outreach_on > ot)) return false;
    if (ff && (!t.follow_up_on || t.follow_up_on < ff)) return false;
    if (ft && (!t.follow_up_on || t.follow_up_on > ft)) return false;
    return true;
  });

  const header = [
    "Name", "Category", "Professional title", "Outreach status", "Primary contact", "Contact role", "Agency/organization",
    "Contact email", "Contact source", "Source verified", "First outreach", "Last contact", "Follow up", "Response summary", "Internal notes", "Updated",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const t of rows) {
    const cs = byTalent.get(t.id) ?? [];
    const c = cs.find((x) => x.is_primary) ?? cs[0];
    lines.push(
      [
        t.name, TALENT_CATEGORY_LABELS[t.category], t.professional_title, OUTREACH_STATUS_LABELS[t.outreach_status],
        c?.contact_name, c?.role, c?.organization, c?.email, t.contact_source, t.source_verified_on, t.outreach_on,
        t.last_contact_on, t.follow_up_on, t.response_summary, t.internal_notes, t.updated_at,
      ].map(csvCell).join(","),
    );
  }

  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="voices-talent-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

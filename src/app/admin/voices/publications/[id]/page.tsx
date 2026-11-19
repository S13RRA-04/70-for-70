import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { VoiceVideo } from "@/components/voices/voice-video";
import { loadPublicationGate } from "@/lib/voices/admin";
import { humanize } from "@/lib/voices/model";
import { publicationBlockers } from "@/lib/voices/publication-gate";
import type { VoicesPermissionRow, VoicesSubmissionRow, VoicesTalentRow } from "@/types/voices";
import { publishPublicationAction, recordParticipantApprovalAction, unpublishPublicationAction } from "../../actions";
import { PublicationForm } from "../../publication-form";
import { AdminHeader, BUTTON, BUTTON_DANGER, Flash, INPUT, Labeled, Panel, Pill, formatDateTime } from "../../ui";

export default async function PublicationDetailPage(props: PageProps<"/admin/voices/publications/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminClient();
  const gate = await loadPublicationGate(admin, id);
  if (!gate) notFound();
  const { publication } = gate;

  const [{ data: talent }, { data: subs }, { data: perms }] = await Promise.all([
    admin.from("voices_talent").select("id, name, category, public_attribution").eq("id", publication.talent_id).single(),
    admin.from("voices_submissions").select("id, reference_code, review_status").eq("talent_id", publication.talent_id),
    admin.from("voices_permission_agreements").select("id, release_version, status, approved_attribution, requires_participant_approval, restrictions").eq("talent_id", publication.talent_id),
  ]);

  const now = new Date();
  const previewPublishAt = publication.publish_at ?? now.toISOString();
  const blockers = publicationBlockers({ now, ...gate.input, publication: { ...gate.input.publication, publishAt: previewPublishAt } });
  const isPublished = publication.status === "published";
  const isLive = isPublished && publication.publish_at !== null && Date.parse(publication.publish_at) <= now.getTime();
  const linkedPermission = (perms ?? []).find((p) => p.id === publication.permission_id);

  return (
    <Container className="max-w-5xl py-12">
      <AdminHeader
        title={publication.display_name}
        back={{ href: `/admin/voices/talent/${publication.talent_id}#publications`, label: talent?.name ?? "Talent" }}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            /voices/{publication.slug} · <Pill tone={isLive ? "good" : isPublished ? "info" : publication.status === "unpublished" ? "bad" : "neutral"}>{isLive ? "Live" : isPublished ? "Scheduled" : humanize(publication.status)}</Pill>
            {isLive && <Link href={`/voices/${publication.slug}`} className="underline">View public page</Link>}
          </span>
        }
      />
      <Flash searchParams={searchParams} />

      {isPublished ? (
        <Panel title="Unpublish (withdrawal / takedown)">
          <p className="text-sm text-ink">
            {isLive ? "Live since" : "Scheduled for"} {formatDateTime(publication.publish_at)} · published by {publication.published_by ?? "—"}
          </p>
          <form action={unpublishPublicationAction} className="mt-4 grid gap-3">
            <input type="hidden" name="id" value={publication.id} />
            <Labeled label="Reason *"><textarea name="unpublish_reason" required rows={2} className={INPUT} placeholder="e.g. Withdrawal request from representative, received by email" /></Labeled>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="delete_assets" /> Also delete the public video, poster and captions files from storage</label>
            <div><button type="submit" className={BUTTON_DANGER}>Unpublish now</button></div>
          </form>
        </Panel>
      ) : (
        <Panel title="Publication gate">
          {blockers.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-red-800">Publishing is blocked:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">
                {blockers.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </>
          ) : (
            <p className="text-sm font-semibold text-olive">All checks pass — approved submission, signed agreement covering these channels, approvals and embargo satisfied.</p>
          )}
          {linkedPermission?.restrictions && (
            <p className="mt-3 rounded-sm border border-bronze/40 bg-bronze/10 p-3 text-sm"><strong>Agreement restrictions:</strong> {linkedPermission.restrictions}</p>
          )}
          {linkedPermission?.requires_participant_approval && !publication.participant_approved_at && (
            <form action={recordParticipantApprovalAction} className="mt-4 grid gap-3 rounded-sm border border-ink/10 bg-white p-4">
              <input type="hidden" name="id" value={publication.id} />
              <Labeled label="Record participant approval of the final video *"><input name="approval_note" required className={INPUT} placeholder="e.g. Approved by publicist via email, Nov 20" /></Labeled>
              <div><button type="submit" className={BUTTON}>Record approval</button></div>
            </form>
          )}
          {publication.participant_approved_at && <p className="mt-3 text-sm text-olive">Participant approval recorded {formatDateTime(publication.participant_approved_at)}.</p>}
          {blockers.length === 0 && (
            <form action={publishPublicationAction} className="mt-5 grid gap-3 border-t border-ink/10 pt-4">
              <input type="hidden" name="id" value={publication.id} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" /> Feature at the top of /voices</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" required /> I&apos;ve checked the agreement&apos;s restrictions, attribution and channels against this publication.</label>
              <div>
                <button type="submit" className={BUTTON}>
                  {publication.publish_at && Date.parse(publication.publish_at) > now.getTime() ? `Schedule for ${formatDateTime(publication.publish_at)}` : "Publish now"}
                </button>
              </div>
            </form>
          )}
          {publication.unpublish_reason && <p className="mt-4 text-xs text-charcoal-light">Previously unpublished {formatDateTime(publication.unpublished_at)}: {publication.unpublish_reason}</p>}
        </Panel>
      )}

      {publication.video_url && (
        <Panel title="Preview">
          <VoiceVideo
            message={{
              name: publication.display_name,
              video: { src: publication.video_url, type: publication.video_type, poster: publication.poster_url ?? undefined, captions: publication.captions_url ?? undefined },
            }}
          />
        </Panel>
      )}

      {isPublished ? (
        <p className="mt-8 text-sm text-charcoal-light">Unpublish to edit this publication.</p>
      ) : (
        <Panel title="Draft">
          {talent && (
            <PublicationForm
              talent={talent as Pick<VoicesTalentRow, "id" | "name" | "category" | "public_attribution">}
              publication={publication}
              submissions={(subs ?? []) as Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[]}
              permissions={(perms ?? []) as Pick<VoicesPermissionRow, "id" | "release_version" | "status" | "approved_attribution">[]}
            />
          )}
        </Panel>
      )}
    </Container>
  );
}

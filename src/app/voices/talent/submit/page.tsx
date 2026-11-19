import Link from "next/link";
import { Container } from "@/components/shared/container";
import { TalentContactBand, TalentPageHero, TalentPortalNav } from "@/components/voices/talent-portal";
import { TalentSubmissionForm } from "@/components/voices/talent-submission-form";
import { PORTAL_PATHS, TALENT_CONTACT } from "@/lib/content/voices-talent";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Voices For The 22 — Submit Your Message",
    description: "Securely submit a Voices For The 22 video message for review.",
    canonical: PORTAL_PATHS.submit,
  }),
  // A form endpoint, not content — keep it out of search results.
  robots: { index: false, follow: true },
};

export default function SubmitPage() {
  return (
    <>
      <TalentPortalNav current={PORTAL_PATHS.submit} />
      <TalentPageHero eyebrow="Voices For The 22 · Secure submission" title="Submit your message.">
        <p>
          Files upload directly to private storage that only authorized For The 22 administrators can access. You&apos;ll
          get a reference number, and nothing is published until permission is recorded.
        </p>
      </TalentPageHero>

      <section className="bg-paper py-12 sm:py-16">
        <Container className="grid max-w-5xl gap-10 lg:grid-cols-[1fr_300px]">
          <TalentSubmissionForm />
          <aside className="flex flex-col gap-6 text-sm leading-relaxed text-copy lg:pt-2">
            <div>
              <h2 className="font-bold text-navy">Before you submit</h2>
              <p className="mt-2">
                Check the{" "}
                <Link href={PORTAL_PATHS.recordingGuide} className="font-semibold text-navy underline underline-offset-4">
                  recording guide
                </Link>{" "}
                and the{" "}
                <Link href={PORTAL_PATHS.permissions} className="font-semibold text-navy underline underline-offset-4">
                  usage permissions
                </Link>
                . Only the fields marked * are required.
              </p>
            </div>
            <div>
              <h2 className="font-bold text-navy">Large file or slow connection?</h2>
              <p className="mt-2">
                Share a secure link (Dropbox, Google Drive, WeTransfer, Frame.io) instead, or email{" "}
                <a href={`mailto:${TALENT_CONTACT.email}`} className="font-semibold text-navy underline underline-offset-4">
                  {TALENT_CONTACT.email}
                </a>
                .
              </p>
            </div>
            <div>
              <h2 className="font-bold text-navy">We never ask for</h2>
              <p className="mt-2">Medical records, diagnoses, personal phone numbers or any health information.</p>
            </div>
          </aside>
        </Container>
      </section>

      <TalentContactBand />
    </>
  );
}

/** Material-connection disclosure — rendered prominently near the top of a post, never buried. Only shown when the entry sets sponsor_disclosure. */
export function SponsorDisclosureBanner({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <div className="mt-6 rounded-sm border border-ink/15 bg-sand-light px-4 py-3 text-sm text-charcoal-light">
      <span className="mr-1.5 font-semibold uppercase tracking-wide text-ink">Partner Disclosure:</span>
      {text}
    </div>
  );
}

/** Scopes For The 22: Live's visual identity to its own pages — see [data-property] in src/app/globals.css. */
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <div data-property="live">{children}</div>;
}

/** Scopes Ruck For The 22's visual identity to its own pages — see [data-property] in src/app/globals.css. */
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <div data-property="ruck">{children}</div>;
}

/**
 * Columns safe to select through the public/anon Supabase client. Excludes
 * `donor_email`, which the schema reserves for admin-only cumulative-giving
 * lookups (see src/lib/donor-tiers.ts) and must never reach a public page —
 * selecting it here would embed it in the RSC payload of public pages like
 * /miles/[number] regardless of whether it's ever rendered.
 */
export const PUBLIC_DONATION_COLUMNS =
  "id, mile_id, donor_name, amount, organization_benefited, anonymous, dedication_type, dedication_name, dedication_message, dedication_branch, dedication_public, date, external_reference, verified, created_at";

import type { DonationRow, MileRow } from "./database";

/** A mile plus the individual donations that fund it, for detail views. */
export interface MileWithDonations extends MileRow {
  donations: DonationRow[];
}

/** Nav link shape shared by the header and mobile nav. */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * Local-preview fallback data, used only when Supabase env vars are absent
 * (see `isSupabaseConfigured`). This lets `npm run dev` render the site
 * before a Supabase project exists — and it mirrors the real campaign
 * state: nothing is funded yet, so it matches `supabase/seed.sql` (every
 * mile starts at $0/available, campaign.amount_raised is $0). For a
 * populated preview of the funded/partially-funded UI states, layer
 * `supabase/seed-demo.sql` onto a real (non-production) Supabase project
 * instead of editing this file.
 */

import type {
  CampaignRow,
  DonationRow,
  JournalEntryRow,
  MileRow,
  MissionPartnerRow,
  PartnerRow,
  PostRow,
  SponsorRow,
  TrainingObjectiveRow,
} from "@/types/database";

const now = new Date().toISOString();

export const SEED_CAMPAIGN: CampaignRow = {
  id: "seed-campaign",
  name: "Tri For The 22",
  fundraising_goal: 70_000,
  amount_raised: 0,
  race_distance: 70.3,
  race_date: null,
  race_location: null,
  allocation_policy: null,
  updated_at: now,
};

export const SEED_MILES: MileRow[] = Array.from({ length: 70 }, (_, i) => {
  const mile_number = i + 1;
  return {
    id: `seed-mile-${mile_number}`,
    mile_number,
    goal_amount: 1_000,
    amount_funded: 0,
    status: "available",
    dedication: null,
    updated_at: now,
  };
});

export const SEED_DONATIONS: DonationRow[] = [];

export const SEED_PARTNERS: PartnerRow[] = [
  {
    id: "seed-partner-mighty-oaks",
    name: "Mighty Oaks Foundation",
    description:
      "The Mighty Oaks Warrior Program works with veterans through a lens centered on faith, responsibility, and purpose — helping veterans and their families move forward after difficult experiences. That's why Mighty Oaks is part of Tri For The 22.",
    what_they_do: null, // Awaiting the organization's own approved description — hidden until supplied, not shown as a placeholder.
    logo_url: "/partners/mighty-oaks-logo.png",
    logo_light_url: null,
    logo_dark_url: null,
    logo_background: null,
    website_url: "https://www.mightyoaksprograms.org/",
    donation_url:
      "https://my.onecause.com/fundraiser/organizations/90be7c03-c221-49a6-ba58-5993b28179c3/fundraisers/fundraiser:25d33d01-f349-491f-ab63-f283ebab0a33/personalfundraisers/personalfund:93a8c5a5-7777-4ca2-bcb6-6333dc8a1cf8",
    requires_donation_note: false,
    ein: "45-3159170",
    nonprofit_status_verified: true,
    active: true,
    agreement_status: null,
    logo_permission: false,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
  },
  {
    id: "seed-partner-project-echelon",
    name: "Project Echelon",
    description:
      "Project Echelon uses endurance sport, mentorship, structure, and community to help veterans keep moving forward after military service — putting veterans back into an environment with a mission, a team, and a reason to keep showing up.",
    what_they_do: null, // Awaiting the organization's own approved description — hidden until supplied, not shown as a placeholder.
    logo_url: "/partners/project-echelon-logo.png",
    logo_light_url: null,
    logo_dark_url: null,
    logo_background: null,
    website_url: "https://www.projectechelon.org/",
    donation_url: null,
    requires_donation_note: false,
    ein: null,
    nonprofit_status_verified: false,
    active: false, // Temporarily paused as a fundraising beneficiary pending their approval.
    agreement_status: null,
    logo_permission: false,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
  },
  {
    id: "seed-partner-vau",
    name: "Veterans and Athletes United",
    description:
      "Veterans and Athletes United uses adaptive sports, outdoor recreation, and community to help wounded, injured, and ill veterans rebuild strength and purpose — reaching veterans who need exactly the kind of mission, movement, and community this campaign is built around.",
    what_they_do: null, // Awaiting the organization's own approved description — hidden until supplied, not shown as a placeholder.
    logo_url: "/partners/vau-logo.png",
    logo_light_url: "/partners/vau-logo-white.png",
    logo_dark_url: "/partners/vau-logo.png",
    logo_background: null,
    website_url: "https://www.vetsau.org/",
    donation_url: "https://www.paypal.com/donate/?hosted_button_id=2YL6S962W4QGY",
    requires_donation_note: true,
    ein: "46-1844248",
    nonprofit_status_verified: true,
    active: true,
    agreement_status: null,
    logo_permission: false,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
  },
];

// No sponsors yet. SponsorWall shows a polished "coming soon" empty state
// rather than fake/sample sponsor cards — see components/sponsors/sponsor-wall.tsx.
export const SEED_SPONSORS: SponsorRow[] = [];

// No formal Mission Partner relationships yet. The Partners page shows a
// polished "coming soon" empty state rather than fake/sample partner cards —
// see app/partners/page.tsx.
export const SEED_MISSION_PARTNERS: MissionPartnerRow[] = [];

// No posts yet. Superseded by SEED_JOURNAL_ENTRIES below (see
// supabase/schema.sql's note on public.posts) — kept in place, unused.
export const SEED_POSTS: PostRow[] = [];

// No journal entries yet. The Journal landing page and homepage teaser show
// polished empty states rather than placeholder entries — see
// app/journal/page.tsx and app/campaign-home/page.tsx.
export const SEED_JOURNAL_ENTRIES: JournalEntryRow[] = [];

/**
 * The real benchmark ladder shown on /the-race, mirrored here as the
 * offline/no-Supabase fallback so local dev without a DB still matches
 * production. Edited going forward via /admin/training-objectives, not
 * this file — see supabase/seed.sql for the canonical fresh-provisioning
 * version of the same data.
 */
function objective(
  id: string,
  category: TrainingObjectiveRow["category"],
  label: string,
  display_order: number,
  status: TrainingObjectiveRow["status"] = "not_started",
  tag: string | null = null,
): TrainingObjectiveRow {
  return { id, category, label, display_order, status, tag, completed_at: null, created_at: now };
}

export const SEED_TRAINING_OBJECTIVES: TrainingObjectiveRow[] = [
  objective("seed-swim-1", "swim", "Complete first pool session", 0, "done"),
  objective("seed-swim-2", "swim", "25m continuous", 1, "done"),
  objective("seed-swim-3", "swim", "50m comfortable & repeatable", 2, "done", "Current baseline"),
  objective("seed-swim-4", "swim", "100m continuous", 3, "done"),
  objective("seed-swim-5", "swim", "125m continuous", 4),
  objective("seed-swim-6", "swim", "200m continuous", 5),
  objective("seed-swim-7", "swim", "400m continuous", 6),
  objective("seed-swim-8", "swim", "750m continuous", 7),
  objective("seed-swim-9", "swim", "1,000m continuous", 8),
  objective("seed-swim-10", "swim", "1,500m continuous", 9),
  objective("seed-swim-11", "swim", "1,900m / 1.2 mi continuous", 10, "not_started", "Race distance"),
  objective("seed-swim-12", "swim", "2,500m controlled", 11, "not_started", "Stretch"),

  objective("seed-bike-1", "bike", "Begin riding a real road bike", 0, "in_progress", "Now"),
  objective("seed-bike-2", "bike", "Confident braking/shifting/handling", 1),
  objective("seed-bike-3", "bike", "60 min continuous", 2),
  objective("seed-bike-4", "bike", "20 miles", 3),
  objective("seed-bike-5", "bike", "90 min continuous", 4),
  objective("seed-bike-6", "bike", "2 hours", 5),
  objective("seed-bike-7", "bike", "40 miles", 6),
  objective("seed-bike-8", "bike", "56 miles", 7, "not_started", "Race distance"),
  objective("seed-bike-9", "bike", "60–70 mi controlled", 8, "not_started", "Stretch"),
  objective("seed-bike-10", "bike", "Establish FTP", 9),
  objective("seed-bike-11", "bike", "2.5 W/kg FTP", 10),
  objective("seed-bike-12", "bike", "3.0 W/kg", 11),
  objective("seed-bike-13", "bike", "~3.2–3.7 W/kg", 12, "not_started", "Podium-track"),

  objective("seed-run-1", "run", "Establish current 5K", 0),
  objective("seed-run-2", "run", "30 min comfortable", 1),
  objective("seed-run-3", "run", "60 min comfortable", 2),
  objective("seed-run-4", "run", "Controlled 10K", 3),
  objective("seed-run-5", "run", "10-mile long run", 4),
  objective("seed-run-6", "run", "13.1 miles", 5, "not_started", "Race distance"),
  objective("seed-run-7", "run", "Sub-25 5K", 6),
  objective("seed-run-8", "run", "~20–22 min 5K", 7, "not_started", "Podium-track"),

  objective("seed-brick-1", "brick", "First bike → run", 0),
  objective("seed-brick-2", "brick", "60m bike + 15m run", 1),
  objective("seed-brick-3", "brick", "90m bike + 20–30m run", 2),
  objective("seed-brick-4", "brick", "2h bike + 30m run", 3),
  objective("seed-brick-5", "brick", "2.5–3h bike + 45m run", 4),
  objective("seed-brick-6", "brick", "Race-simulation brick", 5),

  objective("seed-vo2max-1", "vo2max", "37", 0, "done", "One month ago"),
  objective("seed-vo2max-2", "vo2max", "38", 1, "done", "Two weeks ago"),
  objective("seed-vo2max-3", "vo2max", "40", 2, "done", "Current"),
  objective("seed-vo2max-4", "vo2max", "42", 3),
  objective("seed-vo2max-5", "vo2max", "45", 4),
  objective("seed-vo2max-6", "vo2max", "50", 5),
  objective("seed-vo2max-7", "vo2max", "55", 6, "not_started", "Stretch"),

  objective("seed-strength-1", "strength", "Establish Push/Pull baselines", 0, "in_progress"),
  objective("seed-strength-2", "strength", "Maintain strength as endurance volume rises", 1),
  objective("seed-strength-3", "strength", "Maintain muscular bodyweight/composition", 2),
  objective("seed-strength-4", "strength", "Strength PR during 70.3 build", 3, "not_started", "Stretch"),

  objective("seed-race-1", "race_readiness", "Complete all three disciplines individually", 0),
  objective("seed-race-2", "race_readiness", "Full-distance swim + long bike/brick competency", 1),
  objective("seed-race-3", "race_readiness", "Fueling strategy validated", 2),
  objective("seed-race-4", "race_readiness", "Open-water competency", 3),
  objective("seed-race-5", "race_readiness", "Race simulation completed", 4),
  objective("seed-race-6", "race_readiness", "IRONMAN 70.3 Chattanooga — 70.3 miles", 5, "goal"),
];

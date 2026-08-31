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
  MessageRow,
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

export const SEED_MESSAGES: MessageRow[] = [];

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
      "Veterans and Athletes United uses adaptive sports, outdoor recreation, and community to help wounded, injured, and ill veterans rebuild strength and purpose — reaching veterans who need exactly the kind of mission, movement, and community this campaign is built around. That's why Veterans and Athletes United is part of Tri For The 22.",
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

export const SEED_MISSION_PARTNERS: MissionPartnerRow[] = [
  {
    id: "seed-mission-partner-project-echelon",
    name: "Project Echelon",
    relationship_label: "Campaign Sponsor",
    description:
      "Project Echelon uses endurance sport, mentorship, structure, and community to help veterans keep moving forward after military service — supporting Tri For The 22 as a campaign sponsor.",
    logo_url: "/partners/project-echelon-logo.png",
    logo_light_url: null,
    logo_dark_url: null,
    logo_background: null,
    website_url: "https://www.projectechelon.org/",
    support_type: null,
    geographic_scope: null,
    active: true,
    display_order: 0,
    agreement_status: null,
    logo_permission: false,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
  },
];

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
  metric: { historical?: string; current?: string; next?: string; goal?: string } = {},
): TrainingObjectiveRow {
  return {
    id,
    category,
    label,
    display_order,
    status,
    tag,
    metric_historical: metric.historical ?? null,
    metric_current: metric.current ?? null,
    metric_next: metric.next ?? null,
    metric_goal: metric.goal ?? null,
    completed_at: null,
    created_at: now,
  };
}

export const SEED_TRAINING_OBJECTIVES: TrainingObjectiveRow[] = [
  objective("seed-swim-1", "swim", "750 yd continuous, controlled", 0, "done"),
  objective("seed-swim-2", "swim", "1,800+ yd total session", 1, "done", "Current volume"),
  objective("seed-swim-3", "swim", "Establish repeatable 100-yd pace", 2),
  objective("seed-swim-4", "swim", "Complete CSS test: 400 + 200 yd", 3),
  objective("seed-swim-5", "swim", "8 × 100 within ±5 sec", 4),
  objective("seed-swim-6", "swim", "1,000 yd continuous at aerobic effort", 5),
  objective("seed-swim-7", "swim", "1,500 yd continuous with stable form", 6),
  objective("seed-swim-8", "swim", "2,112 yd continuous", 7, "not_started", "Race distance", {
    current: "750 yd",
    next: "1,000 yd",
    goal: "2,112 yd",
  }),
  objective("seed-swim-9", "swim", "2,112 yd at target race pace", 8, "not_started", null, {
    historical: "28:19 (2023 M35–39 winner)",
    current: "TBD",
    next: "30:00–32:00 (competitive)",
    goal: "≤29:00 / ~1:22–1:25 per 100 yd (podium)",
  }),
  objective("seed-swim-10", "swim", "Open-water 1,000 yd with sighting", 9),
  objective("seed-swim-11", "swim", "Full-distance open-water swim", 10),

  objective("seed-bike-1", "bike", "Outdoor baseline: 9.06 mi / 12.1 mph / 412 ft", 0, "done"),
  objective("seed-bike-2", "bike", "Confident braking, shifting, descending and cornering", 1),
  objective("seed-bike-3", "bike", "60 min continuous mostly Z2", 2),
  objective("seed-bike-4", "bike", "Establish benchmark route and repeat monthly", 3),
  objective("seed-bike-5", "bike", "Average 14 mph on benchmark route at similar HR", 4),
  objective("seed-bike-6", "bike", "Average 16 mph at similar HR", 5),
  objective("seed-bike-7", "bike", "Install power meter and establish FTP", 6),
  objective("seed-bike-8", "bike", "FTP (W/kg)", 7, "not_started", null, {
    current: "TBD",
    next: "2.5 W/kg",
    goal: "3.0+ W/kg",
  }),
  objective("seed-bike-9", "bike", "Hold aero position continuously for 20 min", 8),
  objective("seed-bike-10", "bike", "Hold aero for 60 min without meaningful power loss", 9),
  objective("seed-bike-11", "bike", "40 miles controlled with fueling executed", 10),
  objective("seed-bike-12", "bike", "56 miles at planned race effort", 11, "not_started", "Race distance", {
    historical: "2:10:23–2:14:36 (2023 & 2025 M35–39 winners)",
    current: "12.1 mph outdoor training baseline (not race effort)",
    next: "2:20:00–2:25:00 / 23.1–24.0 mph (competitive)",
    goal: "≤2:15:00 / ~24.9+ mph (podium)",
  }),
  objective("seed-bike-13", "bike", "56 miles + successful transition run", 12),
  objective("seed-bike-14", "bike", "Race power target maintained with <5–7% late-session fade", 13),

  objective("seed-run-1", "run", "Establish current aerobic HR/pace baseline", 0),
  objective("seed-run-2", "run", "Establish current 5K benchmark", 1),
  objective("seed-run-3", "run", "Establish threshold pace", 2),
  objective("seed-run-4", "run", "Run 60 min Z2 with <5% HR/pace drift", 3),
  objective("seed-run-5", "run", "Sub-25 5K", 4),
  objective("seed-run-6", "run", "Sub-23 5K", 5),
  objective("seed-run-7", "run", "Controlled 10K at target training pace", 6),
  objective("seed-run-8", "run", "10 miles aerobic without pace decay", 7),
  objective("seed-run-9", "run", "13.1 miles controlled", 8, "not_started", "Race distance", {
    historical: "1:17:09–1:26:41 (2023 & 2025 M35–39 winners)",
    current: "TBD",
    next: "1:25:00–1:30:00 / 6:29–6:52 per mi (competitive)",
    goal: "≤1:20:00 / ~6:06 per mi (podium)",
  }),
  objective("seed-run-10", "run", "Run 30 min off bike within ~10% of fresh aerobic pace", 9),
  objective("seed-run-11", "run", "Run 60 min off bike with stable HR and pace", 10),
  objective(
    "seed-run-12",
    "run",
    "Target 70.3 half-marathon pace demonstrated in race-simulation brick",
    11,
    "not_started",
    null,
    {
      current: "TBD",
      next: "1:25:00–1:30:00 off bike (competitive)",
      goal: "1:20:00–1:25:00 off bike (podium) — requires an open half well under 1:20",
    },
  ),

  objective("seed-brick-1", "brick", "First bike → run", 0),
  objective("seed-brick-2", "brick", "60m bike + 15m run — smooth transition, no HR spike", 1),
  objective(
    "seed-brick-3",
    "brick",
    "90m bike + 30m run — run pace within 10% of fresh aerobic pace",
    2,
  ),
  objective("seed-brick-4", "brick", "2h bike + 30m run — fueling executed correctly", 3),
  objective("seed-brick-5", "brick", "3h bike + 45m run — no major pace decay", 4),
  objective(
    "seed-brick-6",
    "brick",
    "Race-specific brick — target bike effort + target run effort + full fueling plan",
    5,
  ),

  objective("seed-vo2max-1", "vo2max", "37", 0, "done", "One month ago"),
  objective("seed-vo2max-2", "vo2max", "38", 1, "done", "Two weeks ago"),
  objective("seed-vo2max-3", "vo2max", "40", 2, "done", "Current"),
  objective("seed-vo2max-4", "vo2max", "42", 3),
  objective("seed-vo2max-5", "vo2max", "45", 4),
  objective("seed-vo2max-6", "vo2max", "50", 5),

  objective("seed-strength-1", "strength", "Establish Phase 2 strength baselines", 0, "in_progress"),
  objective(
    "seed-strength-2",
    "strength",
    "Maintain ≥90% of baseline strength as endurance volume rises",
    1,
  ),
  objective("seed-strength-3", "strength", "Maintain lean/muscular body composition", 2),
  objective(
    "seed-strength-4",
    "strength",
    "Complete two strength sessions/week for 8 consecutive weeks",
    3,
  ),
  objective(
    "seed-strength-5",
    "strength",
    "No endurance-session degradation caused by strength programming",
    4,
  ),

  objective("seed-race-1", "race_readiness", "Pool race distance complete", 0),
  objective("seed-race-2", "race_readiness", "Open-water race distance complete", 1),
  objective("seed-race-3", "race_readiness", "56-mile bike complete at controlled race effort", 2),
  objective("seed-race-4", "race_readiness", "13.1-mile run complete aerobically", 3),
  objective("seed-race-5", "race_readiness", "Fueling plan validated at ≥3 hours", 4),
  objective("seed-race-6", "race_readiness", "Transitions rehearsed", 5, "not_started", null, {
    current: "TBD",
    next: "6:00 or less combined (competitive)",
    goal: "5:00 or less combined (podium)",
  }),
  objective("seed-race-7", "race_readiness", "Wetsuit/open-water competency established", 6),
  objective("seed-race-8", "race_readiness", "Aero position sustainable for race-duration blocks", 7),
  objective("seed-race-9", "race_readiness", "Race-simulation brick completed", 8),
  objective(
    "seed-race-10",
    "race_readiness",
    "Four-week pre-race benchmark block completed without injury",
    9,
  ),
  objective("seed-race-11", "race_readiness", "Overall finish time", 10, "not_started", null, {
    historical: "4:04:51–4:27:25 (2023 top-9, M35–39); 2025 not directly comparable — no swim leg held",
    current: "TBD",
    next: "4:15:00–4:25:00 (competitive)",
    goal: "~4:05:00–4:15:00 (podium)",
  }),
  objective("seed-race-12", "race_readiness", "IRONMAN 70.3 Chattanooga — 70.3 miles", 11, "goal"),
];

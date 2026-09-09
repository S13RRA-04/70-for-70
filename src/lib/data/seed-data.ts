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
  PerformanceSnapshotRow,
  PostRow,
  RaffleItemRow,
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
    partner_type: "campaign-sponsor",
  },
  {
    id: "seed-mission-partner-bombs-and-blades",
    name: "Bombs & Blades Hot Sauce",
    relationship_label: "Raffle Supporter",
    description:
      "Alabama veteran-owned brand supporting the Tri For the 22 fundraising raffle with a donated Trinity Pack.",
    logo_url: "/partners/bombs-and-blades-logo.png",
    logo_light_url: null,
    logo_dark_url: null,
    logo_background: null,
    website_url: "https://bombsandblades.com",
    support_type: null,
    geographic_scope: null,
    active: true,
    display_order: 0,
    agreement_status: null,
    logo_permission: true,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
    partner_type: "raffle-supporter",
  },
  {
    id: "seed-mission-partner-fire-department-coffee",
    name: "Fire Department Coffee",
    relationship_label: "Raffle Supporter",
    description:
      "Veteran-owned coffee brand supporting the Tri For the 22 fundraising raffle with donated gift cards.",
    logo_url: "/partners/fire-department-coffee-logo.png",
    logo_light_url: null,
    logo_dark_url: null,
    logo_background: null,
    website_url: "https://www.firedeptcoffee.com/",
    support_type: null,
    geographic_scope: null,
    active: true,
    display_order: 1,
    agreement_status: null,
    logo_permission: true,
    relationship_start: null,
    relationship_end: null,
    associated_campaigns: null,
    partner_type: "raffle-supporter",
  },
];

export const SEED_RAFFLE_ITEMS: RaffleItemRow[] = [
  {
    id: "seed-raffle-item-bombs-and-blades-trinity-pack",
    created_at: now,
    display_order: 0,
    partner_id: "seed-mission-partner-bombs-and-blades",
    brand: "Bombs & Blades Hot Sauce",
    item_name: "Trinity Pack — three-pack of Bombs & Blades hot sauces",
    quantity: 1,
    retail_value_min: 35,
    retail_value_max: 40,
    image_url: null,
    status: "confirmed",
    website_url: "https://bombsandblades.com",
    donor_note: null,
    featured: false,
  },
  {
    id: "seed-raffle-item-fire-department-coffee-gift-card",
    created_at: now,
    display_order: 1,
    partner_id: "seed-mission-partner-fire-department-coffee",
    brand: "Fire Department Coffee",
    item_name: "$5 Gift Card",
    quantity: 3,
    retail_value_min: 5,
    retail_value_max: 5,
    image_url: null,
    status: "confirmed",
    website_url: "https://www.firedeptcoffee.com/",
    donor_note: null,
    featured: false,
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
 * The real benchmark ladder shown on /the-race's Training Dashboard,
 * mirrored here as the offline/no-Supabase fallback so local dev without
 * a DB still matches production. Edited going forward via
 * /admin/training-objectives, not this file — see supabase/seed.sql for
 * the canonical fresh-provisioning version of the same data.
 *
 * Phase 2 ladder: every discipline runs Competency → Economy → Speed →
 * Durability → Podium-specific race execution, recalibrated against real
 * M35–39 Chattanooga results (2023 + 2025 — see race-goal.ts /
 * race-benchmarks.ts) rather than generic "finish the distance" rungs.
 * tag "Competitive" / "Stretch Target" marks the two race-pace tiers a
 * split ladder ends on — the checklist only applies special styling to
 * the latter, not every row.
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
  objective("seed-swim-1", "swim", "50 yd comfortable/repeatable", 0, "done"),
  objective("seed-swim-2", "swim", "200 yd continuous", 1, "done"),
  objective("seed-swim-3", "swim", "400 yd continuous", 2, "done"),
  objective("seed-swim-4", "swim", "750 yd continuous", 3, "done"),
  objective("seed-swim-5", "swim", "1,800 yd total session", 4, "done", "Current volume"),
  objective("seed-swim-6", "swim", "Establish repeatable 100 yd pace", 5),
  objective("seed-swim-7", "swim", "Complete CSS test: 400 yd + 200 yd", 6),
  objective("seed-swim-8", "swim", "8 × 100 yd within ±5 sec", 7),
  objective("seed-swim-9", "swim", "1,000 yd continuous at aerobic effort", 8),
  objective("seed-swim-10", "swim", "1,500 yd continuous with stable form", 9),
  objective("seed-swim-11", "swim", "2,112 yd continuous", 10),
  objective("seed-swim-12", "swim", "Open-water 1,000 yd with sighting", 11),
  objective("seed-swim-13", "swim", "Full-distance open-water swim", 12),
  objective("seed-swim-14", "swim", "1.2 mi race swim ≤32:00", 13, "not_started", null, {
    historical: "28:19 (2023 M35–39 winner)",
  }),
  objective("seed-swim-15", "swim", "Stretch-target swim ≤29:00", 14, "not_started", "Stretch Target"),

  objective("seed-bike-1", "bike", "Outdoor baseline: 9.06 mi / 12.1 mph / 412 ft", 0, "done"),
  objective("seed-bike-2", "bike", "Confident braking, shifting, cornering, descending", 1),
  objective("seed-bike-3", "bike", "60 min continuous mostly Z2", 2),
  objective("seed-bike-4", "bike", "Establish repeatable benchmark route", 3),
  objective("seed-bike-5", "bike", "14 mph benchmark at controlled HR", 4),
  objective("seed-bike-6", "bike", "16 mph benchmark at controlled HR", 5),
  objective("seed-bike-7", "bike", "Install power meter", 6),
  objective("seed-bike-8", "bike", "Establish FTP", 7),
  objective("seed-bike-9", "bike", "FTP ≥2.5 W/kg", 8),
  objective("seed-bike-10", "bike", "FTP ≥3.0 W/kg", 9),
  objective("seed-bike-11", "bike", "FTP ≥3.5 W/kg stretch target", 10, "not_started", "Stretch Target"),
  objective("seed-bike-12", "bike", "Hold aero position 20 min continuously", 11),
  objective("seed-bike-13", "bike", "Hold aero position 60 min without meaningful power loss", 12),
  objective("seed-bike-14", "bike", "40 mi controlled with fueling executed", 13),
  objective("seed-bike-15", "bike", "56 mi at planned race effort", 14),
  objective("seed-bike-16", "bike", "56 mi + successful transition run", 15),
  objective("seed-bike-17", "bike", "70.3 bike split ≤2:25 competitive", 16, "not_started", "Competitive", {
    historical: "2:10:23–2:14:36 (2023 & 2025 M35–39 winners)",
  }),
  objective("seed-bike-18", "bike", "Stretch-target bike split ≤2:15", 17, "not_started", "Stretch Target"),

  objective("seed-run-1", "run", "Establish aerobic HR/pace baseline", 0),
  objective("seed-run-2", "run", "Establish current 5K benchmark", 1),
  objective("seed-run-3", "run", "Establish threshold pace", 2),
  objective("seed-run-4", "run", "60 min Z2 with <5% HR/pace drift", 3),
  objective("seed-run-5", "run", "Sub-25:00 5K", 4),
  objective("seed-run-6", "run", "Sub-23:00 5K", 5),
  objective("seed-run-7", "run", "Sub-21:00 5K", 6),
  objective("seed-run-8", "run", "Sub-20:00 5K stretch target", 7, "not_started", "Stretch Target"),
  objective("seed-run-9", "run", "Controlled 10K at target training pace", 8),
  objective("seed-run-10", "run", "10 mi aerobic without pace decay", 9),
  objective("seed-run-11", "run", "Open half marathon <1:40", 10),
  objective("seed-run-12", "run", "Open half marathon <1:30 stretch target", 11, "not_started", "Stretch Target"),
  objective("seed-run-13", "run", "30 min off bike within 10% of fresh aerobic pace", 12),
  objective("seed-run-14", "run", "60 min off bike with stable HR and pace", 13),
  objective("seed-run-15", "run", "70.3 run ≤1:30 competitive", 14, "not_started", "Competitive", {
    historical: "1:17:09–1:26:41 (2023 & 2025 M35–39 winners)",
  }),
  objective("seed-run-16", "run", "Stretch-target 70.3 run ≤1:20–1:25", 15, "not_started", "Stretch Target"),

  objective("seed-brick-1", "brick", "First bike → run transition", 0),
  objective("seed-brick-2", "brick", "60 min bike + 15 min run with smooth transition", 1),
  objective(
    "seed-brick-3",
    "brick",
    "90 min bike + 30 min run with run pace within 10% of fresh aerobic pace",
    2,
  ),
  objective("seed-brick-4", "brick", "2 hr bike + 30 min run with fueling executed correctly", 3),
  objective("seed-brick-5", "brick", "3 hr bike + 45 min run with no major pace decay", 4),
  objective("seed-brick-6", "brick", "Race-specific brick at projected bike and run effort", 5),
  objective(
    "seed-brick-7",
    "brick",
    "Race-simulation brick with full fueling, transitions, and aero execution",
    6,
  ),
  objective("seed-brick-8", "brick", "Race simulation completed with <5–7% late-session fade", 7),

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
    "Track bench/push, pull-up or pulldown, row, overhead press, hinge/RDL, and split squat/leg press",
    1,
  ),
  objective(
    "seed-strength-3",
    "strength",
    "Maintain ≥90% of baseline strength as endurance volume rises",
    2,
  ),
  objective(
    "seed-strength-4",
    "strength",
    "Complete 2 strength/cross-training sessions per week for 8 consecutive weeks",
    3,
  ),
  objective("seed-strength-5", "strength", "Maintain muscular body composition", 4),
  objective(
    "seed-strength-6",
    "strength",
    "No endurance-session degradation caused by strength programming",
    5,
  ),

  objective("seed-race-1", "race_readiness", "Full-distance pool swim complete", 0),
  objective("seed-race-2", "race_readiness", "Full-distance open-water swim complete", 1),
  objective("seed-race-3", "race_readiness", "56 mi bike complete at controlled race effort", 2),
  objective("seed-race-4", "race_readiness", "13.1 mi run complete aerobically", 3),
  objective("seed-race-5", "race_readiness", "Race fueling plan validated for 3+ hr", 4),
  objective("seed-race-6", "race_readiness", "Aero position sustainable for race-duration blocks", 5),
  objective("seed-race-7", "race_readiness", "Transitions rehearsed", 6),
  objective("seed-race-8", "race_readiness", "Wetsuit/open-water competency established", 7),
  objective("seed-race-9", "race_readiness", "Full race-simulation brick completed", 8),
  objective("seed-race-10", "race_readiness", "Full-distance swim at target race pace", 9),
  objective("seed-race-11", "race_readiness", "56 mi bike at target race effort", 10),
  objective("seed-race-12", "race_readiness", "60 min post-bike run at target race effort", 11),
  objective(
    "seed-race-13",
    "race_readiness",
    "Stretch-target overall capability: ~4:05–4:15",
    12,
    "not_started",
    "Stretch Target",
    {
      historical: "4:04:51–4:27:25 (2023 top-9, M35–39); 2025 not directly comparable — no swim leg held",
    },
  ),
  objective("seed-race-14", "race_readiness", "IRONMAN 70.3 Chattanooga completed", 13, "goal"),
];

function snapshot(
  id: string,
  recorded_on: string,
  category: PerformanceSnapshotRow["category"],
  metric_key: string,
  label: string,
  value_display: string,
  display_order: number,
  options: { numeric?: number; unit?: string; measured?: boolean } = {},
): PerformanceSnapshotRow {
  return {
    id,
    recorded_on,
    category,
    metric_key,
    label,
    value_display,
    value_numeric: options.numeric ?? null,
    unit: options.unit ?? null,
    is_measured: options.measured ?? true,
    display_order,
    created_at: now,
  };
}

/** Mirrors supabase/2026-09-08-performance-snapshots.sql's first dated row set — see that file for the full rationale. */
export const SEED_PERFORMANCE_SNAPSHOTS: PerformanceSnapshotRow[] = [
  snapshot("seed-perf-swim-1", "2026-09-08", "swim", "swim_pace_100yd", "Repeatable 100 yd Pace", "1:58/100 yd", 0, {
    numeric: 118,
    unit: "sec/100yd",
  }),
  snapshot(
    "seed-perf-swim-2",
    "2026-09-08",
    "swim",
    "swim_pace_100yd_avg",
    "Latest 10×100 Average",
    "1:58.3/100 yd",
    1,
    { numeric: 118.3, unit: "sec/100yd" },
  ),
  snapshot("seed-perf-swim-3", "2026-09-08", "swim", "swim_pace_fastest", "Fastest 100", "1:55/100 yd", 2, {
    numeric: 115,
    unit: "sec/100yd",
  }),
  snapshot("seed-perf-swim-4", "2026-09-08", "swim", "swim_pace_range", "Latest Range", "1:55–2:02", 3),
  snapshot(
    "seed-perf-swim-5",
    "2026-09-08",
    "swim",
    "swim_pace_previous",
    "Previous Benchmark",
    "~2:04/100 yd",
    4,
    { numeric: 124, unit: "sec/100yd" },
  ),

  snapshot("seed-perf-bike-1", "2026-09-08", "bike", "bike_ftp_watts", "FTP", "143 W", 0, {
    numeric: 143,
    unit: "W",
  }),
  snapshot(
    "seed-perf-bike-2",
    "2026-09-08",
    "bike",
    "bike_20min_power_watts",
    "20-Minute Average Power",
    "151 W",
    1,
    { numeric: 151, unit: "W" },
  ),
  snapshot("seed-perf-bike-3", "2026-09-08", "bike", "bike_ftp_test_hr", "FTP Test Average HR", "167 bpm", 2, {
    numeric: 167,
    unit: "bpm",
  }),
  snapshot(
    "seed-perf-bike-4",
    "2026-09-08",
    "bike",
    "bike_ftp_test_cadence",
    "FTP Test Average Cadence",
    "76 rpm",
    3,
    { numeric: 76, unit: "rpm" },
  ),

  snapshot("seed-perf-ride-1", "2026-09-08", "ride", "ride_distance_mi", "Distance", "11.23 mi", 0, {
    numeric: 11.23,
    unit: "mi",
  }),
  snapshot("seed-perf-ride-2", "2026-09-08", "ride", "ride_moving_time", "Moving Time", "53:47", 1),
  snapshot("seed-perf-ride-3", "2026-09-08", "ride", "ride_avg_speed_mph", "Average Speed", "12.5 mph", 2, {
    numeric: 12.5,
    unit: "mph",
  }),
  snapshot("seed-perf-ride-4", "2026-09-08", "ride", "ride_max_speed_mph", "Max Speed", "27.5 mph", 3, {
    numeric: 27.5,
    unit: "mph",
  }),
  snapshot("seed-perf-ride-5", "2026-09-08", "ride", "ride_elevation_ft", "Elevation Gain", "407 ft", 4, {
    numeric: 407,
    unit: "ft",
  }),
  snapshot("seed-perf-ride-6", "2026-09-08", "ride", "ride_avg_hr", "Average HR", "143 bpm", 5, {
    numeric: 143,
    unit: "bpm",
  }),
  snapshot("seed-perf-ride-7", "2026-09-08", "ride", "ride_max_hr", "Max HR", "158 bpm", 6, {
    numeric: 158,
    unit: "bpm",
  }),
  snapshot("seed-perf-ride-8", "2026-09-08", "ride", "ride_relative_effort", "Relative Effort", "74", 7, {
    numeric: 74,
  }),
  snapshot("seed-perf-ride-9", "2026-09-08", "ride", "ride_zone2_pct", "Zone 2", "32.1%", 8, {
    numeric: 32.1,
    unit: "%",
  }),
  snapshot("seed-perf-ride-10", "2026-09-08", "ride", "ride_zone3_pct", "Zone 3", "65.7%", 9, {
    numeric: 65.7,
    unit: "%",
  }),
  snapshot(
    "seed-perf-ride-11",
    "2026-09-08",
    "ride",
    "ride_zone23_combined_pct",
    "Combined Z2/Z3",
    "97.8%",
    10,
    { numeric: 97.8, unit: "%" },
  ),

  snapshot("seed-perf-run-1", "2026-09-09", "run", "run_distance_mi", "Distance", "4.28 mi", 0, {
    numeric: 4.28,
    unit: "mi",
  }),
  snapshot("seed-perf-run-2", "2026-09-09", "run", "run_moving_time", "Moving Time", "45:09", 1),
  snapshot("seed-perf-run-3", "2026-09-09", "run", "run_avg_pace", "Average Pace", "10:32/mi", 2, {
    numeric: 632,
    unit: "sec/mi",
  }),
  snapshot("seed-perf-run-4", "2026-09-09", "run", "run_avg_hr", "Average HR", "145 bpm", 3, {
    numeric: 145,
    unit: "bpm",
  }),
  snapshot("seed-perf-run-5", "2026-09-09", "run", "run_max_hr", "Max HR", "165 bpm", 4, {
    numeric: 165,
    unit: "bpm",
  }),
  snapshot("seed-perf-run-6", "2026-09-09", "run", "run_elevation_ft", "Elevation Gain", "136 ft", 5, {
    numeric: 136,
    unit: "ft",
  }),
  snapshot("seed-perf-run-7", "2026-09-09", "run", "run_fastest_mile", "Fastest Mile Split", "9:00/mi", 6, {
    numeric: 540,
    unit: "sec/mi",
  }),
  snapshot(
    "seed-perf-run-8",
    "2026-09-09",
    "run",
    "run_tempo_pace",
    "Tempo Pace (work intervals)",
    "~8:10/mi",
    7,
    { numeric: 490, unit: "sec/mi" },
  ),
  snapshot(
    "seed-perf-run-9",
    "2026-09-09",
    "run",
    "run_predicted_5k",
    "Strava Predicted 5K",
    "28:06 (prediction)",
    8,
    { numeric: 1686, unit: "sec", measured: false },
  ),

  snapshot("seed-perf-aerobic-1", "2026-09-08", "aerobic", "vo2max", "Estimated VO2 Max", "41", 0, {
    numeric: 41,
    unit: "ml/kg/min",
  }),

  snapshot("seed-perf-tp-1", "2026-09-08", "trainingpeaks", "tp_fitness", "Fitness (CTL)", "15", 0, {
    numeric: 15,
    measured: false,
  }),
  snapshot("seed-perf-tp-2", "2026-09-08", "trainingpeaks", "tp_fatigue", "Fatigue (ATL)", "38", 1, {
    numeric: 38,
    measured: false,
  }),
  snapshot("seed-perf-tp-3", "2026-09-08", "trainingpeaks", "tp_form", "Form (TSB)", "-23", 2, {
    numeric: -23,
    measured: false,
  }),
  snapshot(
    "seed-perf-tp-4",
    "2026-09-08",
    "trainingpeaks",
    "tp_ramp_rate",
    "7-Day Fitness Ramp Rate",
    "+3",
    3,
    { numeric: 3, measured: false },
  ),
];

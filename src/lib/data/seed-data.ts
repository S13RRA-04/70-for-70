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
    website_url: "https://www.mightyoaksprograms.org/",
    donation_url:
      "https://my.onecause.com/fundraiser/organizations/90be7c03-c221-49a6-ba58-5993b28179c3/fundraisers/fundraiser:25d33d01-f349-491f-ab63-f283ebab0a33/personalfundraisers/personalfund:93a8c5a5-7777-4ca2-bcb6-6333dc8a1cf8",
    ein: null,
    nonprofit_status_verified: false,
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
    website_url: "https://www.projectechelon.org/",
    donation_url: null,
    ein: null,
    nonprofit_status_verified: false,
    active: true,
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
    website_url: "https://www.vetsau.org/",
    donation_url: "https://www.paypal.com/donate/?hosted_button_id=2YL6S962W4QGY",
    ein: null,
    nonprofit_status_verified: false,
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

// No posts yet. The Updates page and homepage teaser show polished empty
// states rather than placeholder posts — see app/updates/page.tsx and app/page.tsx.
export const SEED_POSTS: PostRow[] = [];

/**
 * Starter training-objective checklist for /updates — generic, standard
 * progression milestones toward a 70.3, not a claim about Cody's actual
 * training plan or progress (every objective starts uncompleted). Meant to
 * be edited (added to, removed, checked off) via /admin/training-objectives,
 * not treated as final content.
 */
export const SEED_TRAINING_OBJECTIVES: TrainingObjectiveRow[] = [
  { id: "seed-swim-1", discipline: "swim", label: "Swim 500 yards continuously", display_order: 0, completed: false, completed_at: null, created_at: now },
  { id: "seed-swim-2", discipline: "swim", label: "Complete a 1-mile open water swim", display_order: 1, completed: false, completed_at: null, created_at: now },
  { id: "seed-swim-3", discipline: "swim", label: "Swim the full 1.2-mile race distance", display_order: 2, completed: false, completed_at: null, created_at: now },
  { id: "seed-swim-4", discipline: "swim", label: "Complete a swim-to-bike brick workout", display_order: 3, completed: false, completed_at: null, created_at: now },

  { id: "seed-bike-1", discipline: "bike", label: "Complete a 25-mile ride", display_order: 0, completed: false, completed_at: null, created_at: now },
  { id: "seed-bike-2", discipline: "bike", label: "Complete a 40-mile ride", display_order: 1, completed: false, completed_at: null, created_at: now },
  { id: "seed-bike-3", discipline: "bike", label: "Ride the full 56-mile race distance", display_order: 2, completed: false, completed_at: null, created_at: now },
  { id: "seed-bike-4", discipline: "bike", label: "Complete a bike-to-run brick workout", display_order: 3, completed: false, completed_at: null, created_at: now },

  { id: "seed-run-1", discipline: "run", label: "Run a 10K", display_order: 0, completed: false, completed_at: null, created_at: now },
  { id: "seed-run-2", discipline: "run", label: "Run a half marathon (13.1 mi)", display_order: 1, completed: false, completed_at: null, created_at: now },
  { id: "seed-run-3", discipline: "run", label: "Run a long run off a long bike ride", display_order: 2, completed: false, completed_at: null, created_at: now },
  { id: "seed-run-4", discipline: "run", label: "Run the full half marathon off the bike leg", display_order: 3, completed: false, completed_at: null, created_at: now },
];

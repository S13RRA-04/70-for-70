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
  PartnerRow,
  PostRow,
  SponsorRow,
} from "@/types/database";

const now = new Date().toISOString();

export const SEED_CAMPAIGN: CampaignRow = {
  id: "seed-campaign",
  name: "70 for 70",
  fundraising_goal: 70_000,
  amount_raised: 0,
  race_distance: 70.3,
  race_date: null,
  race_location: null,
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
      "TODO — replace with approved description of Mighty Oaks Foundation's mission and programs.",
    logo_url: null,
    website_url: null,
    donation_url: null,
    active: true,
  },
  {
    id: "seed-partner-project-echelon",
    name: "Project Echelon",
    description:
      "TODO — replace with approved description of Project Echelon's mission and programs.",
    logo_url: null,
    website_url: null,
    donation_url: null,
    active: true,
  },
];

export const SEED_SPONSORS: SponsorRow[] = [
  {
    id: "seed-sponsor-presenting",
    name: "[Presenting Sponsor — sample]",
    tier: "presenting",
    contribution_value: 10_000,
    logo_url: null,
    website_url: null,
    description: "Sample sponsor shown for layout preview only.",
    active: true,
    sponsorship_request_id: null,
    display_order: 1,
  },
  {
    id: "seed-sponsor-mission",
    name: "[Mission Sponsor — sample]",
    tier: "mission",
    contribution_value: 5_000,
    logo_url: null,
    website_url: null,
    description: "Sample sponsor shown for layout preview only.",
    active: true,
    sponsorship_request_id: null,
    display_order: 2,
  },
  {
    id: "seed-sponsor-supporting",
    name: "[Supporting Sponsor — sample]",
    tier: "supporting",
    contribution_value: 2_500,
    logo_url: null,
    website_url: null,
    description: "Sample sponsor shown for layout preview only.",
    active: true,
    sponsorship_request_id: null,
    display_order: 3,
  },
  {
    id: "seed-sponsor-mile",
    name: "[Mile Sponsor — sample]",
    tier: "mile",
    contribution_value: 1_000,
    logo_url: null,
    website_url: null,
    description: "Sample sponsor shown for layout preview only.",
    active: true,
    sponsorship_request_id: null,
    display_order: 4,
  },
];

export const SEED_POSTS: PostRow[] = [
  {
    id: "seed-post-1",
    title: "TODO — Campaign kickoff post title",
    slug: "campaign-kickoff",
    summary: "TODO — one to two sentence summary of the kickoff update.",
    body: "TODO — full body copy for the campaign kickoff update.",
    image_url: null,
    category: "Fundraising",
    published_at: now,
    featured: true,
    published: true,
    training_metrics: null,
  },
  {
    id: "seed-post-2",
    title: "TODO — First training block recap",
    slug: "first-training-block-recap",
    summary: "TODO — summary of early swim/bike/run training progress.",
    body: "TODO — full training recap body copy.",
    image_url: null,
    category: "Training",
    published_at: now,
    featured: false,
    published: true,
    training_metrics: { "Swim (wk)": "3 sessions", "Bike (wk)": "4 sessions", "Run (wk)": "3 sessions" },
  },
  {
    id: "seed-post-3",
    title: "TODO — Why Mighty Oaks and Project Echelon",
    slug: "why-these-partners",
    summary: "TODO — summary explaining the choice of beneficiary organizations.",
    body: "TODO — full body copy on the partner organizations.",
    image_url: null,
    category: "Mighty Oaks",
    published_at: now,
    featured: false,
    published: true,
    training_metrics: null,
  },
];

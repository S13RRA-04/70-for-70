-- Journal announcement: Tri For The 22 selected as a 2026 USA Triathlon
-- Together We Thrive Grant Recipient. Linked from the Tri homepage
-- recognition block and the /the-race callout via
-- USAT_TOGETHER_WE_THRIVE_2026.detailsHref (src/lib/content/recognitions.ts)
-- — keep the slug in sync with that constant. Grant support, not a
-- sponsorship: USA Triathlon is intentionally NOT added to
-- mission_partners. Safe to re-run.

insert into public.journal_entries
  (post_type, primary_category, tags, title, slug, summary, body, status, published_at, featured, image_url, image_alt)
values (
  'article',
  'Campaign',
  array['USA Triathlon', 'Grant', 'Together We Thrive', 'Recognition'],
  'Tri For The 22 Selected for USA Triathlon Together We Thrive Grant',
  'tri-for-the-22-selected-for-usa-triathlon-together-we-thrive-grant',
  'USA Triathlon has selected For The 22 as a 2026 Together We Thrive grant recipient, awarding $1,500 to help expand access to multisport through Tri For The 22.',
  $body$USA Triathlon has selected For The 22 as a **2026 USA Triathlon Together We Thrive Grant Recipient**, awarding $1,500 to support pathways to access and inclusion in multisport through Tri For The 22.

I'm grateful — to USA Triathlon for seeing something worth investing in, and to everyone who has supported this campaign so far. This grant doesn't belong to me. It belongs to the mission, and to every veteran, first responder, and family member this campaign exists for.

## What the grant supports

USA Triathlon approved the funding for the things that keep people out of the sport in the first place:

- **Race entries**
- **Essential swim, bike, and run gear**
- **Training**
- **USA Triathlon memberships**

Those costs add up fast, and they're a real barrier. Getting to a start line shouldn't depend on whether someone can afford one.

## Why it matters

Tri For The 22 started as one person's road to IRONMAN 70.3 Chattanooga. The goal has always been bigger than one finish line: use endurance sport to draw attention to the veterans, first responders, and families still carrying things most people never see — and to point people toward the organizations already doing the work.

Together We Thrive is about opening multisport up to more people. That fits. Endurance sport helped me find a way forward, and I want that door open wider for the people this mission serves.

## What this is — and isn't

This is grant support for Tri For The 22 specifically. It isn't a sponsorship, and it isn't an endorsement of every For The 22 program. Donations to the campaign still go directly to our confirmed beneficiaries.

Thank you, USA Triathlon. We'll make it count — one mile at a time.$body$,
  'published',
  '2026-10-14T12:00:00-05:00',
  false,
  '/journal/usa-triathlon-grant/usa-triathlon-together-we-thrive.jpg',
  'USA Triathlon logo — Tri For The 22 is a 2026 Together We Thrive Grant Recipient'
)
on conflict (slug) do update set
  post_type = excluded.post_type,
  primary_category = excluded.primary_category,
  tags = excluded.tags,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  status = excluded.status,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  updated_at = now();

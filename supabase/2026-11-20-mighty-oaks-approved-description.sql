-- Mighty Oaks Foundation's own approved description, from the
-- "Mighty Oaks x For the 22 Partnership" one-pager they supplied (Nov. 2026).
--
-- what_they_do: their "Who we are / What we do" copy, condensed to one
--   paragraph, in third person. Was null (hidden) pending this approval.
-- description:  their "Supporting the mission" copy. Replaces the retired
--   "That's why Mighty Oaks is part of Tri For The 22." line.
--
-- Idempotent: re-running sets the same values.

update public.partners
set
  what_they_do = 'Mighty Oaks Foundation is a Christ-centered nonprofit dedicated to restoring hope and transforming the lives of America''s military service members, veterans, first responders, and their families. Its faith-based, peer-led Legacy Programs and Resiliency Events bring Warriors together in an environment of trust, accountability, and brotherhood — equipping them with the biblical principles, practical tools, and lasting relationships to overcome life''s challenges, restore broken relationships, and lead lives of purpose.',
  description = 'For The 22 is independently raising funds in support of Mighty Oaks Foundation and the Warriors and families it serves. Every dollar donated to Mighty Oaks through this effort helps make its programs possible — giving Warriors the opportunity to find hope, experience restoration, and discover renewed purpose.'
where name = 'Mighty Oaks Foundation';

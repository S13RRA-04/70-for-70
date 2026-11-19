-- Promote only records whose provider-owned pages were reviewed on 2026-11-19.
-- Four retired/unverifiable services are handled separately below.
update public.resource_records
set verification_status = 'reviewed',
    last_verified_at = date '2026-11-19',
    verification_source = url,
    verification_notes = 'Provider-owned page reviewed for organization identity and listed service evidence.',
    broken_link = false,
    updated_at = now()
where verification_status = 'pending-review'
  and resource_key not in (
    'operation-code',
    'rallypoint',
    'the-mission-continues',
    'us-military-endurance-sports-usmes'
  );

-- Earlier dated reviews were performed against the listed provider URL but
-- predated the structured verification_source column.
update public.resource_records
set verification_source = url,
    updated_at = now()
where is_active
  and verification_status in ('verified', 'reviewed')
  and last_verified_at is not null
  and verification_source is null;

-- Correct official domains that moved while the bundled directory was in use.
update public.resource_records
set url = 'https://militarychild.org/',
    verification_source = 'https://militarychild.org/',
    updated_at = now()
where resource_key = 'military-child-education-coalition';

update public.resource_records
set url = 'https://vetsintech.co/',
    verification_source = 'https://vetsintech.co/',
    updated_at = now()
where resource_key = 'vetsintech';

-- Do not expose services without a current provider-owned service endpoint.
update public.resource_records
set is_active = false,
    broken_link = true,
    needs_re_review = true,
    verification_status = 'information-incomplete',
    last_verified_at = date '2026-11-19',
    verification_notes = case resource_key
      when 'rallypoint' then 'Retired: the former military network is offline and the domain serves an unrelated financial site.'
      when 'the-mission-continues' then 'Retired: acquired by Travis Manion Foundation; the former service now redirects to the acquiring organization.'
      else 'Retired from public results: no reachable current provider-owned service page was found.'
    end,
    updated_at = now()
where resource_key in (
  'operation-code',
  'rallypoint',
  'the-mission-continues',
  'us-military-endurance-sports-usmes'
);


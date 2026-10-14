# For The 22 shared design system

The four public properties share structure and behavior. Property identity is
applied once by `src/app/layout.tsx` through `data-property`; pages must not
recreate hostname checks or private color systems.

## Foundations

- Palette ("Steady Ground · Brand Edition"): each ring color does one job —
  `navy` primary/structure, `olive` campaigns, `help` crisis and resource
  finding only, `impact` green for raised totals and outcomes, `gold` small
  highlights on navy only, `purpose` red as an accent never a fill, `jet`
  for the remembrance band. Paper (`off-white`/`paper`) is the base. The
  legacy ink/charcoal/sand/bronze names are remapped onto this palette in
  `globals.css`; `bronze` is context-aware (steel/olive on paper, gold
  inside dark bands). The full ring set appears together only in
  `BrandStripe`.
- Typography: Public Sans for body copy, Anton (single weight) for display
  copy. Use `text-display`, `text-section`, `text-subsection`, and the
  hero steps; `label-caps` for tracked eyebrows; `text-outline` and
  `text-worn` for the outlined/worn hero treatments.
- Radii: 8px controls (`rounded-sm`), 12px cards (`rounded-xl`, `ui-card`).
- Spacing: use `section`, `section-tight`, and `stack` spacing tokens for major
  vertical rhythm. Small component spacing continues to use Tailwind's base
  scale.
- Breakpoints: Tailwind `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Do not add
  component-local media-query thresholds.
- Motion: `motion-fast`, `motion-ui`, and `motion-narrative`, all with
  `ease-system`. Motion must remain optional and respect reduced motion.

## Shared components

- Buttons: `CTAButton` owns primary, secondary, and ghost actions.
- Cards: `Card` owns structural surfaces. Feature components provide content,
  not new border/radius/shadow systems.
- Page openers: `PageHero` for org pages — pillar eyebrow, worn Anton H1,
  intro, optional actions/aside. Pick the page's pillar: `connection` (help
  blue: resources, crisis, standards), `mobilization` (olive: campaigns,
  network, awareness, store), `impact` (green: impact, $70K, transparency), or
  `neutral` (steel: about, mission, press, legal). Campaign subpages use
  `CampaignPageHero` (navy band) with `SectionHeading as="h1"`.
- Headings: `SectionHeading` owns page-section title hierarchy; `as="h1"`
  renders at hero scale with the worn texture.
- Closing bands: `CTASection` — navy ("dark") or white with brush edge ("light").
- Metrics: `MetricGrid` + `StatCard`; campaign fundraising uses
  `MissionProgress`/`CampaignProgress`.
- Beneficiaries: `PartnerCard`.
- Campaign partners: `MissionPartnerCard`.
- Navigation and footer: `Header` and `Footer` only.
- Motion: `RevealOnScroll`, `RevealGrid`, and the shared motion tokens.

## Property flavors

| Property | Emphasis |
| --- | --- |
| `org` | Paper and navy, steel accents |
| `tri` | Paper and navy, olive accents |
| `ruck` | Paper and navy, olive accents and olive actions |
| `22` | Paper and navy, olive accents |
| `live` | Dark surfaces, gold accents |

Use `property-*` semantic utilities. Raw palette colors remain available for
meaningful fixed roles such as emergency actions, beneficiary allocation
segments, and service-ring identification.

# For The 22 shared design system

The four public properties share structure and behavior. Property identity is
applied once by `src/app/layout.tsx` through `data-property`; pages must not
recreate hostname checks or private color systems.

## Foundations

- Typography: Inter for body copy, Oswald for display copy. Use `text-display`,
  `text-section`, `text-subsection`, and the existing hero steps.
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
- Headings: `SectionHeading` owns page-section title hierarchy.
- Metrics: `MetricGrid` + `StatCard`; campaign fundraising uses
  `MissionProgress`/`CampaignProgress`.
- Beneficiaries: `PartnerCard`.
- Campaign partners: `MissionPartnerCard`.
- Navigation and footer: `Header` and `Footer` only.
- Motion: `RevealOnScroll`, `RevealGrid`, and the shared motion tokens.

## Property flavors

| Property | Emphasis |
| --- | --- |
| `org` | Ink, off-white, bronze; institutional/editorial |
| `tri` | Ink and bronze; athletic/data-driven |
| `ruck` | Ink, olive, sand; rugged/community |
| `live` | Ink and bronze; dark/event-driven |

Use `property-*` semantic utilities. Raw palette colors remain available for
meaningful fixed roles such as emergency actions, beneficiary allocation
segments, and service-ring identification.

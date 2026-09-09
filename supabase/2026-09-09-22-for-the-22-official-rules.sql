-- One-time migration: sets public.event_config.official_rules_body for the
-- 2026 22-for-the-22 event to the finalized Official Rules copy, overriding
-- the hardcoded placeholder scaffold (EVENT_RULES_PLACEHOLDER_SECTIONS) on
-- /22forthe22/rules. Every field is filled except the prize list/ARVs,
-- which stay dynamic (pulled from public.giveaway_prizes) rather than
-- hardcoded into this text. Run this manually, once, against the live
-- Supabase project.

begin;

update public.event_config
set official_rules_body = '**NO PURCHASE OR DONATION NECESSARY TO ENTER OR WIN. A PURCHASE OR DONATION WILL NOT INCREASE YOUR CHANCES OF WINNING.**

## Sponsor / Administrator

The Tri For the 22 Free Giveaway Sweepstakes ("Sweepstakes") is sponsored and administered by Cody Hitson, founder of Tri For the 22, Huntsville, Alabama, USA ("Sponsor").

Questions regarding the Sweepstakes may be submitted through the contact information provided at tri.forthe22.org.

Tri For the 22 supports charitable organizations through its broader fundraising campaign. Participation in this Sweepstakes is free and is not conditioned upon making a donation or otherwise financially supporting the campaign.

## Eligibility

The Sweepstakes is open to legal residents of the 50 United States and the District of Columbia who satisfy all eligibility requirements contained in these Official Rules.

Employees, contractors, household members, and immediate family members of the Sponsor, as well as individuals directly involved in administering or selecting winners for the Sweepstakes, are not eligible to enter.

Prize-donating companies are not sponsors or administrators of the Sweepstakes unless expressly identified as such.

## Age Requirement

Entrants must be 18 years of age or older and have reached the age of majority in their state of residence at the time of entry.

## Geographic Eligibility

The Sweepstakes is open to legal residents of the 50 United States and the District of Columbia.

Void where prohibited or restricted by law.

## Entry Period

The Sweepstakes begins at 2:47 p.m. Central Time on September 9, 2026 and ends at 9:59 a.m. Central Time on November 21, 2026 ("Entry Period").

The Sponsor''s website or registration system will serve as the official timekeeping device for the Sweepstakes.

## Free Method of Entry

**NO PURCHASE OR DONATION NECESSARY TO ENTER OR WIN. A PURCHASE OR DONATION WILL NOT INCREASE YOUR CHANCES OF WINNING.**

During the Entry Period, eligible individuals may enter by visiting the official Tri For the 22 Giveaway page at [https://tri.forthe22.org/22forthe22](https://tri.forthe22.org/22forthe22) and completing and submitting the official entry form.

Entrants must provide the information requested on the entry form accurately and completely.

No purchase, donation, payment, fundraising contribution, merchandise purchase, social-media engagement, or other financial consideration is required to enter.

Making a donation to Tri For the 22 or any organization supported by the campaign will not provide an entrant with additional entries, preferential treatment, or increased odds of winning.

## One-Entry-Per-Person / Final Entry Rules

Limit one entry per person during the Entry Period.

Multiple entries submitted by the same individual using multiple email addresses, identities, accounts, or other methods may be disqualified.

Only complete, eligible entries received during the Entry Period will be included in the final drawing.

The Sponsor reserves the right to remove entries reasonably determined to be fraudulent, automated, duplicated, incomplete, or otherwise in violation of these Official Rules.

## Winner Selection Process

Following the close of the Entry Period, one winner will be selected by random drawing from all eligible entries received.

The drawing will be conducted by the Sponsor using a neutral computerized random-selection method.

The drawing is expected to occur within seven calendar days following the end of the Entry Period.

The Sponsor''s decisions regarding eligibility and winner selection are final, subject to applicable law.

## Prize Descriptions

The winner will receive the Tri For the 22 Giveaway Prize Package, consisting of products, merchandise, gift cards, and other items donated by participating campaign supporters.

The final prize package, participating brands, individual prize descriptions, and Approximate Retail Values ("ARV") will be posted on the official Giveaway page before the Sweepstakes begins.

The total ARV of the prize package will also be stated on the Giveaway page and incorporated into these Official Rules by reference.

Prize donors are independent supporters of the Tri For the 22 campaign and are not sponsors, administrators, or operators of the Sweepstakes unless expressly identified otherwise.

No cash substitution will be provided except at the Sponsor''s discretion. If an advertised prize becomes unavailable, the Sponsor may substitute an item of equal or greater approximate retail value.

## Odds

The odds of winning depend upon the total number of eligible entries received during the Entry Period.

Each eligible entry has an equal chance of being selected.

## Winner Notification

The potential winner will be notified using the email address provided on the official entry form.

The potential winner must respond within 72 hours of the initial notification.

The Sponsor may require the potential winner to confirm eligibility, provide a valid mailing address, and complete reasonable prize-acceptance or eligibility documentation before the prize is awarded.

Failure to respond within 72 hours, inability to verify eligibility, or failure to comply with these Official Rules may result in forfeiture of the prize.

## Alternate Winner Process

If the initially selected potential winner cannot be contacted, does not respond within 72 hours, is determined to be ineligible, declines the prize, or otherwise fails to comply with these Official Rules, the Sponsor may randomly select an alternate potential winner from the remaining eligible entries.

This process may continue until an eligible winner accepts the prize or the Sponsor determines that further attempts are impractical.

## Publicity Permissions

Except where prohibited by law, acceptance of a prize constitutes permission for the Sponsor to publicly identify the winner by first name, last initial, city, and state in connection with announcing the Sweepstakes results.

Any additional use of the winner''s photograph, likeness, testimonial, or personal story for promotional purposes will require the winner''s separate consent.

## Liability Limitations

By entering, entrants agree to comply with these Official Rules.

To the fullest extent permitted by applicable law, entrants agree that the Sponsor, Tri For the 22, participating prize donors, campaign supporters, service providers, and their respective representatives are not responsible for lost, late, incomplete, corrupted, misdirected, delayed, or technically unsuccessful entries resulting from circumstances outside their reasonable control.

The Sponsor is not responsible for interruptions, failures, errors, or delays involving internet service, email systems, hosting providers, website systems, or other third-party technology.

Nothing in these Official Rules is intended to waive or limit any right or remedy that cannot legally be waived under applicable law.

## Platform Disclaimers

The Sweepstakes may be promoted through third-party platforms including, but not limited to, Facebook, Instagram, or other social-media services.

This Sweepstakes is not sponsored, endorsed, administered by, or associated with Meta Platforms, Inc., Facebook, Instagram, or any other social-media platform on which the Sweepstakes may be promoted, unless expressly stated otherwise.

By entering, entrants acknowledge that any information provided in connection with the Sweepstakes is being provided to the Sponsor and not to those third-party platforms.

Participating prize donors likewise do not administer or operate the Sweepstakes solely because their products or logos appear in promotional materials.

## No Purchase or Donation Necessary

**NO PURCHASE OR DONATION NECESSARY TO ENTER OR WIN. A PURCHASE OR DONATION WILL NOT INCREASE YOUR CHANCES OF WINNING.**

Participation in charitable fundraising associated with Tri For the 22 is entirely separate from participation in this Sweepstakes.

Donating to the campaign, purchasing merchandise, supporting a beneficiary organization, following or sharing campaign social-media content, or otherwise financially supporting Tri For the 22 will not provide additional entries or improve an entrant''s odds of winning.

## Void Where Prohibited

The Sweepstakes is void where prohibited or restricted by applicable federal, state, or local law.

The Sponsor reserves the right to modify, suspend, or cancel the Sweepstakes if fraud, technical failure, legal requirements, or circumstances outside the Sponsor''s reasonable control materially affect the integrity or lawful administration of the Sweepstakes.',
    updated_at = now()
where event_slug = '22-for-the-22-2026';

commit;

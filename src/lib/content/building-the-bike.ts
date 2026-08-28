import type {
  BikeBuildComponentRow,
  BikeBuildContributor,
  BikeBuildStatusSummaryItem,
  BikeBuildTimelineEntry,
} from "@/types/bike-build";

/**
 * Content for /journal/building-the-bike — the living "bike-build
 * adventure" record of turning a donated frame into a race-ready bicycle
 * for IRONMAN 70.3 Chattanooga. Kept as plain structured data (the same
 * pattern as src/lib/content/the-story.ts) rather than a Supabase table:
 * this is one continuing story with a rich per-update shape (technical
 * specs, photos, contributor credit, stable anchors), not a stream of
 * independent posts, and it doesn't need admin CRUD.
 *
 * See the project README's "Bike Build Journal Content" section for a
 * worked example of adding a new update. Short version: append one object
 * to BIKE_BUILD_TIMELINE (oldest-first; the newest entry goes last) and,
 * if a component's status changed, edit its row in
 * BIKE_BUILD_COMPONENT_STATUS. Nothing else needs to change — the page
 * derives "last updated," the latest-update teaser, and the anchor list
 * from this file automatically.
 */

export const BIKE_BUILD_INTRO =
  "Step one was getting a bike. As it turns out, a bicycle frame is sometimes just a very attractive list of additional problems.";

export const BIKE_BUILD_HERO_PHOTO = {
  src: "/journal/building-the-bike/frame-hero.jpg",
  alt: "The donated 2012 Stradalli Sorrento carbon frame and fork, standing on its own in black, white, and red.",
  caption: "The donated 2012 Stradalli Sorrento frame — the current foundation of the build. Not yet a bicycle.",
  width: 2400,
  height: 1800,
};

/**
 * Current-status summary panel — the compact "where things stand" block
 * near the top of the page. Edit in place; this is separate from the
 * per-component board below because it answers "is the bike done yet?"
 * rather than "what's the state of every part."
 */
export const BIKE_BUILD_STATUS_SUMMARY: BikeBuildStatusSummaryItem[] = [
  {
    label: "Frame / Build",
    status: "pending",
    statusLabel: "In Progress",
    detail: "Donated 2012 Stradalli carbon frame is the foundation; the bike is not assembled.",
  },
  {
    label: "Fit Confirmation",
    status: "pending",
    statusLabel: "Pending",
    detail: "Requires an in-person evaluation, preferably a professional fitting.",
  },
  {
    label: "Major Component Gap",
    status: "confirmed",
    statusLabel: "Resolved",
    detail: "Shimano 105 ST-R7000 mechanical 2×11 brifters purchased August 26, 2026.",
  },
  {
    label: "Aerobar Compatibility",
    status: "under_review",
    statusLabel: "Under Review",
    detail: "Redshift Sports is checking fit once the final cockpit is known.",
  },
  {
    label: "Final Assembly",
    status: "pending",
    statusLabel: "Pending",
    detail: "Awaiting fit confirmation and the remaining components.",
  },
  {
    label: "First Outdoor Ride",
    status: "pending",
    statusLabel: "Pending",
    detail: "Not yet — will be marked complete only once it actually happens.",
  },
  {
    label: "Race-Day Tune-Up",
    status: "confirmed",
    statusLabel: "Pledged",
    detail: "Bicycle Cove has pledged labor several weeks before race day, parts excluded.",
  },
];

/**
 * Reusable component/part inventory board. `status` drives color+icon;
 * `statusLabel` is the exact accessible text shown (kept close to how MBC
 * and the mechanic actually describe it, even where that's more specific
 * than the 7-value status taxonomy — e.g. "Mostly Available").
 */
export const BIKE_BUILD_COMPONENT_STATUS: BikeBuildComponentRow[] = [
  {
    component: "Frame",
    status: "available",
    statusLabel: "Available / Under Evaluation",
    notes: "Donated 2012 Stradalli carbon frame.",
  },
  {
    component: "Fit",
    status: "pending",
    statusLabel: "Pending",
    notes: "Stack and front-end height require confirmation.",
  },
  {
    component: "Bottom Bracket",
    status: "confirmed",
    statusLabel: "Support Provided",
    notes: "68 mm threaded; Praxis M30 bottom bracket.",
  },
  {
    component: "Crankset",
    status: "confirmed",
    statusLabel: "Support Provided",
    notes: "170 mm Praxis crankset.",
  },
  {
    component: "Chainrings",
    status: "confirmed",
    statusLabel: "Selected",
    notes: "50/34.",
  },
  {
    component: "Wheel & Cassette",
    status: "available",
    statusLabel: "Available Through MBC",
    notes: "Shimano-compatible 11-speed; expected 11–32.",
  },
  {
    component: "Remaining Drivetrain",
    status: "available",
    statusLabel: "Mostly Available",
    notes: "Final inventory and compatibility pending the mechanic's inspection.",
  },
  {
    component: "Brifters",
    status: "confirmed",
    statusLabel: "Purchased",
    notes: "Shimano 105 ST-R7000 mechanical rim-brake 2×11 pair; purchased August 26, 2026.",
  },
  {
    component: "Aerobars",
    status: "under_review",
    statusLabel: "Under Review",
    notes: "Redshift Sports is checking compatibility and availability.",
  },
  {
    component: "Assembly",
    status: "pending",
    statusLabel: "Pending",
    notes: "Awaiting fit and final component confirmation.",
  },
  {
    component: "Pre-Race Tune-Up",
    status: "confirmed",
    statusLabel: "Confirmed",
    notes: "Bicycle Cove labor pledged; parts excluded.",
  },
  {
    component: "First Outdoor Ride",
    status: "pending",
    statusLabel: "Pending",
    notes: "Not marked complete until it happens.",
  },
];

/** Text-only for now — structured so a `logoUrl`/`logoAlt` pair can be added later without a redesign. See ContributorsSection. */
export const BIKE_BUILD_CONFIRMED_CONTRIBUTORS: BikeBuildContributor[] = [
  {
    name: "Betsy & MBC",
    role: "Frame sourcing, component inventory, mechanical evaluation",
    note: "Identified the donated Stradalli frame, began cataloguing available components, and connected the build with Bruce and Praxis.",
  },
  {
    name: "Bruce",
    role: "Fit and mechanical assessment",
    note: "Raised the fit question that's currently gating the build, and is evaluating the frame and components in person.",
  },
  {
    name: "Praxis",
    role: "Bottom bracket & crankset",
    note: "Provided a compatible bottom bracket and 170 mm crankset in the selected 50/34 chainring configuration.",
  },
  {
    name: "Bicycle Cove",
    role: "Pre-race tune-up",
    note: "Pledged complimentary labor for a pre-race tune-up, parts excluded, scheduled well ahead of race day.",
  },
];

/** Support being discussed but not yet confirmed — kept separate so nothing here reads as a locked-in sponsorship. */
export const BIKE_BUILD_CONVERSATIONS_IN_PROGRESS: BikeBuildContributor[] = [
  {
    name: "Redshift Sports",
    role: "Aerobars (under review)",
    note: "Checking whether its aerobars are compatible once the final handlebar, stem, and shifting setup is known.",
  },
  {
    name: "Redemptive Cycles",
    role: "Used brifters request concluded",
    note: "A request for a compatible used pair was submitted August 26, 2026. A suitable Shimano 105 ST-R7000 pair was subsequently sourced and purchased elsewhere, closing the immediate brifter requirement.",
  },
];

/**
 * Photo slots for moments the story hasn't reached yet. Real photos already
 * taken (the bare frame, its details, the front end) live inline on the
 * relevant BIKE_BUILD_TIMELINE entry instead of here — this list is only
 * for future moments so the page never has to fake a photo it doesn't have.
 * Move an item out of this list once a real photo exists for it.
 */
export const BIKE_BUILD_PHOTO_ROADMAP: { label: string; description: string }[] = [
  { label: "Components as They Arrive", description: "Aerobars and the rest of the drivetrain as they're sourced." },
  { label: "The Mechanic's Inspection", description: "Bruce evaluating the frame and components in person." },
  { label: "Assembly Progress", description: "The build coming together, piece by piece." },
  { label: "First Completed Bike", description: "Only once it's actually assembled — not before." },
  { label: "First Outdoor Ride", description: "The first time this bike actually goes anywhere." },
  { label: "Final Race Configuration", description: "The bike as it lines up at IRONMAN 70.3 Chattanooga." },
];

/**
 * The living timeline. Oldest first, newest last — the page renders this
 * array in order and treats the last item as "the latest update." Each
 * entry's `id` becomes its anchor (/journal/building-the-bike#<id>), so
 * once published, don't change an existing entry's id.
 */
export const BIKE_BUILD_TIMELINE: BikeBuildTimelineEntry[] = [
  {
    id: "training-without-a-bike",
    date: "2026-08-01",
    displayDate: "August 2026",
    title: "Training Without a Bike",
    summary:
      "Cycling is the newest of Cody's three disciplines, and training began without a dedicated outdoor bike to develop it on.",
    status: "The search begins",
    body: [
      "When I committed to preparing for the 2027 IRONMAN 70.3 Chattanooga, there was one fairly important detail missing: I did not own an outdoor training or race bike.",
      "Cycling was already the newest of the three disciplines for me. I had no established outdoor power baseline, no validated FTP, no experience sustaining race effort for 56 miles — and no bicycle on which to begin developing any of those things.",
      "The first objective was simple: find a safe, properly sized bicycle that could carry me through training and eventually to the starting line.",
      "Simple objectives have a sense of humor.",
    ],
  },
  {
    id: "knocking-on-doors",
    date: "2026-08-23",
    displayDate: "August 20–23, 2026",
    title: "Knocking on Doors",
    summary: "An outreach campaign to manufacturers, shops, and cycling and veteran-support organizations turned up leads more than answers.",
    status: "Outreach underway",
    body: [
      "I began contacting bicycle manufacturers, component companies, local shops, cycling organizations, and veteran-support groups.",
      "The request was deliberately flexible. A complete bike would have been ideal, but a frameset, demo bike, season-long loaner, meaningful discount, used equipment, or component support could all help move the campaign forward.",
      "Most companies had already committed their sponsorship budgets or were unable to support an individual campaign. The responses were not always the answer I hoped for, but each conversation taught me more about bike sizing, compatibility, sponsorships, and what this build would actually require.",
      "The likely frame-size range appeared to be approximately 51–54 centimeters, but that still needed to be confirmed through an in-person evaluation or professional fitting.",
    ],
  },
  {
    id: "redshift-offers-to-check",
    date: "2026-08-24",
    displayDate: "August 24, 2026",
    title: "Redshift Offers to Check the Parts Shelf",
    summary: "Redshift Sports offered to check whether it has compatible aerobars — pending a bike that didn't exist yet to photograph.",
    status: "Aerobar support under review",
    contributors: ["Redshift Sports"],
    body: [
      "Erik, co-founder and engineer at Redshift Sports, offered to check whether Redshift had aerobars it could provide for the campaign.",
      "Before compatibility could be determined, Redshift needed the bike's make, model, year, handlebar information, and photographs showing the handlebar and stem.",
      "At that point, there was still a small technical obstacle: I did not yet have a completed bike — or even a fully identified cockpit — to photograph.",
      "Redshift's offer remained open while the rest of the bicycle took shape.",
    ],
  },
  {
    id: "a-stradalli-frame-appears",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "A Stradalli Frame Appears",
    summary: "Betsy and the MBC community identified a donated 2012 Stradalli carbon frame as the possible foundation of the build.",
    status: "Donated frame identified",
    featured: false,
    contributors: ["Betsy & MBC"],
    photos: [
      {
        src: "/journal/building-the-bike/frame-hero.jpg",
        alt: "The donated 2012 Stradalli Sorrento carbon frame and fork standing upright in a garage.",
        caption: "The frame, standing on its own for the first time. Confirmed: it looks great. Unconfirmed: everything else.",
        width: 2400,
        height: 1800,
      },
      {
        src: "/journal/building-the-bike/frame-overhead.jpg",
        alt: "The bare Stradalli frame and fork laid out on the floor, showing the full silhouette from above.",
        caption: "The bare frame and fork, laid out in full. A frame is less a bicycle than a very attractive list of future decisions.",
        width: 2000,
        height: 1500,
      },
      {
        src: "/journal/building-the-bike/frame-front-end.jpg",
        alt: "The Stradalli frame's front end, showing the head tube and fork steerer.",
        caption: "The front end — head tube and fork steerer — which is exactly the part later put in question by the fit conversation below.",
        width: 2000,
        height: 1500,
      },
      {
        src: "/journal/building-the-bike/frame-serial-detail.jpg",
        alt: "Close-up of the frame's dropout area showing a stamped serial number plate.",
        caption: "Frame detail and serial marking, for the record.",
        width: 1600,
        height: 1200,
      },
    ],
    technicalDetails: {
      heading: "Frame Geometry",
      note: "Approximate measurements supplied with the donated frame — not a verified manufacturer geometry chart. Final fit still requires an in-person, preferably professional, assessment.",
      items: [
        { label: "RC", value: "410 mm" },
        { label: "O", value: "520 mm" },
        { label: "Reach", value: "approximately 460 mm" },
        { label: "S", value: "510 mm" },
        { label: "HS", value: "135 mm" },
        { label: "F", value: "370 mm" },
        { label: "FC", value: "580 mm" },
        { label: "WB", value: "1000 mm" },
      ],
    },
    body: [
      "The entire project changed when Betsy and the MBC community identified a donated 2012 Stradalli carbon frame that might serve as the foundation of the build.",
      "Even stripped down to the frame, it looked fantastic. Better yet, its black, white, and red appearance fit naturally with the campaign's visual identity. Apparently the bike had received the branding brief before I did.",
      "The frame appeared to be a road-oriented carbon platform that could potentially be configured for triathlon use. It was not yet possible to call it a complete bicycle, a proper fit, or a race-ready machine.",
      "A bare frame is less a bicycle than a very attractive list of future decisions.",
    ],
  },
  {
    id: "the-fit-question",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "The Fit Question",
    summary: "Bruce raised the question that matters most: will the frame's stack and front end actually fit safely?",
    status: "Fit and stack unresolved",
    contributors: ["Bruce"],
    technicalDetails: {
      heading: "Approximate Body Measurements",
      note: "Used only to reason about probable fit — not a substitute for an in-person or professional fitting.",
      items: [
        { label: "Height", value: "5 ft 9.75 in" },
        { label: "Cycling Inseam", value: "31 in" },
        { label: "Torso", value: "26 in" },
        { label: "Arm", value: "26 in" },
        { label: "Shoulder Width", value: "20 in" },
        { label: "Femur", value: "24 in" },
      ],
    },
    body: [
      "Bruce raised the most important question of the entire build: would the frame actually fit me?",
      "The concern was not simply the nominal frame size. The approximate geometry and relatively low front end raised questions about stack, handlebar height, and whether I could maintain a comfortable and sustainable position during a 56-mile bike leg.",
      "Those measurements suggested that the frame might be workable, but “might” is not good enough when comfort, handling, and injury prevention are involved.",
      "The bike still required an in-person evaluation and preferably a professional fitting before significant money was spent completing it.",
      "Fit first. Components second.",
    ],
  },
  {
    id: "mbc-starts-taking-inventory",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "MBC Starts Taking Inventory",
    summary: "Betsy and the MBC team began cataloguing what's on hand and confirmed the frame's bottom-bracket standard.",
    status: "Component inventory underway",
    contributors: ["Betsy & MBC"],
    technicalDetails: {
      heading: "Confirmed & Planned",
      items: [
        { label: "Bottom Bracket", value: "68 mm threaded (confirmed)" },
        { label: "Drivetrain Plan", value: "Shimano-compatible, double chainring" },
        { label: "Wheel & Cassette", value: "11-speed, available through MBC; expected 11–32" },
      ],
    },
    body: [
      "Betsy and the MBC team began evaluating the frame and identifying which components were already available.",
      "The frame uses a 68 mm threaded bottom bracket, resolving one major compatibility question.",
      "MBC also had an 11-speed wheel, an 11-speed cassette, a likely 11–32 cassette range, most of the remaining components needed for the build, and access to mechanics capable of assessing the frame and available parts.",
      "The planned drivetrain would be Shimano-compatible and use a double chainring.",
      "The exact build sheet remained subject to the mechanic's inspection, but the project had moved from searching for an entire bicycle to filling a much shorter component list.",
    ],
  },
  {
    id: "praxis-solves-the-crankset-problem",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "Praxis Solves the Crankset Problem",
    summary: "Praxis offered a compatible bottom bracket and 170 mm crankset, and Cody chose a 50/34 chainring setup.",
    status: "Bottom bracket and crankset support offered",
    contributors: ["Praxis"],
    technicalDetails: {
      heading: "Crankset & Chainrings",
      items: [
        { label: "Crank Length", value: "170 mm" },
        { label: "Chainring Options Offered", value: "48/32, 50/34, 52/36" },
        { label: "Selected", value: "50/34" },
      ],
    },
    body: [
      "Praxis confirmed that it could provide a compatible bottom bracket and crankset in the preferred 170 mm crank length.",
      "I selected 50/34. That combination should provide a practical balance between usable speed, climbing range, training flexibility, and the demands of a first 70.3 bike leg.",
      "Praxis also asked to be included in the bike-build story and campaign updates. Its support transformed the crankset and bottom-bracket question from an unresolved technical problem into one of the strongest confirmed pieces of the proposed build.",
    ],
  },
  {
    id: "bicycle-cove-offers-the-tune-up",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "Bicycle Cove Offers the Final Tune-Up",
    summary: "Bicycle Cove pledged complimentary labor for a pre-race tune-up, parts excluded, well ahead of race day.",
    status: "Pre-race tune-up labor confirmed",
    contributors: ["Bicycle Cove"],
    body: [
      "Jessica at Bicycle Cove offered complimentary labor for a pre-race tune-up, excluding any required parts.",
      "The tune-up will need to take place several weeks before race day — not during the traditional athlete ritual of discovering mechanical problems at the last possible moment.",
      "The bike does not exist as a complete machine yet, but it already has a place to receive its final mechanical inspection before Chattanooga.",
    ],
  },
  {
    id: "one-major-piece-is-still-missing",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "One Major Piece Is Still Missing",
    summary: "The remaining major gap: a matched pair of Shimano-compatible, mechanical rim-brake brifters for a 2×11 drivetrain.",
    status: "Brifters needed",
    technicalDetails: {
      heading: "What Will and Won't Work",
      items: [
        { label: "Preferred", value: "Shimano 105 ST-R7000 pair, or Shimano Ultegra ST-R8000 pair" },
        { label: "Also acceptable", value: "Another matched Shimano road 2×11 mechanical rim-brake pair, mechanic-approved" },
        { label: "Won't work", value: "Hydraulic-disc levers, 12-speed levers, 10-speed levers, 1x/single-lever setups, or unmatched pairs" },
      ],
    },
    body: [
      "After reviewing MBC's available components, the remaining major gap became clear: the bike needs a matched pair of Shimano-compatible mechanical rim-brake STI levers, commonly called brifters, for a 2×11 road drivetrain.",
      "Hydraulic-disc levers, 12-speed levers, 10-speed levers, one-by levers, or randomly mismatched components will not solve the problem.",
      "Brifters are awkwardly named, mechanically important, and apparently quite capable of standing between a carbon frame and its dreams.",
    ],
  },
  {
    id: "redemptive-cycles-joins-the-search",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "Redemptive Cycles Joins the Search",
    summary: "A request for a compatible used brifter set went to Redemptive Cycles in Birmingham; a response is pending.",
    status: "Used brifter request submitted",
    body: [
      "Betsy recommended Redemptive Cycles in Birmingham as a possible source for used components.",
      "I contacted the shop with the specific drivetrain requirements and asked whether it had a compatible used set available, along with questions about condition, pricing, and whether donated or discounted support might be possible.",
      "The request emphasized that the immediate need is not an expensive upgrade. It's a safe, compatible set of controls that will allow the donated frame and available components to become a functioning bicycle.",
      "Redemptive Cycles confirmed receipt of the request. Its response is pending.",
    ],
  },
  {
    id: "where-the-build-stands",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "Where the Build Stands",
    summary:
      "A donated frame, a bottom bracket and crankset, a wheelset, a pledged tune-up, and now a purchased pair of brifters — aerobar compatibility remains under review.",
    status: "Build in progress",
    body: [
      "The project now has the beginnings of a real bicycle: a donated 2012 Stradalli carbon frame, a confirmed 68 mm threaded bottom-bracket standard, a Praxis M30 bottom bracket and 170 mm crankset in the selected 50/34 configuration, an 11-speed wheel and 11–32 cassette available through MBC, most remaining components available, and now a purchased pair of Shimano 105 ST-R7000 2×11 mechanical brifters.",
      "Possible aerobar support is still being evaluated by Redshift Sports, Bicycle Cove has pledged pre-race tune-up labor, and Bruce is continuing to evaluate the frame and final build configuration.",
      "Important questions remain: Can the frame be fitted comfortably and safely? What exact components will survive the final compatibility check? Does the build still require a new 11-speed chain or additional cable and housing supplies? Will the proposed cockpit accept the Redshift aerobars? What will the completed bike feel like on its first outdoor ride?",
      "The bike is not assembled, fitted, tested, or race-ready.",
      "Not yet.",
      "But one of the largest remaining pieces is no longer a question mark.",
    ],
  },
  {
    id: "brifters-purchased",
    date: "2026-08-27",
    displayDate: "August 26, 2026",
    title: "The Controls Are Covered",
    summary:
      "A matched pair of Shimano 105 ST-R7000 mechanical brifters has been purchased, closing the build's largest remaining drivetrain gap.",
    status: "Brifters purchased",
    featured: true,
    contributors: ["Bruce"],
    photos: [
      {
        src: "/journal/building-the-bike/brifters-shimano-105.png",
        alt: "A matched pair of Shimano 105 ST-R7000 mechanical road shift/brake levers.",
        caption: "The Shimano 105 ST-R7000 brifters, purchased August 26, 2026 — the build's primary cockpit controls, now secured.",
        width: 1254,
        height: 1285,
      },
    ],
    technicalDetails: {
      heading: "Brifters Purchased",
      items: [
        { label: "Model", value: "Shimano 105 ST-R7000, mechanical 2×11" },
        { label: "Price", value: "$138.99 for the pair" },
      ],
    },
    body: [
      "The largest remaining drivetrain gap is officially closed.",
      "After confirming compatibility with Bruce, I purchased a matched pair of Shimano 105 ST-R7000 mechanical 2×11 shift/brake levers for the Stradalli build.",
      "The ST-R7000 levers match the planned Shimano-compatible 11-speed drivetrain, double chainring, and mechanical rim-brake configuration. They will control the front and rear shifting while also serving as the bike's primary brake levers.",
      "The pair was purchased for $138.99, considerably less than many current retail listings for the same component.",
      "This means the build now has its primary cockpit controls secured. The remaining details are increasingly becoming matters of final inventory, fit, assembly, cabling, chain selection, and aerobar compatibility rather than major component sourcing.",
      "For a bike that began as a bare carbon frame, that is a substantial step forward.",
    ],
  },
  {
    id: "a-neighbor-lends-a-bike",
    date: "2026-08-28",
    displayDate: "August 28, 2026",
    title: "A Neighbor Lends a Hand — and a Bike",
    summary:
      "The Stradalli still isn't rideable, so a neighbor loaned a bike to train on in the meantime.",
    status: "Training bike secured (loaner)",
    photos: [
      {
        src: "/journal/building-the-bike/loaner-bike-blue-trail.jpg",
        alt: "A red Trek hybrid bike parked on a paved trail beside a \"Blue Trail 4 Miles\" sign.",
        caption: "The loaner — a red Trek — out on the trail. Not the race bike. Just something to actually pedal in the meantime.",
        width: 1512,
        height: 2016,
      },
    ],
    body: [
      "The Stradalli build still isn't rideable — no confirmed fit, no finished cockpit, no assembly. None of that stops training from needing to start.",
      "A neighbor solved the immediate problem by loaning me a bike: a red Trek, already built and already rideable, good for exactly as long as it takes to either finish the Stradalli or find one of my own.",
      "This bike isn't part of the build. It doesn't get a line on the component board below, and it isn't the bike going to Chattanooga. It's a bridge — a way to put in real outdoor miles while the actual race bike is still a list of unresolved questions.",
      "Sometimes the fastest way to keep moving forward is somebody else's spare bike and a trail sign pointing the way.",
    ],
  },
];

export function getLatestBikeBuildEntry(): BikeBuildTimelineEntry {
  return BIKE_BUILD_TIMELINE[BIKE_BUILD_TIMELINE.length - 1];
}

/** ISO date of the newest timeline entry — drives the hero's "Last updated" badge and the page's dateModified metadata. */
export function getBikeBuildLastUpdated(): string {
  return getLatestBikeBuildEntry().date;
}

export interface BikeBuildTeaser {
  title: string;
  displayDate: string;
  summary: string;
  href: string;
}

/** Used by the journal index and The Race page's "Latest Bike-Build Update" teasers. */
export function getBikeBuildTeaser(): BikeBuildTeaser {
  const latest = getLatestBikeBuildEntry();
  return {
    title: latest.title,
    displayDate: latest.displayDate,
    summary: latest.summary,
    href: `/journal/building-the-bike#${latest.id}`,
  };
}

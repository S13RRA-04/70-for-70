/**
 * A schematic "tile grid" layout of the 50 states + DC — the same style of
 * map used by NPR, the Census Bureau, and similar dashboards: every state
 * gets an equal-size tile positioned in its approximate compass position
 * (row = north-to-south, col = west-to-east), not a literal traced
 * coastline. Deliberately not a precise cartographic SVG — hand-tracing
 * accurate state border paths from memory risks real geographic errors,
 * where this schematic form only needs relative position/adjacency to be
 * right, which is far safer to get correct.
 */

export interface USStateGridEntry {
  code: string;
  name: string;
  row: number;
  col: number;
}

export const US_STATES_GRID: USStateGridEntry[] = [
  { code: "ME", name: "Maine", row: 0, col: 11 },

  { code: "MT", name: "Montana", row: 1, col: 2 },
  { code: "ND", name: "North Dakota", row: 1, col: 3 },
  { code: "MN", name: "Minnesota", row: 1, col: 4 },
  { code: "WI", name: "Wisconsin", row: 1, col: 6 },
  { code: "VT", name: "Vermont", row: 1, col: 10 },
  { code: "NH", name: "New Hampshire", row: 1, col: 11 },

  { code: "WA", name: "Washington", row: 2, col: 0 },
  { code: "ID", name: "Idaho", row: 2, col: 1 },
  { code: "WY", name: "Wyoming", row: 2, col: 2 },
  { code: "SD", name: "South Dakota", row: 2, col: 3 },
  { code: "IA", name: "Iowa", row: 2, col: 5 },
  { code: "MI", name: "Michigan", row: 2, col: 7 },
  { code: "NY", name: "New York", row: 2, col: 9 },
  { code: "MA", name: "Massachusetts", row: 2, col: 10 },

  { code: "OR", name: "Oregon", row: 3, col: 0 },
  { code: "NV", name: "Nevada", row: 3, col: 1 },
  { code: "CO", name: "Colorado", row: 3, col: 2 },
  { code: "NE", name: "Nebraska", row: 3, col: 3 },
  { code: "IL", name: "Illinois", row: 3, col: 5 },
  { code: "IN", name: "Indiana", row: 3, col: 6 },
  { code: "PA", name: "Pennsylvania", row: 3, col: 8 },
  { code: "NJ", name: "New Jersey", row: 3, col: 9 },
  { code: "CT", name: "Connecticut", row: 3, col: 10 },
  { code: "RI", name: "Rhode Island", row: 3, col: 11 },

  { code: "UT", name: "Utah", row: 4, col: 1 },
  { code: "KS", name: "Kansas", row: 4, col: 3 },
  { code: "MO", name: "Missouri", row: 4, col: 4 },
  { code: "KY", name: "Kentucky", row: 4, col: 5 },
  { code: "OH", name: "Ohio", row: 4, col: 6 },
  { code: "WV", name: "West Virginia", row: 4, col: 7 },
  { code: "MD", name: "Maryland", row: 4, col: 8 },

  { code: "CA", name: "California", row: 5, col: 0 },
  { code: "AZ", name: "Arizona", row: 5, col: 1 },
  { code: "NM", name: "New Mexico", row: 5, col: 2 },
  { code: "OK", name: "Oklahoma", row: 5, col: 3 },
  { code: "AR", name: "Arkansas", row: 5, col: 4 },
  { code: "TN", name: "Tennessee", row: 5, col: 5 },
  { code: "NC", name: "North Carolina", row: 5, col: 6 },
  { code: "VA", name: "Virginia", row: 5, col: 7 },
  { code: "DE", name: "Delaware", row: 5, col: 8 },

  { code: "TX", name: "Texas", row: 6, col: 3 },
  { code: "LA", name: "Louisiana", row: 6, col: 4 },
  { code: "MS", name: "Mississippi", row: 6, col: 5 },
  { code: "AL", name: "Alabama", row: 6, col: 6 },
  { code: "GA", name: "Georgia", row: 6, col: 7 },
  { code: "SC", name: "South Carolina", row: 6, col: 8 },
  { code: "DC", name: "District of Columbia", row: 6, col: 9 },

  { code: "AK", name: "Alaska", row: 7, col: 0 },
  { code: "FL", name: "Florida", row: 7, col: 7 },

  { code: "HI", name: "Hawaii", row: 8, col: 0 },
];

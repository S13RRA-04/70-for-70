import { FUNDRAISING_GOAL, SITE_NAME } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

/** Canonical parent-site framing for The $70K Mission. */
export const MISSION_70K_INTRO = [
  `What began as a 70.3-mile triathlon challenge grew into something bigger. ${SITE_NAME} is working toward a shared ${formatCurrency(FUNDRAISING_GOAL)} fundraising goal in support of organizations serving veterans and their families.`,
  "Tri For The 22 inspired the number. Reaching it will take more than one athlete and one race, so every current For The 22 campaign contributes toward the same mission.",
] as const;

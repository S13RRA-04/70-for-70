import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MileStatus } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, opts?: { cents?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(amount);
}

export function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** $1,000 raised = 1 race mile funded. */
const DOLLARS_PER_MILE = 1000;

export function milesFunded(totalRaised: number, capMiles = 70) {
  const miles = totalRaised / DOLLARS_PER_MILE;
  return Math.min(miles, capMiles);
}

export function percentFunded(totalRaised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min((totalRaised / goal) * 100, 100);
}

export function formatDateLong(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function mileStatusLabel(status: MileStatus) {
  switch (status) {
    case "available":
      return "Available";
    case "requested":
      return "Sponsorship Pending";
    case "reserved":
      return "Sponsorship Pending";
    case "partially_funded":
      return "Partially Funded";
    case "funded":
      return "Funded";
  }
}

import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/constants";

/** Retired — merchandise now lives on the org's own store at forthe22.org/store. */
export default function ShopPage() {
  redirect(`${SITE_URL}/store`);
}

import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { Container } from "@/components/shared/container";
import { saveGiveawayPrizesAction, addGiveawayPrizeAction, deleteGiveawayPrizeAction } from "./actions";
import type { GiveawayPrizeRow } from "@/types/database";

function PrizeRow({ prize, partnerOptions }: { prize: GiveawayPrizeRow; partnerOptions: { id: string; name: string }[] }) {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name={`brand-${prize.id}`}
          type="text"
          defaultValue={prize.brand}
          placeholder="Brand"
          className="rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-sm text-ink"
        />
        <input
          name={`prizeName-${prize.id}`}
          type="text"
          defaultValue={prize.prize_name}
          placeholder="Prize name"
          className="rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-sm text-ink"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-xs text-charcoal-light">
          Qty
          <input
            name={`quantity-${prize.id}`}
            type="number"
            min="1"
            defaultValue={prize.quantity}
            className="ml-1 w-16 rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs text-ink"
          />
        </label>
        <label className="text-xs text-charcoal-light">
          Winners
          <input
            name={`winnerCount-${prize.id}`}
            type="number"
            min="1"
            defaultValue={prize.winner_count}
            className="ml-1 w-16 rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs text-ink"
          />
        </label>
        <input
          name={`retailValueMin-${prize.id}`}
          type="number"
          defaultValue={prize.retail_value_min ?? ""}
          placeholder="Value min $"
          className="w-24 rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs text-ink"
        />
        <input
          name={`retailValueMax-${prize.id}`}
          type="number"
          defaultValue={prize.retail_value_max ?? ""}
          placeholder="Value max $"
          className="w-24 rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs text-ink"
        />
        <select
          name={`status-${prize.id}`}
          defaultValue={prize.status}
          className="rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs text-ink"
        >
          <option value="confirmed">Confirmed</option>
          <option value="received">Received</option>
        </select>
        <label className="flex items-center gap-1 text-xs text-charcoal-light">
          <input type="checkbox" name={`featured-${prize.id}`} defaultChecked={prize.featured} className="h-3.5 w-3.5 accent-bronze" />
          Featured
        </label>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          name={`websiteUrl-${prize.id}`}
          type="url"
          defaultValue={prize.website_url ?? ""}
          placeholder="Donor website URL"
          className="rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-xs text-ink"
        />
        <select
          name={`partnerId-${prize.id}`}
          defaultValue={prize.partner_id ?? ""}
          className="rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-xs text-ink"
        >
          <option value="">No linked supporter profile</option>
          {partnerOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        name={`donorNote-${prize.id}`}
        defaultValue={prize.donor_note ?? ""}
        placeholder="Donor note (optional)"
        rows={2}
        className="mt-2 w-full rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-xs text-ink"
      />
    </div>
  );
}

export default async function GiveawayPrizesAdminPage() {
  await requireAdminUser();
  const event = await getCurrentEventConfig();

  if (!event) {
    return (
      <Container className="max-w-4xl py-16">
        <p className="text-sm text-charcoal-light">No event_config row found for the current event slug.</p>
      </Container>
    );
  }

  const [prizes, missionPartners] = await Promise.all([getGiveawayPrizes(event.id), getMissionPartners()]);
  const partnerOptions = missionPartners
    .filter((p) => p.partner_type === "giveaway-supporter")
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <Container className="max-w-4xl py-16">
      <Link
        href="/admin/22-for-the-22"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Registrations
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Giveaway Prizes</h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Powers the giveaway section on 22.forthe22.org and the supporter grid on /sponsors. Add a supporter with
        partner_type &quot;giveaway-supporter&quot; in Mission Partners first if you want a prize linked to a
        logo/profile.
      </p>

      <form action={saveGiveawayPrizesAction} className="mt-8 space-y-3">
        {prizes.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-sm text-charcoal-light">
            No prizes yet.
          </p>
        )}
        {prizes.map((prize) => (
          <PrizeRow key={prize.id} prize={prize} partnerOptions={partnerOptions} />
        ))}
        {prizes.length > 0 && (
          <button
            type="submit"
            className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Save All
          </button>
        )}
      </form>

      <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Add Prize</h2>
        <form action={addGiveawayPrizeAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="brand" className="text-xs font-medium text-ink">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              required
              className="mt-1.5 block rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="prizeName" className="text-xs font-medium text-ink">
              Prize Name
            </label>
            <input
              id="prizeName"
              name="prizeName"
              type="text"
              required
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            Add
          </button>
        </form>
      </div>

      {prizes.length > 0 && (
        <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Remove a Prize</h2>
          <ul className="mt-4 space-y-2">
            {prizes.map((prize) => (
              <li
                key={prize.id}
                className="flex items-center justify-between gap-3 border-t border-ink/10 pt-2 text-sm first:border-t-0 first:pt-0"
              >
                <span className="text-charcoal-light">
                  {prize.brand} — {prize.prize_name}
                </span>
                <form action={deleteGiveawayPrizeAction}>
                  <input type="hidden" name="id" value={prize.id} />
                  <button
                    type="submit"
                    className="shrink-0 text-xs font-semibold uppercase tracking-wide text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

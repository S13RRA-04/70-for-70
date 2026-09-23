import {
  EQUIPMENT_EXPENSE_SUBTOTAL,
  OUT_OF_POCKET_EXPENSE_CATEGORIES,
  RACE_REGISTRATION_EXPENSE,
  TOTAL_OUT_OF_POCKET,
  type ExpenseCategory,
} from "@/lib/content/out-of-pocket-expenses";
import { formatCurrency } from "@/lib/utils";

function CategoryAccordion({ category }: { category: ExpenseCategory }) {
  return (
    <details className="rounded-sm border border-ink/10 bg-off-white">
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          {category.category}
        </span>
        <span className="font-display text-base font-bold tabular-nums text-bronze">
          {formatCurrency(category.subtotal, { cents: true })}
        </span>
      </summary>
      <div className="border-t border-ink/10">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            {category.items.map((item) => (
              <tr key={item.label} className="border-b border-ink/10 last:border-0">
                <td className="px-5 py-2.5 text-charcoal-light">{item.label}</td>
                <td className="px-5 py-2.5 text-right tabular-nums text-ink">
                  {formatCurrency(item.amount, { cents: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * Cody's personal out-of-pocket spend, broken out by category with each
 * item itemized behind a `<details>` accordion (same native-dialog-free
 * expand pattern as race-benchmarks.tsx's AccordionSection) so the page
 * stays scannable — the subtotal is always visible, the line items are one
 * click away. Distinct from campaign funds raised: see
 * src/lib/content/out-of-pocket-expenses.ts's doc comment.
 */
export function OutOfPocketExpenses() {
  return (
    <div>
      <div className="space-y-3">
        {OUT_OF_POCKET_EXPENSE_CATEGORIES.map((category) => (
          <CategoryAccordion key={category.category} category={category} />
        ))}
      </div>

      <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/5 p-5 sm:p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex items-baseline justify-between">
            <dt className="text-charcoal-light">Equipment subtotal</dt>
            <dd className="tabular-nums text-ink">{formatCurrency(EQUIPMENT_EXPENSE_SUBTOTAL, { cents: true })}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-charcoal-light">{RACE_REGISTRATION_EXPENSE.label}</dt>
            <dd className="tabular-nums text-ink">
              {formatCurrency(RACE_REGISTRATION_EXPENSE.amount, { cents: true })}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-bronze/30 pt-2.5">
            <dt className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Total Out of Pocket
            </dt>
            <dd className="font-display text-xl font-bold tabular-nums text-bronze">
              {formatCurrency(TOTAL_OUT_OF_POCKET, { cents: true })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

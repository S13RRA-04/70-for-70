"use client";

import { cloneElement, useEffect, useRef, useState } from "react";

/**
 * Which hidden-to-visible transition to play. `rise` suits nearly all content;
 * `scale` is for cards/images, `left` for elements that read as entering from
 * a side (a rail, a sidebar).
 */
export type RevealVariant = "rise" | "scale" | "left";

/**
 * One-time fade/rise as content enters the viewport — restrained on purpose
 * (no repeat-on-scroll, no parallax, short 8px travel). Respects
 * prefers-reduced-motion via the global CSS override in globals.css, which
 * collapses transition duration to ~0, so this becomes an instant appearance
 * rather than a persistently-hidden state for those users.
 *
 * The hidden state and the transition itself live in CSS keyed off
 * `data-reveal`, not in Tailwind classes here. That matters for pre-hydration
 * paint: this is a client component, so anything driven by `useState` cannot
 * apply its hidden state during SSR, and the element would flash visible on
 * first paint and then jump away when the observer fires.
 *
 * The observer also disconnects after the first intersection — replaying on
 * every re-entry is a strong "scrollytelling" tell and gets tiring fast.
 */
export function RevealOnScroll({
  children,
  className,
  variant = "rise",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Stagger offset in ms. Prefer `RevealGroup` for lists — this is for a one-off. */
  delay?: number;
  /** Render as a different element, e.g. "section" or "li", to keep markup valid. */
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  // A ref-callback rather than useRef<HTMLElement>: the polymorphic `Tag`
  // below is a union of intrinsic elements, so TS intersects their ref types
  // and a generic HTMLElement ref won't satisfy it. Refs are attached before
  // effects run, so reading `.current` in a `[]`-deps effect is safe — and
  // keeping the deps empty matters, since re-running this effect on a node
  // identity change would cascade an extra render (react-hooks lint).
  const nodeRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        nodeRef.current = node;
      }}
      data-reveal={visible ? "visible" : variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
/**
 * Returns the props that turn an EXISTING element into a staggered reveal
 * group. Unlike wrapping the children in extra divs, this adds no DOM — which
 * matters because these targets are CSS grids (`sm:grid-cols-3`) and card
 * components that size themselves (`h-full`, aspect-ratio images). An
 * inserted wrapper would become the grid item instead of the card, breaking
 * both the column count and the height.
 *
 * The hidden state for the children is pure CSS, keyed off `[data-reveal-group]`
 * and their own `--reveal-index`, so pre-hydration paint is already correct.
 */
export function useRevealGroup({
  variant = "rise",
  step = 70,
}: {
  variant?: RevealVariant;
  /** Per-item delay in ms. The cascade caps itself at 8 steps in CSS. */
  step?: number;
} = {}) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // A grid may contain hundreds of rows. Percentage thresholds are based
      // on the whole observed element, so even 5% can exceed the viewport and
      // leave every child permanently hidden. Trigger as soon as any part of
      // the grid enters the usable viewport instead.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref: (node: HTMLElement | null) => {
      nodeRef.current = node;
    },
    "data-reveal-group": visible ? "visible" : "pending",
    "data-reveal-variant": variant,
    style: { "--reveal-step": `${step}ms` } as React.CSSProperties,
  };
}

/**
 * Staggers a grid or list. Takes the grid element itself as `children` and
 * tags it via cloneElement, rather than wrapping — see useRevealGroup for why
 * inserting wrapper divs is not an option here.
 *
 * Usage from a Server Component:
 *
 *   <RevealGrid>
 *     <div className="mt-8 grid gap-6 sm:grid-cols-3">
 *       {entries.map((e) => <Card key={e.id} {...e} />)}
 *     </div>
 *   </RevealGrid>
 *
 * Exactly one child element — cloneElement has nowhere sensible to put the
 * attributes otherwise, and the nth-child stagger depends on the tagged element
 * being the grid itself.
 */
export function RevealGrid({
  children,
  variant = "rise",
  step = 70,
}: {
  children: React.ReactElement;
  variant?: RevealVariant;
  step?: number;
}) {
  const reveal = useRevealGroup({ variant, step });
  return cloneElement(children, reveal);
}

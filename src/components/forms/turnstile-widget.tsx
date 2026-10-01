"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Cloudflare Turnstile widget for the site's fetch-based forms.
 *
 * The forms here don't submit natively — they build a JSON payload and POST
 * it — so the widget is rendered explicitly and the token is handed to the
 * parent via `onToken`, which includes it in the payload as `turnstileToken`.
 *
 * Inert when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset: renders nothing and
 * the form keeps working (the server also skips verification with no secret).
 * When it IS set, the parent should keep its submit button disabled until a
 * token arrives — otherwise the server silently drops an unsolved submission.
 *
 * Call `ref.reset()` after every submit attempt: Turnstile tokens are
 * single-use, so a retry needs a fresh one.
 */

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
/** True when a widget should render and the submit button can require a token. */
export const isTurnstileEnabled = Boolean(TURNSTILE_SITE_KEY);

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  /** Clears the token and re-arms the widget for another attempt. */
  reset: () => void;
};

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  { action: string; onToken: (token: string) => void; className?: string }
>(function TurnstileWidget({ action, onToken, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        onToken("");
      },
    }),
    [onToken],
  );

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    let cancelled = false;
    let intervalId: number | undefined;

    function render() {
      if (cancelled || widgetIdRef.current !== null) return;
      if (!containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY as string,
        action,
        callback: onToken,
        "error-callback": () => onToken(""),
        "expired-callback": () => onToken(""),
      });
    }

    if (window.turnstile) {
      render();
    } else {
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", render);
        document.head.appendChild(script);
      }
      // `load` may have already fired for a previously-added tag; poll as a
      // fallback rather than depending on `onReady` (multiple forms per page).
      intervalId = window.setInterval(render, 200);
    }

    return () => {
      cancelled = true;
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [action, onToken]);

  if (!TURNSTILE_SITE_KEY) return null;

  return <div ref={containerRef} className={className} />;
});

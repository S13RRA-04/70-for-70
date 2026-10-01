"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { isTurnstileEnabled, type TurnstileWidgetHandle } from "./turnstile-widget";

export type FormStatus = "idle" | "submitting" | "success" | "error";

const GENERIC_ERROR = "Something went wrong. Please try again.";

/**
 * The submit half of every public form on the site: the idle/submitting/
 * success/error state machine, the JSON POST, and the cleanup afterwards.
 *
 * A form supplies only its own fields and gets `companyWebsite` (the
 * HoneypotField input), `renderedAt` and `turnstileToken` added for it. Those
 * three are boilerplate that must match the server's bot-check schema exactly
 * (src/lib/validation/bot-check.ts) — hand-rolling them per form is how they
 * drift, and a missing `renderedAt` fails validation outright.
 */
export function useFormSubmit<TPayload>({
  endpoint,
  buildPayload,
  onSuccess,
}: {
  /** The API route to POST to, e.g. "/api/messages". */
  endpoint: string;
  /** Maps the form's own fields to the JSON body. Bot-check fields are added by the hook. */
  buildPayload: (data: FormData) => TPayload;
  /**
   * Runs after a successful POST, with the form element. Most forms render a
   * confirmation instead of the form, so they don't need this — the form is
   * never reset here, because a form that's about to unmount can't benefit.
   */
  onSuccess?: (form: HTMLFormElement) => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const renderedAtRef = useRef<number | null>(null);

  // Stamped on mount: the server treats a submission that arrived sooner than a
  // human could plausibly fill the form in as a bot.
  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      ...buildPayload(data),
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      renderedAt: renderedAtRef.current ?? Date.now(),
      turnstileToken,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? GENERIC_ERROR);
        return;
      }

      setStatus("success");
      onSuccess?.(form);
    } catch {
      setStatus("error");
      setErrorMessage(GENERIC_ERROR);
    } finally {
      // Turnstile tokens are single-use — re-arm for any retry.
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  /** Clears status and error, for a form instance that gets reused (a dialog reopened for a second submission). */
  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    status,
    errorMessage,
    turnstileToken,
    setTurnstileToken,
    turnstileRef,
    handleSubmit,
    reset,
    isSubmitting: status === "submitting",
    /** Also blocks submission until the widget is solved, once Turnstile is configured. */
    submitDisabled: status === "submitting" || (isTurnstileEnabled && !turnstileToken),
  };
}

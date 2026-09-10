"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, X } from "lucide-react";

const IOS_DISMISS_KEY = "for-the-22:ios-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const noopSubscribe = () => () => {};

/** True only after the client has hydrated — same pattern as EventStatusClock/Countdown's useMounted, avoiding a setState-in-effect for what's really just "don't touch window/localStorage during SSR." */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function isRunningStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own (non-standard) flag for "already added to home screen."
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIOS && isSafari;
}

/**
 * Install prompts for both platforms — only rendered inside src/app/app's
 * layout. iOS Safari has no beforeinstallprompt API, so it gets a static
 * instructional banner instead (dismissal remembered in localStorage,
 * never re-shown after that — see spec section 19). Android/desktop
 * Chrome gets a real install button wired to beforeinstallprompt.
 */
export function InstallPrompt() {
  const mounted = useMounted();
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    function handleInstalled() {
      setDeferredPrompt(null);
    }
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!mounted || isRunningStandalone()) return null;

  function dismissIOSPrompt() {
    window.localStorage.setItem(IOS_DISMISS_KEY, "true");
    setDismissedThisSession(true);
  }

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  const showIOSPrompt =
    !dismissedThisSession && isIOSSafari() && window.localStorage.getItem(IOS_DISMISS_KEY) !== "true";

  if (showIOSPrompt) {
    return (
      <div className="border-t border-ink/10 bg-sand-light px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink">
              Add For the 22 to Your Home Screen
            </p>
            <ol className="mt-1.5 space-y-0.5 text-xs text-charcoal-light">
              <li className="flex items-center gap-1.5">
                1. Tap the <Share size={12} aria-hidden className="inline" /> Share button
              </li>
              <li>2. Select &quot;Add to Home Screen&quot;</li>
              <li>3. Tap &quot;Add&quot;</li>
            </ol>
          </div>
          <button
            type="button"
            onClick={dismissIOSPrompt}
            aria-label="Dismiss install instructions"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-charcoal-light hover:text-ink"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (deferredPrompt) {
    return (
      <div className="border-t border-ink/10 bg-sand-light px-4 py-3">
        <button
          type="button"
          onClick={handleAndroidInstall}
          data-analytics-event="pwa_install_prompt_shown"
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-bronze px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          <Download size={16} aria-hidden />
          Install For the 22
        </button>
      </div>
    );
  }

  return null;
}

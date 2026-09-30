import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/** Refreshes the Supabase auth session cookie on every request, keeping
 * server-rendered pages (e.g. /admin) in sync with the signed-in user.
 *
 * `renderHeaders` is the caller-supplied request header set (currently the
 * CSP nonce pair built in src/middleware.ts). NextResponse.next() has to be
 * constructed from it rather than from the raw request, or Next never sees
 * the nonce and can't apply it to the scripts it inlines — the page would
 * render but ship without working JavaScript under our own CSP. */
export async function updateSupabaseSession(request: NextRequest, renderHeaders?: Headers) {
  const response = NextResponse.next(
    renderHeaders ? { request: { headers: renderHeaders } } : { request },
  );

  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          response.cookies.set(name, value);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

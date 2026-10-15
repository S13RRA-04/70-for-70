/**
 * Serves the homepage campaign film with HTTP Range support.
 *
 * Workers Static Assets ignores `Range` and always answers 200 with the full
 * body — and Safari/iOS refuses to play a <video> whose server won't return
 * 206 Partial Content. So the raw files live in public/media/ (served as plain
 * static assets) and this handler reads them through the ASSETS binding and
 * slices out the requested bytes itself.
 *
 * Only the files in FILMS are served — this is not a general asset proxy.
 * src/middleware.ts skips .mp4/.webm, so this is never caught by host
 * routing or the launch gate.
 */

const FILMS: Record<string, { asset: string; type: string }> = {
  "campaign-film.mp4": { asset: "/media/campaign-film.mp4", type: "video/mp4" },
  "campaign-film.webm": { asset: "/media/campaign-film.webm", type: "video/webm" },
  // Muted 4s background loop behind the For The 22: Live show lineup.
  "live-stage-loop.mp4": { asset: "/media/live-stage-loop.mp4", type: "video/mp4" },
  "live-stage-loop.webm": { asset: "/media/live-stage-loop.webm", type: "video/webm" },
};

const CACHE_CONTROL = "public, max-age=86400";

/** Reads a static asset via the Workers ASSETS binding, or over HTTP in plain `next dev`. */
async function loadAsset(path: string, requestUrl: string): Promise<Response> {
  const url = new URL(path, requestUrl);
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const assets = (env as unknown as { ASSETS?: { fetch: (input: URL) => Promise<Response> } }).ASSETS;
    if (assets) return assets.fetch(url);
  } catch {
    // Outside a Cloudflare request context — fall through to a same-origin fetch.
  }
  return fetch(url);
}

/** Parses a single `bytes=` range. Returns null for absent or multi-range headers (served as a full 200). */
function parseRange(header: string | null, size: number): { start: number; end: number } | "unsatisfiable" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, startText, endText] = match;
  if (startText === "" && endText === "") return null;

  let start: number;
  let end: number;
  if (startText === "") {
    // Suffix range: the last N bytes.
    const suffix = Number(endText);
    if (suffix === 0) return "unsatisfiable";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(startText);
    end = endText === "" ? size - 1 : Math.min(Number(endText), size - 1);
  }
  if (start >= size || start > end) return "unsatisfiable";
  return { start, end };
}

async function serve(request: Request, file: string, includeBody: boolean): Promise<Response> {
  const film = FILMS[file];
  if (!film) return new Response("Not found", { status: 404 });

  const upstream = await loadAsset(film.asset, request.url);
  if (!upstream.ok) return new Response("Not found", { status: 404 });
  const body = await upstream.arrayBuffer();
  const size = body.byteLength;

  const baseHeaders = {
    "Content-Type": film.type,
    "Accept-Ranges": "bytes",
    "Cache-Control": CACHE_CONTROL,
  };

  const range = parseRange(request.headers.get("range"), size);
  if (range === "unsatisfiable") {
    return new Response(null, { status: 416, headers: { ...baseHeaders, "Content-Range": `bytes */${size}` } });
  }
  if (range === null) {
    return new Response(includeBody ? body : null, {
      status: 200,
      headers: { ...baseHeaders, "Content-Length": String(size) },
    });
  }

  const { start, end } = range;
  return new Response(includeBody ? body.slice(start, end + 1) : null, {
    status: 206,
    headers: {
      ...baseHeaders,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return serve(request, (await params).file, true);
}

export async function HEAD(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return serve(request, (await params).file, false);
}

/**
 * Builds the Voices For The 22 Talent Participation Kit:
 *   public/voices/kit/voices-talent-participation-brief.pdf
 *   public/voices/kit/voices-recording-guide.pdf
 *   public/voices/kit/voices-participation-release.pdf
 *   public/voices/kit/voices-talent-kit.zip   (the PDFs + official logos + README)
 *
 * Copy comes from src/lib/content/voices-talent.ts — the same file the
 * website renders — so the documents can't drift from the portal. PDFs are
 * printed by headless Chrome (set CHROME_PATH if it isn't auto-detected).
 * No celebrity recordings or headshots are ever included.
 *
 *   npm run voices:kit
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// Same pattern as scripts/sync-verified-pathway-resources.ts: Node strips the
// types at runtime, and the `typeof import` keeps tsc happy without .ts paths.
const require = createRequire(import.meta.url);
const C = require("../../src/lib/content/voices-talent.ts") as typeof import("../../src/lib/content/voices-talent");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = join(root, "public/voices/kit");
const logo = pathToFileURL(join(root, "public/logo-white.png")).href;
const portal = `${C.TALENT_CONTACT.website}${C.PORTAL_PATHS.talent}`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Escapes a value for a CSS string literal (used in @page margin boxes). */
const css = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const list = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const updated = new Date(`${C.KIT_UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function page(title: string, body: string, opts: { version: string; draft?: boolean } = { version: C.KIT_VERSION }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Public+Sans:wght@400;600;700&display=block" rel="stylesheet">
<style>
  @page {
    size: Letter; margin: 0.55in 0.6in 0.7in;
    @bottom-left { content: "For The 22 · ${css(title)}"; font: 7.5pt "Public Sans", Arial, sans-serif; color: #4a4d52; }
    @bottom-right { content: "${css(`${opts.draft ? `DRAFT v${opts.version}` : `Version ${opts.version}`} · Updated ${updated} · ${C.TALENT_CONTACT.email}`)}"; font: 7.5pt "Public Sans", Arial, sans-serif; color: #4a4d52; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Public Sans", Arial, sans-serif; color: #3e4247; font-size: 10.2pt; line-height: 1.45; }
  .band { background: #121e3d; color: #fff; padding: 18px 22px; border-radius: 10px; display: flex; align-items: center; gap: 18px; }
  .band img { width: 64px; height: 64px; }
  .eyebrow { font-size: 7.5pt; letter-spacing: .2em; text-transform: uppercase; color: #f5d000; font-weight: 700; }
  h1 { font-family: Anton, Impact, sans-serif; font-weight: 400; text-transform: uppercase; font-size: 28pt; line-height: 1; margin: 4px 0 0; }
  h2 { font-family: Anton, Impact, sans-serif; font-weight: 400; text-transform: uppercase; color: #121e3d; font-size: 13pt; margin: 16px 0 5px; letter-spacing: .02em; }
  p { margin: 0 0 7px; }
  ul { margin: 0 0 6px; padding-left: 16px; } li { margin: 0 0 3px; }
  .lead { font-family: Anton, Impact, sans-serif; text-transform: uppercase; color: #121e3d; font-size: 15pt; line-height: 1.15; margin: 14px 0 8px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 26px; }
  .metrics { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid #dedad0; border-radius: 8px; margin: 10px 0; }
  .metrics div { text-align: center; padding: 8px; border-left: 1px solid #dedad0; } .metrics div:first-child { border-left: 0; }
  .metrics b { display: block; font-family: Anton, Impact, sans-serif; font-weight: 400; color: #121e3d; font-size: 18pt; }
  .metrics span { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; }
  .quote { border-left: 3px solid #121e3d; padding: 6px 12px; background: #f4f2ec; font-size: 10.5pt; color: #121e3d; }
  .box { border: 1px solid #dedad0; border-radius: 8px; padding: 10px 12px; margin: 8px 0; }
  .draft { border: 2px solid #c8162b; color: #c8162b; font-weight: 700; padding: 8px 12px; border-radius: 6px; margin: 10px 0; text-transform: uppercase; font-size: 9pt; letter-spacing: .05em; }
  .release p { margin-bottom: 5px; }
  .tag { font-family: Anton, Impact, sans-serif; text-transform: uppercase; color: #121e3d; font-size: 13pt; margin-top: 10px; }
  .pb { break-before: page; }
  a { color: #0a6aa6; text-decoration: none; }
</style></head><body>
${body}
</body></html>`;
}

const header = (eyebrow: string, title: string) =>
  `<div class="band"><img src="${logo}" alt="For The 22"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1></div></div>`;

const contactBlock = `<div class="box"><b>${esc(C.TALENT_CONTACT.name)}</b> · ${esc(C.TALENT_CONTACT.title)}<br>
<a href="mailto:${C.TALENT_CONTACT.email}">${esc(C.TALENT_CONTACT.email)}</a> · <a href="${C.TALENT_CONTACT.website}">forthe22.org</a><br>
Talent portal: <a href="${portal}">${esc(portal.replace("https://", ""))}</a></div>`;

const brief = page(
  "Talent Participation Brief",
  `${header(C.HERO.eyebrow, C.HERO.title)}
<p class="lead">${esc(C.HERO.headline)}</p>
<p>${esc(C.HERO.body)}</p>
<div class="metrics">${C.PARTICIPATION_SUMMARY.map((m) => `<div><b>${esc(m.value)}${m.unit ? ` <small style="font-size:9pt">${esc(m.unit.toUpperCase())}</small>` : ""}</b><span>${esc(m.label)}</span></div>`).join("")}</div>
<div class="cols"><div>
<h2>The initiative</h2>${C.ABOUT_INITIATIVE.map((p) => `<p>${esc(p)}</p>`).join("")}
<h2>Our founder</h2>${C.ABOUT_FOUNDER.map((p) => `<p>${esc(p)}</p>`).join("")}
</div><div>
<h2>The request</h2><p>${esc(C.INVITATION.intro)} <b>${esc(C.INVITATION.voluntary)}</b></p>${list(C.INVITATION.points)}
<p><i>${esc(C.INVITATION.closing)}</i></p>
<h2>Intended audience</h2><p>${esc(C.AUDIENCE)}</p>
</div></div>
<div class="pb"></div>
<div class="cols"><div>
<h2>Recording requirements</h2>${list(C.TECHNICAL_GUIDELINES)}<p>${esc(C.DURATION_NOTE)}</p>
<h2>Distribution channels</h2>${list(C.DISTRIBUTION)}
<h2>Publication timing</h2><p>${esc(C.PUBLICATION_TIMING)}</p>
</div><div>
<h2>Usage restrictions</h2><p>Edits are limited to ${esc(C.PERMITTED_EDITS.join(", ").toLowerCase())}. ${esc(C.EDIT_LIMIT)}</p>
<p><b>Never used in:</b></p>${list(C.PROHIBITED_USES)}<p>${esc(C.EXPANDED_USE)}</p>
<h2>Your controls</h2>${list(C.PARTICIPANT_CONTROLS)}
</div></div>
<h2>Next steps</h2>
<p>Recording guide: <a href="${C.TALENT_CONTACT.website}${C.PORTAL_PATHS.recordingGuide}">forthe22.org${C.PORTAL_PATHS.recordingGuide}</a> ·
Secure submission: <a href="${C.TALENT_CONTACT.website}${C.PORTAL_PATHS.submit}">forthe22.org${C.PORTAL_PATHS.submit}</a> ·
Permissions: <a href="${C.TALENT_CONTACT.website}${C.PORTAL_PATHS.permissions}">forthe22.org${C.PORTAL_PATHS.permissions}</a></p>
${contactBlock}
<p class="tag">${esc(C.TAGLINE)}</p>`,
);

const guide = page(
  "Recording Guide",
  `${header("Voices For The 22", "Recording Guide")}
<p class="lead">Your phone is enough. Your words are what matter.</p>
<div class="cols"><div>
<h2>Technical guidelines</h2>${list(C.TECHNICAL_GUIDELINES)}<p>${esc(C.DURATION_NOTE)}</p>
</div><div>
<h2>Suggested talking points</h2>${list(C.TALKING_POINTS)}<p>${esc(C.TALKING_POINTS_NOTE)}</p>
</div></div>
<h2>Optional sample message</h2>
<p class="quote">“${esc(C.SAMPLE_MESSAGE)}”</p>
<p><i>${esc(C.SAMPLE_MESSAGE_NOTE)}</i></p>
<h2>Send it</h2>
<p>Upload securely at <a href="${C.TALENT_CONTACT.website}${C.PORTAL_PATHS.submit}">forthe22.org${C.PORTAL_PATHS.submit}</a>, or email a secure link to <a href="mailto:${C.TALENT_CONTACT.email}">${esc(C.TALENT_CONTACT.email)}</a>.</p>
<p class="tag">${esc(C.TAGLINE)}</p>`,
);

const release = page(
  "Participation Release",
  `${header("Voices For The 22", "Participation Release")}
${C.RELEASE_IS_DRAFT ? `<div class="draft">${esc(C.RELEASE_DRAFT_NOTICE)}</div>` : ""}
<p>Limited-use release between the participant (or their authorized representative) and For The 22, an independent, veteran-led initiative.
This release does not grant unrestricted, perpetual, irrevocable or commercial rights.</p>
<div class="release">${C.RELEASE_SECTIONS.map((s) => `<h2>${esc(s.heading)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("")}</div>
${contactBlock}`,
  { version: C.RELEASE_VERSION, draft: C.RELEASE_IS_DRAFT },
);

// ---- Render ---------------------------------------------------------------

function findChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter((p): p is string => Boolean(p));
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("Chrome not found — set CHROME_PATH.");
  return found;
}

const chrome = findChrome();
const work = mkdtempSync(join(tmpdir(), "voices-kit-"));
mkdirSync(outDir, { recursive: true });

const docs = [
  { file: "voices-talent-participation-brief.pdf", html: brief },
  { file: "voices-recording-guide.pdf", html: guide },
  { file: "voices-participation-release.pdf", html: release },
];

for (const doc of docs) {
  const htmlPath = join(work, doc.file.replace(".pdf", ".html"));
  writeFileSync(htmlPath, doc.html);
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=8000",
    "--allow-file-access-from-files",
    `--print-to-pdf=${join(outDir, doc.file)}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: "ignore" });
  console.log(`✓ ${doc.file}`);
}

// ---- Zip (store method, no dependencies) -----------------------------------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(entries: { name: string; data: Uint8Array }[]): Buffer {
  const local: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  const d = new Date(`${C.KIT_UPDATED}T12:00:00Z`);
  const dosTime = (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5);
  const dosDate = ((d.getUTCFullYear() - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate();
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const crc = crc32(e.data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(dosTime, 10); lh.writeUInt16LE(dosDate, 12); lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(e.data.length, 18); lh.writeUInt32LE(e.data.length, 22); lh.writeUInt16LE(name.length, 26);
    local.push(lh, name, Buffer.from(e.data));
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8);
    ch.writeUInt16LE(0, 10); ch.writeUInt16LE(dosTime, 12); ch.writeUInt16LE(dosDate, 14); ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(e.data.length, 20); ch.writeUInt32LE(e.data.length, 24); ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(offset, 42);
    central.push(ch, name);
    offset += 30 + name.length + e.data.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralBuf, end]);
}

const readme = `Voices For The 22 — Talent Participation Kit
Version ${C.KIT_VERSION} · Updated ${updated}

Contents
  voices-talent-participation-brief.pdf   Initiative overview and the request (2 pages)
  voices-recording-guide.pdf              One-page recording reference
  voices-participation-release.pdf        Proposed limited-use release — v${C.RELEASE_VERSION}${C.RELEASE_IS_DRAFT ? " (DRAFT: pending founder and legal review; not for signature)" : ""}
  logos/for-the-22-logo.png               Official For The 22 logo (use on light backgrounds)
  logos/for-the-22-logo-white.png         Official For The 22 logo, white (use on dark backgrounds)

Please use the logos as provided — do not alter, recolor or recreate them.

Talent portal: ${portal}
Contact: ${C.TALENT_CONTACT.name}, ${C.TALENT_CONTACT.title} — ${C.TALENT_CONTACT.email}

${C.TAGLINE}
`;

const prefix = "voices-talent-kit/";
const archive = zip([
  ...docs.map((d) => ({ name: `${prefix}${d.file}`, data: readFileSync(join(outDir, d.file)) })),
  { name: `${prefix}logos/for-the-22-logo.png`, data: readFileSync(join(root, "public/logo.png")) },
  { name: `${prefix}logos/for-the-22-logo-white.png`, data: readFileSync(join(root, "public/logo-white.png")) },
  { name: `${prefix}README.txt`, data: Buffer.from(readme.replace(/\n/g, "\r\n"), "utf8") },
]);
writeFileSync(join(outDir, "voices-talent-kit.zip"), archive);
console.log("✓ voices-talent-kit.zip");

rmSync(work, { recursive: true, force: true });

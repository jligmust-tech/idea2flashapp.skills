#!/usr/bin/env node
/**
 * flashapp — cross-platform CLI for the idea2flashapp skill.
 * Works on Windows, macOS and Linux with only Node.js. No dependencies.
 *
 *   flashapp.mjs new      --slug <slug> --title "<title>" [--purpose "<text>"] [--out <dir>] [--force]
 *   flashapp.mjs register --path <app.html> --title "<title>" --slug <slug>
 *                         [--archetype <type>] [--source "<provenance>"] [--dir <dir>] [--no-open]
 *   flashapp.mjs open     --path <app.html>
 *   flashapp.mjs list     [--dir <dir>]
 */
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, rmSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = resolve(__dirname, "..", "assets", "template.html");

/* ----------------------------- helpers ----------------------------- */
function slugify(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function openFile(p) {
  try {
    if (process.platform === "win32") {
      execFileSync(process.env.ComSpec || "cmd.exe", ["/c", "start", "", p], { stdio: "ignore" });
    } else if (process.platform === "darwin") {
      execFileSync("open", [p], { stdio: "ignore" });
    } else {
      execFileSync("xdg-open", [p], { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

function defaultDir() { return join(process.cwd(), "flashapps"); }

/* ------------------------------- new ------------------------------- */
function cmdNew(a) {
  if (!a.title) fail("new: --title is required");
  const slug = slugify(a.slug || a.title);
  if (!slug) fail("new: slug is empty after normalisation");
  const outDir = resolve(a.out || defaultDir());
  const appDir = join(outDir, slug);
  const appFile = join(appDir, "index.html");

  if (existsSync(appFile) && !a.force) fail(`already exists: ${appFile} (use --force)`);
  if (!existsSync(TEMPLATE)) fail(`template not found: ${TEMPLATE}`);

  mkdirSync(appDir, { recursive: true });
  const html = readFileSync(TEMPLATE, "utf8")
    .replaceAll("{{TITLE}}", a.title)
    .replaceAll("{{PURPOSE}}", a.purpose || "A single-file app that applies this idea.")
    .replaceAll("{{SLUG}}", slug);
  writeFileSync(appFile, html, "utf8");
  console.log(appFile);
}

/* ----------------------------- register ---------------------------- */
function cmdRegister(a) {
  if (!a.path) fail("register: --path is required");
  if (!a.title) fail("register: --title is required");
  const appFile = resolve(a.path);
  if (!existsSync(appFile)) fail(`not found: ${appFile}`);
  const slug = slugify(a.slug || a.title);
  const dir = resolve(a.dir || defaultDir());
  mkdirSync(dir, { recursive: true });

  const regPath = join(dir, "registry.json");
  let apps = [];
  if (existsSync(regPath)) {
    try { apps = JSON.parse(readFileSync(regPath, "utf8")).apps || []; } catch { apps = []; }
  }
  apps = apps.filter((x) => x.slug !== slug);
  apps.push({
    slug, title: a.title,
    archetype: a.archetype || "custom",
    source: a.source || "user idea",
    path: `${slug}/index.html`,
    updatedAt: new Date().toISOString(),
  });
  writeFileSync(regPath, JSON.stringify({ updatedAt: new Date().toISOString(), apps }, null, 2) + "\n", "utf8");

  writeGallery(dir, apps);
  console.log(`Registered '${a.title}' -> ${slug}/index.html`);
  console.log(`Gallery: ${join(dir, "index.html")}`);
  if (!a["no-open"]) openFile(appFile);
}

/* ------------------------------- list ------------------------------ */
function cmdList(a) {
  const regPath = join(resolve(a.dir || defaultDir()), "registry.json");
  if (!existsSync(regPath)) { console.log("No flashapps registered."); return; }
  const apps = (JSON.parse(readFileSync(regPath, "utf8")).apps) || [];
  if (!apps.length) { console.log("No flashapps registered."); return; }
  for (const x of apps.sort((p, q) => p.title.localeCompare(q.title))) {
    console.log(`- ${x.title}  [${x.archetype}]  ${x.path}  (${x.source})`);
  }
}

/* ------------------------------- open ------------------------------ */
function cmdOpen(a) {
  if (!a.path) fail("open: --path is required");
  const p = resolve(a.path);
  if (!existsSync(p)) fail(`not found: ${p}`);
  if (openFile(p)) console.log(`Opened ${p}`);
  else console.log(`Could not open automatically. Open manually: ${p}`);
}

/* ----------------------------- gallery ----------------------------- */
function writeGallery(dir, apps) {
  const cards = apps
    .slice()
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    .map((x) => `    <a class="card" href="${esc(x.path)}">
      <span class="tag">${esc(x.archetype)}</span>
      <h3>${esc(x.title)}</h3>
      <p class="meta">${esc(x.source)}</p>
    </a>`).join("\n");

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light"><title>Flashapps</title>
<style>
 :root{--bg:#0f1115;--surface:#171a21;--border:#262b36;--text:#e8eaed;--muted:#9aa4b2;--accent:#5b8cff}
 @media (prefers-color-scheme:light){:root{--bg:#f5f6f8;--surface:#fff;--border:#e2e5ea;--text:#14171c;--muted:#5b6472}}
 *{box-sizing:border-box}
 body{margin:0;padding:32px 16px 64px;background:var(--bg);color:var(--text);
      font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
 .wrap{max-width:900px;margin:0 auto}
 h1{margin:0 0 4px;font-size:1.6rem}
 .sub{color:var(--muted);margin:0 0 28px}
 .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
 .card{display:block;background:var(--surface);border:1px solid var(--border);
       border-radius:14px;padding:18px;text-decoration:none;color:inherit;transition:border-color .15s}
 .card:hover{border-color:var(--accent)}
 .card h3{margin:8px 0 6px;font-size:1.05rem}
 .meta{margin:0;color:var(--muted);font-size:.85rem}
 .tag{display:inline-block;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;
      color:var(--accent);border:1px solid var(--border);border-radius:999px;padding:2px 8px}
</style></head>
<body><div class="wrap">
 <h1>Flashapps</h1>
 <p class="sub">${apps.length} app(s) generated from ideas.</p>
 <div class="grid">
${cards}
 </div>
</div></body></html>
`;
  writeFileSync(join(dir, "index.html"), html, "utf8");
}

/* ------------------------------- main ------------------------------ */
function fail(msg) { console.error("error: " + msg); process.exit(1); }

const argv = process.argv.slice(2);
const cmd = argv.shift();
const args = parseArgs(argv);

switch (cmd) {
  case "new": cmdNew(args); break;
  case "register": cmdRegister(args); break;
  case "open": cmdOpen(args); break;
  case "list": cmdList(args); break;
  case undefined:
  case "-h":
  case "--help":
  case "help":
    console.log(readFileSync(__filename, "utf8").split("\n").slice(1, 11).map((l) => l.replace(/^ \*? ?/, "")).join("\n"));
    break;
  default: fail(`unknown command '${cmd}' (try: new | register | open | list)`);
}

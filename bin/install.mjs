#!/usr/bin/env node
/**
 * install — drop the idea2flashapp skill into the skill directories that
 * Claude Code, opencode, and other Agent-Skills-compatible tools scan.
 *
 *   node bin/install.mjs                 # user-level: claude + opencode + agents
 *   node bin/install.mjs --project .     # project-level: .claude/skills + .opencode/skills
 *   node bin/install.mjs --only claude,agents
 *   node bin/install.mjs --copy          # copy instead of symlink
 *
 * Codex and other AGENTS.md-based tools don't use skill directories; for those
 * see the snippet printed at the end (or integrations/AGENTS.snippet.md).
 */
import {
  existsSync, mkdirSync, rmSync, symlinkSync, cpSync, lstatSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import os from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const SKILL_SRC = join(REPO, "skills", "idea2flashapp");

function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      if (["copy", "help", "h"].includes(k)) o[k] = true;
      else { o[k] = argv[++i]; }
    } else o._.push(a);
  }
  return o;
}

function linkOrCopy(src, dest, copy) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  if (copy) {
    cpSync(src, dest, { recursive: true });
    return "copied";
  }
  try {
    symlinkSync(src, dest, process.platform === "win32" ? "junction" : "dir");
    return "linked";
  } catch {
    cpSync(src, dest, { recursive: true });
    return "copied (symlink unavailable)";
  }
}

const a = parseArgs(process.argv.slice(2));
if (a.help || a.h) {
  console.log("usage: node bin/install.mjs [--project <dir>] [--only claude,opencode,agents] [--copy]");
  process.exit(0);
}
const copy = !!a.copy;
const only = a.only ? String(a.only).split(",").map((s) => s.trim()) : null;
const home = os.homedir();

let base;
if (a.project) {
  base = resolve(a.project);
  console.log(`Installing into project: ${base}`);
} else {
  base = home;
  console.log(`Installing into user home: ${home}`);
}

const targets = a.project
  ? {
      claude: join(base, ".claude", "skills", "idea2flashapp"),
      opencode: join(base, ".opencode", "skills", "idea2flashapp"),
    }
  : {
      claude: join(base, ".claude", "skills", "idea2flashapp"),
      opencode: join(base, ".config", "opencode", "skills", "idea2flashapp"),
      agents: join(base, ".agents", "skills", "idea2flashapp"),
    };

if (!existsSync(SKILL_SRC)) {
  console.error(`error: skill not found at ${SKILL_SRC}`);
  process.exit(1);
}

for (const [name, dest] of Object.entries(targets)) {
  if (only && !only.includes(name)) continue;
  const how = linkOrCopy(SKILL_SRC, dest, copy);
  console.log(`  [${name}] ${how} -> ${dest}`);
}

console.log(`
Done. Restart your agent so it picks up the skill.

Next steps by tool:
  - Claude Code   : installed above (~/.claude/skills or <project>/.claude/skills)
  - opencode      : installed above; or add this repo's "skills" folder to opencode.json "skills.paths"
  - AGENTS.md tools (Codex, Cursor, Gemini CLI, Zed, Copilot, Aider, ...):
      paste integrations/AGENTS.snippet.md into your project's AGENTS.md
      (or ~/.codex/AGENTS.md for Codex globally).
  - Gemini CLI    : set { "context": { "fileName": "AGENTS.md" } } in .gemini/settings.json
  - Codex prompt  : copy integrations/codex/prompts/idea2flashapp.md to ~/.codex/prompts/
`);

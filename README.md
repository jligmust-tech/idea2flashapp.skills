# idea2flashapp.skills

Turn an **idea** — a pasted thought, a web link, or a document file — into a
runnable **local web app** we call a **flashapp**.

A flashapp is a single, self-contained `.html` file that opens instantly in a
browser and *operationalizes* the idea. If the idea explains how to analyze a
decision, the skill produces a decision flashapp that walks the user through
that exact logic and returns an answer with its reasoning.

This repo is **agent-tool-agnostic**: the same skill works with Claude Code,
opencode, Codex, Cursor, Gemini CLI, Zed, Copilot, Aider, and any other tool
that reads `SKILL.md` or `AGENTS.md`.

## Install — pick your tool

| Tool | How |
| --- | --- |
| **Claude Code**, **opencode**, any Agent-Skills tool | `node bin/install.mjs` (user-level) or `node bin/install.mjs --project .` |
| **Codex**, **Cursor**, **Gemini CLI**, **Zed**, **Copilot**, **Aider**, … | paste [`integrations/AGENTS.snippet.md`](integrations/AGENTS.snippet.md) (paths filled in) into your project's `AGENTS.md`; for Codex globally, `~/.codex/AGENTS.md` |
| **Codex slash command** | copy [`integrations/codex/prompts/idea2flashapp.md`](integrations/codex/prompts/idea2flashapp.md) to `~/.codex/prompts/` |
| **Gemini CLI** | [`integrations/gemini/settings.snippet.json`](integrations/gemini/settings.snippet.json) |
| **opencode (this repo only)** | already wired via [`opencode.json`](opencode.json) |

`bin/install.mjs` links (or `--copy`s) `skills/idea2flashapp` into
`~/.claude/skills`, `~/.config/opencode/skills`, and `~/.agents/skills`. Restart
your agent afterwards. Run `node bin/install.mjs --help` for options.

## Use

Just talk to the agent:

> Here's an article on how to decide whether to take a course: `<link>`. Make me a flashapp for it.

> I have this decision framework in `notes/decision.md` — turn it into an app.

The skill extracts the idea, picks a flashapp archetype, writes a single-file
app into `flashapps/<slug>/index.html`, updates the gallery + registry, and
opens it in the browser.

## Build CLI

The CLI is plain Node.js (no dependencies) and runs on Windows, macOS and Linux:

```
node skills/idea2flashapp/scripts/flashapp.mjs new      --slug <slug> --title "<title>" [--purpose "<text>"]
node skills/idea2flashapp/scripts/flashapp.mjs register --path <app.html> --title "<title>" --slug <slug> --archetype <type> --source "<provenance>"
node skills/idea2flashapp/scripts/flashapp.mjs open     --path <app.html>
node skills/idea2flashapp/scripts/flashapp.mjs list
```

A Windows-only PowerShell equivalent lives in `skills/idea2flashapp/scripts/*.ps1`.
Neither is required — the generated apps are just files.

## Repo layout

```
AGENTS.md                 Portable instructions for AGENTS.md-based agents.
opencode.json             Registers the local skills path for opencode.
bin/install.mjs           Installs the skill into Claude/opencode/agents dirs.
integrations/             AGENTS.md snippet, Codex prompt, Gemini settings.
skills/idea2flashapp/
  SKILL.md                The workflow (Claude Code / opencode / Agent-Skills).
  reference/              extraction, archetypes, flashapp-spec.
  assets/template.html    Zero-dependency single-file app shell.
  scripts/                flashapp.mjs (cross-platform) + *.ps1 (Windows).
flashapps/                (created in the target project) apps + gallery + registry.
```

## The contract

Every flashapp: one file, zero dependencies, fully offline, results that show
their reasoning, assumptions labeled `[inferred]`, and provenance in an "About"
section. Full details in
[`reference/flashapp-spec.md`](skills/idea2flashapp/reference/flashapp-spec.md).

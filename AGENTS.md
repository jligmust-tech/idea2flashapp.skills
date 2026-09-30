# AGENTS.md

This repository ships the **idea2flashapp** skill. It is agent-tool-agnostic: the
same instructions work for Claude Code, opencode, Codex, Cursor, Gemini CLI, and
any other agent that reads `SKILL.md` or `AGENTS.md`.

## What the skill does

Given an idea, or material containing ideas (pasted text, a web link, a document
file), it extracts the **operable core** and builds a **flashapp**: a single,
self-contained local `.html` file that lets the user repeatedly *apply* the idea
(for example, a decision-analysis idea becomes a decision app).

## Canonical instructions

`skills/idea2flashapp/SKILL.md` is the source of truth. Read it, then read:

- `skills/idea2flashapp/reference/extraction.md`
- `skills/idea2flashapp/reference/archetypes.md`
- `skills/idea2flashapp/reference/flashapp-spec.md`

The `flashapp-spec.md` contract is non-negotiable: one file, zero dependencies,
offline, a pure `evaluate(inputs) -> {result, reasons}` function, results that
show their reasoning, labeled `[inferred]` assumptions, and provenance.

## Building a flashapp

Cross-platform (Node.js, any OS):

```
node skills/idea2flashapp/scripts/flashapp.mjs new      --slug <slug> --title "<title>" [--purpose "<text>"]
node skills/idea2flashapp/scripts/flashapp.mjs register --path <app.html> --title "<title>" --slug <slug> --archetype <type> --source "<provenance>"
node skills/idea2flashapp/scripts/flashapp.mjs list
```

Windows-native alternative (PowerShell 5.1+):

```
powershell -NoProfile -ExecutionPolicy Bypass -File skills/idea2flashapp/scripts/New-Flashapp.ps1 -Slug <slug> -Title "<title>"
powershell -NoProfile -ExecutionPolicy Bypass -File skills/idea2flashapp/scripts/Register-Flashapp.ps1 -Path <app.html> -Title "<title>" -Slug <slug> -Archetype <type> -Source "<provenance>"
```

Generated apps live in `flashapps/<slug>/index.html`; the gallery is
`flashapps/index.html`. The scripts are optional — the file operations can be
done by hand if neither Node nor PowerShell is available.

## Installing into other agents

- **Claude Code / opencode / Agent-Skills tools**: `node bin/install.mjs`
  (user-level) or `node bin/install.mjs --project .`
- **Codex / Cursor / Gemini CLI / any AGENTS.md tool**: paste
  `integrations/AGENTS.snippet.md` (with paths filled in) into the project's
  `AGENTS.md`; for Codex globally, `~/.codex/AGENTS.md`.
- **Codex slash command**: copy `integrations/codex/prompts/idea2flashapp.md`
  to `~/.codex/prompts/`.
- **Gemini CLI**: `integrations/gemini/settings.snippet.json`.

## Editing this repo

- Keep `SKILL.md` frontmatter to `name` + `description` only — that is the
  portable subset across skill loaders.
- Keep generated flashapps single-file and dependency-free.
- Do not add agent-specific requirements to the core `SKILL.md`; put
  tool-specific wiring in `integrations/`.

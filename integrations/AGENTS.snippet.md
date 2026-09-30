<!--
  idea2flashapp — portable snippet.
  Paste this into your project's AGENTS.md (or ~/.codex/AGENTS.md for Codex)
  when you are NOT installing it as a loadable skill. Works with any
  AGENTS.md-aware agent: Codex, Cursor, Gemini CLI, Zed, Copilot, Aider, ...
  Keep the path below pointed at wherever this skill repo lives on disk.
-->

## Skill: idea2flashapp (idea → flashapp)

When the user provides an idea or material containing ideas (pasted text, a web
link, or a document file) and wants it turned into a runnable local app, follow
the workflow in **`<path-to-idea2flashapp.skills>/skills/idea2flashapp/SKILL.md`**
and read these before building:

- `<...>/reference/extraction.md`   — extract the idea's operable core
- `<...>/reference/archetypes.md`   — pick the app shape
- `<...>/reference/flashapp-spec.md` — the hard contract

Summary of the contract: produce a **single self-contained `.html`** file (no
CDN, no build step, works offline) with one pure `evaluate(inputs) -> {result,
reasons}` function, UI controls for exactly the idea's inputs, a result panel
that **shows the reasoning**, an "About" section stating the idea + source, and
assumptions labeled `[inferred]`. Scaffold and register it with the
cross-platform CLI:

```
node <...>/skills/idea2flashapp/scripts/flashapp.mjs new --slug <slug> --title "<title>"
node <...>/skills/idea2flashapp/scripts/flashapp.mjs register --path <app.html> --title "<title>" --slug <slug> --archetype <type> --source "<provenance>"
```

Apps live in `flashapps/<slug>/index.html`; the gallery is `flashapps/index.html`.

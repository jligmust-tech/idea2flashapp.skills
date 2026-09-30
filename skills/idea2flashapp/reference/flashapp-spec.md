# Flashapp spec — the contract

Every generated flashapp **must** satisfy this. It's what makes it a flashapp
instead of a webpage.

## Hard requirements

1. **One file.** A single `.html`. No separate `.css`/`.js`, no build step.
2. **Zero dependencies.** No CDN, no npm, no fonts fetched at runtime. Inline
   CSS in `<style>`, JS in `<script>`. Works with the network unplugged.
3. **Runs anywhere.** Double-click → open. No server required.
4. **Pure logic, thin UI.** The idea lives in one pure function:
   ```js
   function evaluate(inputs) { /* idea logic */ return { result, reasons }; }
   ```
   Rendering only reads its return value. This keeps the ideafaithful and testable.
5. **Explained results.** Every output shows *why*: which rule fired, which
   factors dominated, the formula with the user's numbers. Never a bare verdict.
6. **Labeled assumptions.** Inferred rules/weights/thresholds appear in the
   About box marked `[inferred]` (see `extraction.md`). Expose the important ones
   as adjustable controls where cheap to do so.
7. **Provenance.** An "About this app" section states the extracted idea in plain
   language and cites the source (link title/URL, document name, or "user idea").
8. **Self-evident.** A first-time user can operate it without reading the source.
   Labels in the user's words; placeholder/example values; no jargon-only UI.
9. **Responsive.** Usable at 360px wide and on desktop. Touch targets ≥ 40px.
10. **Accessible.** Semantic HTML, labels tied to inputs, keyboard operable,
    visible focus, sufficient contrast (WCAG AA), respects
    `prefers-color-scheme`.

## Recommended

- **Persistence** for anything with repeated entries: `localStorage` with a
  namespaced key (`flashapp:<slug>:...`).
- **Export** (copy as text/Markdown, or download JSON) for canvases/trackers, so
  results leave the app.
- **Reset / example data** — a one-click "load example" so the app demos itself.
- **Print stylesheet** for planners/checklists.
- **URL-hash state** (`#inputs=...`) so a filled state is shareable/reloadable.

## Structure of the file

```
<!doctype html>
<html lang="en">
<head>
  <meta charset / viewport / color-scheme>
  <title>App name</title>
  <style>/* design tokens + layout + components */</style>
</head>
<body>
  <header>  title, one-line purpose
  <main>
    <section id="inputs">   the form (the idea's INPUTS)
    <section id="result">   the result + reasoning (the idea's OUTPUTS)
    <section id="about">    plain-language idea + provenance + [inferred] notes
  </main>
  <script>
    /* ---------- 1. IDEA DATA (rules, weights, copy from the source) ---------- */
    /* ---------- 2. LOGIC: pure evaluate(inputs) -> {result, reasons} --------- */
    /* ---------- 3. STATE: read form, persist */
    /* ---------- 4. RENDER: inputs -> view of evaluate() output ------------ */
    /* ---------- 5. BOOT: wire events, load example --------------------------------- */
  </script>
</body>
</html>
```

Keep those five JS sections as comments even in a small app — it forces the
logic to stay separate from the rendering.

## Design tokens

Start from these variables (also in `assets/template.html`); keep them so apps
from this skill feel like a family, but vary the accent per app if useful.

```css
:root{
  --bg:#0f1115; --surface:#171a21; --border:#262b36;
  --text:#e8eaed; --muted:#9aa4b2;
  --accent:#5b8cff; --good:#38c172; --warn:#f0b429; --bad:#e05a5a;
  --radius:14px; --gap:16px; --maxw:760px;
}
@media (prefers-color-scheme: light){ :root{
  --bg:#f5f6f8; --surface:#ffffff; --border:#e2e5ea;
  --text:#14171c; --muted:#5b6472;
}}
```

## Anti-patterns (do NOT do)

- A page that only *describes* the idea with no inputs and no output. That's an
  article, not a flashapp.
- A result with no reasoning ("Score: 73" — why?).
- Fetching fonts/analytics/data from the internet.
- Multi-file layouts, frameworks, or a dev server for a single idea.
- Hidden hardcoded magic numbers presented as the source's own.
- Renaming the idea's terms into generic ones, losing its vocabulary.
- Building 5 half-apps instead of one complete app.

## Definition of done

- [ ] Opens offline, no console errors, no network requests.
- [ ] Golden path + one edge case verified.
- [ ] Every result explains itself.
- [ ] Assumptions labeled; source cited; example data loads.
- [ ] Responsive at 360px; keyboard operable.

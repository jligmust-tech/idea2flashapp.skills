---
name: idea2flashapp
description: Use when the user supplies an idea, or material containing ideas (pasted text, a web link, or a document file such as .md/.txt/.pdf/.docx), and wants it turned into a runnable local web app called a "flashapp" that operationalizes that idea — for example a decision-analysis idea becomes a decision flash app. Triggers include "flashapp", "flash app", "turn this idea into an app", "make an app from this link/document", "build me a decision app", "idea to app".
---

# idea2flashapp

Convert an idea (or material that contains one) into a **flashapp**: a single
self-contained HTML file that lets the user *repeatedly apply* the idea, not
just read about it.

> If the idea explains how to make a decision, the flashapp **is** a decision
> tool: the user enters their situation, the app applies the idea's logic, and
> returns a reasoned result.

The whole job is: **capture → extract → design → build → register → verify.**
Do not skip straight to writing HTML. The value is in faithfully extracting the
idea's *operable core* before rendering it.

## Inputs

Accept any of these, in any mix:

- **Pasted text** — the user's own idea, a framework, a process, a set of rules.
- **Web link** — fetch it with the `webfetch` tool (use `markdown` format).
- **Document file** — a path in the workspace; read it. For `.pdf`/`.docx`, use
  whatever extraction is available (the Read tool handles images/PDF; if a
  binary format can't be read, say so and ask for text or a link).
- **Multiple sources** — synthesize them and note where they disagree.

If the material is thin or ambiguous, ask **at most 1–3 sharp questions** about
the intended *use* ("when you use this, what are you trying to decide/produce?").
Prefer building a labeled-draft flashapp over interrogating the user.

## Workflow

### 1. Capture
Gather the raw material into one place in context. Keep provenance: for each
claim/logic you extract, know which source it came from. If a link fails to
fetch, fall back to asking the user to paste the relevant part — never invent
the idea's content.

### 2. Extract the operable core
Follow `reference/extraction.md`. Produce a compact **Idea Spec**:

```
PURPOSE     What the user gets by applying this idea (verb + object).
INPUTS      What the user must know/provide each time.
LOGIC       The rules, steps, weights, criteria, or decision tree.
OUTPUTS     The result the app returns (a verdict, a number, a plan, a score...).
ASSUMPTIONS Gaps you had to fill; anything you inferred.
SOURCE      Where each part came from.
```

State the Idea Spec back to the user briefly **before** building, so a wrong
extraction is caught in one sentence instead of one rewrite.

### 3. Design the flashapp
Follow `reference/archetypes.md`. Choose the archetype whose *shape* matches
the idea (decision/advisor, calculator, wizard/process, canvas, quiz/trainer,
tracker, generator, comparator). Then map it:

| Idea Spec | Flashapp UI |
| --- | --- |
| INPUTS | form controls (the only things the user fills) |
| LOGIC | a pure `evaluate(inputs) -> outputs` function in the page |
| OUTPUTS | the result panel, with the reasoning shown |

If the idea is rich enough for more than one app, pick the single most useful
one and mention the others as follow-ups. Build **one** focused app well.

### 4. Build
Follow `reference/flashapp-spec.md` — it is the contract. In short:

- Start from `assets/template.html` (zero dependencies, offline, mobile-first).
- One file. No CDN, no build step, no network calls at runtime.
- Logic is a pure function; UI is a thin render layer over it.
- Every result shows **how** it was derived (which rule fired, which score won).
- Include an "About this app" section that states the extracted idea + source.

Scaffold with (Windows PowerShell; scripts are optional — see note below):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/New-Flashapp.ps1 -Slug my-app -Title "My App"
```

### 5. Register and open
Write the app to the target project at `flashapps/<slug>/index.html`, then:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Register-Flashapp.ps1 -Path <app.html> -Title "..." -Slug <slug> -Archetype <type> -Source "<provenance>"
```

This updates `flashapps/registry.json` and regenerates the
`flashapps/index.html` gallery, then opens the app in the default browser.
The user can open the gallery to browse every flashapp they've generated.

> **Scripts are a convenience, not a requirement.** If script execution is
> blocked or PowerShell is unavailable, do the same steps by hand: copy
> `assets/template.html` to `flashapps/<slug>/index.html`, replace the
> `{{TITLE}}`/`{{PURPOSE}}`/`{{SLUG}}` placeholders, then add the entry to
> `flashapps/registry.json` and add a card to `flashapps/index.html`. Never
> block the build on the scripts.

### 6. Verify
Before declaring done:
- Open the file and sanity-check the golden path and one edge case.
- Confirm the logic in the app matches the Idea Spec (no silent drift).
- Check it works offline (no console errors, no failed external requests).
- If the user gives feedback, change the *extraction* first, then the app.

## Quality bar

A flashapp fails if the user still has to hold the idea in their head. It passes
when they can hand it to someone who never read the source and that person can
use it to apply the idea correctly. Concretely:

- **Faithful** — logic traces to the source; assumptions are labeled.
- **Operable** — the inputs it asks for are exactly the inputs the idea needs.
- **Explained** — results show the reasoning, not just a verdict.
- **Instant** — opens in <1s, works offline, no install.
- **Portable** — one file, can be emailed or committed anywhere.

## References

- `reference/extraction.md` — turning raw material into the Idea Spec.
- `reference/archetypes.md` — catalog of flashapp shapes + selection guide.
- `reference/flashapp-spec.md` — the hard contract every flashapp must meet.
- `assets/template.html` — the starting shell to copy.
- `scripts/` — `New-Flashapp.ps1`, `Register-Flashapp.ps1`, `Open-Flashapp.ps1`.

# idea2flashapp

Turn the idea or material the user gives you (pasted text, a web link, or a
document file) into a **flashapp**: a single self-contained local `.html` app
that operationalizes the idea — e.g. a decision-analysis idea becomes a decision
app that walks the user through the logic and returns a reasoned result.

Follow the workflow in the installed skill, or if it is not installed, in
`skills/idea2flashapp/SKILL.md`:

1. **Capture** the source (fetch links, read files, use pasted text; never invent
   the idea's content).
2. **Extract** the operable core into an Idea Spec (purpose, inputs, logic,
   outputs, assumptions, source). Restate it to the user before building.
3. **Design** the app by choosing an archetype (decision, calculator, wizard,
   canvas, quiz, tracker, generator, comparator).
4. **Build** a single file from `assets/template.html`: zero dependencies, one
   pure `evaluate(inputs) -> {result, reasons}`, a result panel that shows the
   reasoning, an About section with provenance, assumptions labeled `[inferred]`.
5. **Register & open** with `scripts/flashapp.mjs` (Node) or the PowerShell
   scripts. Apps go to `flashapps/<slug>/index.html`; gallery is
   `flashapps/index.html`.

Read `reference/extraction.md`, `reference/archetypes.md`, and
`reference/flashapp-spec.md` before building.

Usage:

```
node scripts/flashapp.mjs new --slug my-app --title "My App"
node scripts/flashapp.mjs register --path flashapps/my-app/index.html --title "My App" --slug my-app --archetype decision --source "<where it came from>"
```

Do not build multi-file apps, fetch anything at runtime, or return a result
without showing how it was derived.

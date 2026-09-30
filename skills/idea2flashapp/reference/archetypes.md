# Flashapp archetypes

Pick the archetype whose **shape** matches the idea's logic. When two fit,
choose the one that asks the user for less and explains more. Build one app,
not a Swiss-Army knife.

## 1. Decision / Advisor
**Logic:** criteria → verdict. Weighted sum, decision tree, or veto rules.
**UI:** criteria as sliders/selects; live result card with verdict + top drivers.
**Use when:** material tells the user how to choose (buy/skip, hire/pass, A vs B).
**Signature element:** a "why" panel listing the strongest positive and negative
factors, so the verdict is auditable.

## 2. Calculator / Estimator
**Logic:** variables → a number/range (a formula or rough model).
**UI:** numeric inputs with units; result updates as you type; show the formula.
**Use when:** the idea quantifies something (budget, ROI, timeline, dosage, score).
**Signature element:** the transparent formula line, with the user's plugged-in
numbers highlighted.

## 3. Wizard / Process Runner
**Logic:** ordered steps with branch points.
**UI:** one step per screen; progress indicator; back/next; a final summary/plan.
**Use when:** the idea is a procedure to *execute* (onboarding, diagnosis,
troubleshooting, a ritual).
**Signature element:** a generated, copyable action plan at the end.

## 4. Canvas / Framework Filler
**Logic:** a set of dimensions the user must populate (with prompts).
**UI:** sections/cards for each dimension; guidance text; save/export.
**Use when:** the idea is a model to think *within* (SWOT, business model,
retrospective, positioning).
**Signature element:** export as markdown/JSON so the filled canvas leaves the app.

## 5. Quiz / Trainer
**Logic:** questions → scoring → feedback; spaced or immediate.
**UI:** question → answer → explanation; running score; restart.
**Use when:** the idea is about *learning or drilling* something (the source is
study material, a method to internalize).
**Signature element:** the explanation shown on every answer, drawn from the source.

## 6. Tracker / Log
**Logic:** repeated entries → progress over time.
**UI:** quick-add form; list/chart of entries; streaks or totals.
**Use when:** the idea is a habit, metric, or journal to *sustain*.
**Signature element:** local persistence via `localStorage` + export.

## 7. Generator
**Logic:** parameters → produced artifact (text, plan, name, schedule).
**UI:** parameter inputs → generated output with a copy button.
**Use when:** the idea's output is *content* the user reuses.
**Signature element:** one-click copy/regenerate.

## 8. Comparator
**Logic:** N options scored across criteria → ranking or trade-off view.
**UI:** add options; rate on criteria; ranked matrix; winner highlighted.
**Use when:** the idea is about evaluating several things against each other.
**Signature element:** a trade-off view (winner per criterion), not just totals.

---

## Selection cheatsheet

| The idea says… | Archetype |
| --- | --- |
| "how to decide / whether to" | Decision / Advisor |
| "how much / how many" | Calculator / Estimator |
| "first… then…" | Wizard / Process Runner |
| "consider these aspects" | Canvas / Framework |
| "practice / learn / remember" | Quiz / Trainer |
| "every day / each time / keep track" | Tracker / Log |
| "write me a…" | Generator |
| "compare these options" | Comparator |

## Composition

Simple ideas → one archetype. Richer ideas → a **primary** archetype with a
*taste* of another (a Decision app that also keeps a Tracker log of past
decisions). Add a secondary archetype only if it removes real friction; never
let it crowd the core result.

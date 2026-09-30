# Extraction: raw material → Idea Spec

The goal is to find the **operable core** of the material: the part that, when
followed, produces a result. Everything else is context.

## Step 1 — Classify the material

| Material looks like… | The operable core is… |
| --- | --- |
| An opinion / argument | A stance + the criteria used to reach it |
| A framework / model | The dimensions, their meaning, and how they combine |
| A how-to / process | The ordered steps and their decision points |
| A checklist | The items and their pass/fail or weight |
| A rule set / policy | Conditions → actions |
| A formula / estimate | Variables and the arithmetic |
| A study method / advice | A repeatable procedure the learner runs |
| A comparison | Options × criteria + how to score |

If you cannot name the core in one sentence, the material is either
inspirational (no operable core) or you need to ask the user what they want to
*do* with it. An app built on an idea with no operable core is a poster, not a
flashapp — say so.

## Step 2 — Fill the Idea Spec

```
PURPOSE      "After using this, the user can <verb> <object>."
INPUTS       Each datum the idea needs. For each: type, range, who knows it.
LOGIC        Rules / steps / weights / tree, in the idea's own terms.
OUTPUTS      The result + any reasoning the idea says to show.
ASSUMPTIONS  What you filled in. Mark [inferred] vs [stated].
SOURCE       Location of each element (link section, page, paragraph, user quote).
```

### Inputs
Ask: *does the idea actually require this, or am I adding it?* Only keep inputs
the idea's logic consumes. Prefer inputs a normal person can answer without
research (a rough 1–5 rating beats an exact dollar figure unless the idea needs
the exact figure).

### Logic
Transcribe it faithfully — same criteria, same order, same weights. Preserve the
idea's vocabulary (if it says "reversibility", don't rename it "flexibility").
Where the idea combines things, capture the operator: weighted sum, veto/knockout,
sequence, threshold, conditional branch. Where it gives no rule, mark the gap.

### Outputs
Match the resolution of the idea. A "go / no-go" idea returns a verdict, not a
percentage. A ranking idea returns an ordered list. Include the reasoning the
idea implies ("because X outweighed Y").

## Step 3 — Find and label the gaps

Real material is incomplete. For every gap, choose one and **label it in the
app**:

1. **Ask** the user (only if it's truly load-bearing).
2. **Infer** a sensible default and mark it `[inferred]` in the app's About box.
3. **Expose** it as a user-adjustable setting in the app ("weight for speed").

Never silently invent logic and present it as the idea. Presented assumptions are
a feature; hidden ones are a bug.

## Step 4 — Restate before building

Send the user a 3–6 line restatement: purpose, the inputs, the rule in one line,
the output, and any assumption. One "this is right" here saves a rebuild.

## Worked example

Source: a blog post, *"How to decide whether to take an online course."*

```
PURPOSE      Decide enroll / skip a course.
INPUTS       goal alignment (0-5), time per week available (hrs),
             cost ($), opportunity cost ($), credential value (0-5),
             motivation without external pressure (0-5).
LOGIC        Weighted score: goal*3 + cred*2 + motivation*2
             - (cost + oppcost)/hours.  Verdict: >=20 enroll,
             10-19 try the first week, <10 skip.
OUTPUTS      Score + verdict + the two biggest positive and negative factors.
ASSUMPTIONS  [inferred] weights 3/2/2; thresholds 20/10 — post gave no numbers.
SOURCE       blog §"A quick test"; thresholds [inferred].
```

Notice: the post's *qualitative* test became explicit numbers, and the numbers
are labeled `[inferred]` so the user can correct them — and the app should let
them.

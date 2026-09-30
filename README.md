# idea2flashapp.skills

Turn an **idea** — a pasted thought, a web link, or a document file — into a
runnable **local web app** we call a **flashapp**.

A flashapp is a single, self-contained `.html` file that opens instantly in a
browser and *operationalizes* the idea. If the idea explains how to analyze a
decision, the skill produces a decision flashapp that walks the user through
that exact logic and returns an answer.

## Skills in this repo

| Skill | What it does |
| --- | --- |
| [`idea2flashapp`](skills/idea2flashapp/SKILL.md) | Extract the operable core of an idea from text / link / document and build a flashapp from it. |

## Install

Point opencode at this repo's skills folder. In your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": ["../idea2flashapp.skills/skills"]
  }
}
```

Or copy `skills/idea2flashapp/` into `~/.config/opencode/skills/`.

## Use

Just talk to the agent:

> Here's an article on how to decide whether to take a course: <link>. Make me a flashapp for it.

> I have this decision framework in `notes/decision.md` — turn it into an app.

The skill extracts the idea, picks a flashapp archetype, writes a single-file
app into `flashapps/<slug>/index.html`, updates the gallery + registry, and
opens it in the browser.

## Repo layout

```
skills/idea2flashapp/
  SKILL.md              The workflow the agent follows.
  reference/
    extraction.md       How to pull the operable core out of raw material.
    archetypes.md       The catalog of flashapp shapes and when to use each.
    flashapp-spec.md    The contract every generated flashapp must satisfy.
  assets/template.html  Zero-dependency single-file app shell.
  scripts/              Scaffold / register / open helpers.
flashapps/              (created in the target project) generated apps + gallery.
```

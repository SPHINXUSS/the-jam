# WIKI.md — The Jam Wiki Schema

Rulebook for `ai/wiki/`, this project's living knowledge base. The agent
maintains it every session. Read this before ingest / query / lint.

## What the wiki is

Small, interlinked markdown pages. `index.md` is the entry point
(Current State + catalog). `log.md` is the timeline. This wiki — not chat
history, not the transcripts — is the memory of the project.

## Lanes (do not blur)

- `CLAUDE.md` (repo root) = how to work in this codebase. Not here.
- `~/.claude/.../memory/` = durable user/preference facts. Not here.
- `ai/wiki/` = the game's documented design, state, decisions, gaps, history.
- `ai/source/` = frozen primary sources (the GPT and Claude transcripts).
  Never edited. Quoted from, never rewritten.

## Page types

| Folder | Type | One page per |
|---|---|---|
| `overview.md` | overview | the whole project (single file) |
| `features/` | feature | player-facing system (a mechanic they touch) |
| `modules/` | module | technical subsystem / file area |
| `decisions/` | decision | design or architecture decision (ADR) |
| `gaps/` | gap | open bug, imbalance, or unbuilt intent |
| `plans/` | plan | plan or work batch |
| `sessions/` | session | work session handover |

## Page format

Filename: kebab-case slug (`act-i-economy.md`, `003-manual-selling.md`).
Every page starts with frontmatter:

```markdown
---
title: Human Title
type: feature        # feature|module|decision|gap|plan|session|overview
status: active       # active|done|superseded|blocked|open|closed (per type)
updated: YYYY-MM-DD
---
```

Link related pages with `[[other-slug]]`. Link liberally — a `[[slug]]`
with no page yet flags a page worth writing later.

Decision pages use ADR shape: Context / Decision / Consequences.
Gap pages: Problem / Impact / Root cause / Status / Resolution.
Feature pages carry a **`spec_source:`** frontmatter line (where the intent
is recorded — a wiki page, or `ai/source/<file>` for PO statements) and an
**intent → code checklist**: one row per intent bullet, status ✓ done /
⚠ partial / ✗ missing, each citing `file:line` evidence.

## Definition of Done (DoD)

"The panel renders" and "the number moves" do NOT mean a feature is done.
A feature page may be `status: done` **only** when every in-scope intent
bullet is ✓ with `file:line` evidence **and** the behaviour was observed in
a browser. Any "built/done" claim must trace to an intent bullet.

For this project specifically, a mechanic is not done until it is
**legible** (a first-time player can tell what it does without being told)
and **felt** (pressing it produces visible, immediate feedback). Both are
in scope for every feature checklist. See [[juice-and-legibility]].

## index.md contract

Two parts, in order:
1. **## Current State** — where we are now: what plays, what is broken,
   what is next. Updated every ingest. Read this first, every session.
2. **## Catalog** — pages grouped by type, `- [[slug]] — one-line summary`.

## log.md contract

Append-only, newest at bottom. `## [YYYY-MM-DD] <op> | <summary>`.

## Operations

### Ingest (every session end, or after a work unit)
1. Identify what changed (features, modules, decisions, gaps).
2. Create/update affected pages (frontmatter, `updated` bumped).
3. Update `index.md` Current State; add catalog lines for new pages.
4. Append one `ingest` entry to `log.md`.
5. Any design decision → a `decisions/NNN-*.md` page and a log line.

### Query
1. Read `index.md` first. 2. Drill into pages, follow `[[links]]`.
3. Answer citing page slugs. 4. File lasting answers back as pages.

### Lint (on request)
Report: contradictions between pages; stale claims; orphan pages; concepts
referenced with no page; gaps marked open that are actually closed; feature
pages `status: done` without a complete checklist or browser evidence.

## Completion rule

A plan is complete only when its `plans/*` page is `status: done` and no
in-scope `gaps/*` page is still `status: open`.

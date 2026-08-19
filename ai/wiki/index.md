---
title: The Jam Wiki — Index
type: index
updated: 2026-08-19
---

# The Jam Wiki

Entry point. Read this first, every session. Schema in [[WIKI]].
History in `log.md`. Frozen sources in `ai/source/`.

## Current State

**As of 2026-08-19 (session 1 of this lineage), branch `main`.**

The game runs. Five files, no build step, no tests, no CI. Act I has a
genuine demand economy; Acts II and III exist and are reachable but have
**never been played in a browser** by anyone — only simulated
([[gap-act-ii-unverified]]).

This session read the full codebase and both transcripts, catalogued
**every** PO ask in [[requirements-ledger]] (70 entries), and shipped and
browser-verified the first batch of fixes.

### Shipped and verified in a browser (2026-08-19)

- **Selling is manual again.** Sales route through `servicedPerSec()`;
  nothing sells itself before the counter recipe, and sellers/shops now
  actually raise the serviced share. Hand vs auto counters split.
- **`set()` can no longer fail silently** — lazy lookup on cache miss.
  This unfroze "Made /sec" (0.0 → 3.4), the hire-seller price
  ($45 → $418.24) and the shop price ($3,200 → $8,192).
- **Exchange stake control** — 10/25/50/All % of cash, resolved amount
  shown, win/loss floated on withdraw.
- **Segmented controls show what is selected** (stake, harvest intensity)
  — they never did before.
- **Purchases refuse loudly** instead of silently in Acts II/III.
- **French is complete.** Script audit found 40 untranslated strings
  including *all 13 tooltips* and *all 9 fork strings*; all translated.
  Browser sweep of 181 visible strings across every panel in FR: 0 English.
- **Culture button** no longer renders the English-only, PO-rejected
  "Read the culture" — now "Test the set" / "Tester la prise".

Evidence: headless Chromium run, no console errors, save survived a
reload, FR toggled three times without text duplication.

### Still broken

1. **Act II is incomprehensible** — the PO played it and said so, twice.
   The most important open item. -> [[gap-act-ii-illegible]]
2. **The pot is a jar with a spoon in it** and is not the click target.
   -> [[gap-the-pot]]
3. **The house style fork changes nothing perceptible.**
   -> [[gap-house-styles-inert]]
4. **The player almost never decides anything.** -> [[gap-choice-scarcity]]
5. **The demand bar teaches nothing.** -> [[gap-demand-bar-illegible]]
6. **Automation is visually silent.** -> [[gap-idle-player]]
7. **Balance is now untested** — the selling fix changed the shape of
   Act I. -> [[gap-seller-demand-balance]]

### Next three

1. Make Act II legible — the pipeline, the state spine, tooltips.
2. Replay Act I end to end against the new selling curve and retune.
3. Design proposal to the PO for the pot and for forks that differ in kind.

### Standing constraints

Read [[po-rules]] before shipping anything. Read
[[juice-and-legibility]] before building any player-facing control.

## Catalog

### Reference
- [[WIKI]] — wiki schema, page types, Definition of Done
- [[overview]] — what the game is, the brief, who does what
- [[po-rules]] — the eight standing PO constraints and how to check them
- [[juice-and-legibility]] — the feel/clarity bar every mechanic must clear
- [[requirements-ledger]] — all 70 PO asks with a verified status each

### Modules
- [[architecture]] — five files, load order, the leaky engine/ui seam, the loop
- [[engine-economy]] — Act I demand, sugar, selling, fruit, inspiration, recipes
- [[ui-render-loop]] — Act II/III simulation, render, reveals, wiring
- [[i18n]] — EN/FR mechanism, the string-as-key trap, translation rules
- [[style-and-palette]] — tokens, act palette shifts, animations, layout
- [[feel-feedback]] — floating numbers, flash/bump/shake, hold-to-repeat, tooltips

### Features
- [[selling-ladder]] — hand -> table -> sellers -> shops (blocked, 2/7 bullets)
- [[house-styles]] — the two permanent forks
- [[sugar-dial]] — the one system that fully meets its intent

### Decisions
- [[001-continue-the-claude-build]] — keep the code, fix it, no third rewrite
- [[002-wiki-as-project-memory]] — ai/wiki is memory, transcripts are frozen
- [[003-fix-classes-not-instances]] — class fixes, browser evidence, per-symptom tracking

### Gaps (closed 2026-08-19)
- [[gap-automatic-selling]] — closed; sales route through the reach ladder
- [[gap-dead-readouts]] — closed; `set()` cannot fail silently
- [[gap-exchange-stake-control]] — closed; percentage stake selector

### Gaps (open)
- [[gap-the-pot]] — high; no pot, no manual stirring object
- [[gap-house-styles-inert]] — high; the fork changes nothing perceptible
- [[gap-choice-scarcity]] — high; the player rarely decides anything
- [[gap-demand-bar-illegible]] — high; the bar teaches nothing
- [[gap-seller-demand-balance]] — high; the link does not exist to balance
- [[gap-idle-player]] — high; automation has no visual voice
- [[gap-act-ii-unverified]] — medium; Acts II/III never played
- [[gap-act-ii-illegible]] — critical; the PO played Act II and understood nothing
- [[gap-affordance-act-ii]] — medium; no afford styling or tooltips past Act I
- [[gap-culture-cooldown]] — medium; the PO asked for spammable-with-losses, cooldown still there
- [[gap-tasting-panel-opaque]] — medium; sound mechanic, unreadable presentation

### Plans
- [[001-feedback-round-one]] — batches A-D against the current feedback

### Sessions
- [[001-read-in-and-wiki]] — read the codebase and both transcripts, built this wiki

---
title: The Jam Wiki — Index
type: index
updated: 2026-08-19
---

# The Jam Wiki

Entry point. Read this first, every session. Schema in [[WIKI]].
History in `log.md`. Frozen sources in `ai/source/`.

## Current State

**As of 2026-08-19 (session 2 of this lineage), branch `main`.**

Round two of PO feedback: twenty items, split one per symptom in
[[002-feedback-round-two]]. Eighteen shipped and browser-verified, two
partial and named as partial.

### The run, measured

`ai/tools/sim.js` loads the real game outside a browser and plays it, so
balance is measured rather than guessed:

| | length |
|---|---|
| Act I | 42m |
| Act II | 56m |
| Act III | 48m |
| **total** | **2h26m** |

Both house branches finish (2h24 maker, 2h21 store). A player who stops
touching it after six minutes finishes in the same time.

### Shipped this round

- **Sound is back.** It existed in the layer the rewrite pruned and
  nobody had noticed it was gone.
- **The manual-selling exploit is closed.** Customers queue at the door;
  at the price cap, fifteen presses of Sell earn $0.00.
- **Sugar moves.** The sweet spot and the tolerance both slide with the
  price, so the dial is never solved.
- **Act II is six catchments**, not one flat bar that sat at 0.00% for
  fifty minutes and then finished in eight.
- **Act III has an economy** and can no longer reach an unwinnable state.
- **The house style is a fork in kind.** At $8.50 a jar, appetite is
  0.244/sec as a maker and 0.020/sec as a store.
- **Three recipe pairs are mutually exclusive** — taking one shuts the
  other for the run.
- **French is complete** and checkable by script: 0 missing of 434.
- **The pot is pixel art, seen from above** — provisional, see below.

### Open

1. **The art direction is not settled** — [[004-art-direction-pixel]] is
   marked provisional at the PO's request. Painted and engraved
   prototypes both exist.
2. **Nobody has played this build.** Two and a half hours of play has
   been simulated, never played. The simulator cannot say whether it is
   fun.
3. **[[gap-choice-scarcity]]** is partially closed: no run history, no
   archetypes, and Act III's trust allocation is still plus/minus
   buttons.
4. **Act III has still never been seen by the PO.**

### Next three

1. Close the art direction.
2. Play it end to end, in a browser, as a player.
3. Give Act III's trust allocation the treatment Act II just had.

### Standing constraints

Read [[po-rules]] before shipping anything. Read
[[juice-and-legibility]] before building any player-facing control.
Run `node ai/tools/i18n.js audit` before claiming French is done.
Run `node ai/tools/sim.js` before claiming a balance change works.

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
- [[004-art-direction-pixel]] — **provisional**: pixel art, top view. Not closed by the PO.

### Gaps (closed)
- [[gap-automatic-selling]] — closed; sales route through the reach ladder
- [[gap-dead-readouts]] — closed; `set()` cannot fail silently
- [[gap-exchange-stake-control]] — closed; percentage stake selector
- [[gap-house-styles-inert]] — closed; the fork now differs in kind
- [[gap-the-pot]] — closed twice; the art direction above is what stuck

### Gaps (open)
- [[gap-the-pot]] — high; no pot, no manual stirring object

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
- [[001-feedback-round-one]] — batches A-D against the first feedback round
- [[002-feedback-round-two]] — the twenty items of round two, 18 shipped

### Tools
- `ai/tools/i18n.js` — `audit` every reachable string, `add` translations
- `ai/tools/sim.js` — play the real game headless and time the acts
- `ai/tools/domstub.js` — the DOM the simulator runs the game against

### Sessions
- [[001-read-in-and-wiki]] — read the codebase and both transcripts, built this wiki
- [[002-feedback-round-two]] — twenty items, seven commits, two tools

---
title: The Jam Wiki — Index
type: index
updated: 2026-08-20
---

# The Jam Wiki

Entry point. Read this first, every session. Schema in [[WIKI]].
History in `log.md`. Frozen sources in `ai/source/`.

## Current State

**As of 2026-08-20 (session 3 of this lineage), branch `main`.**

**The game has been played end to end in a browser for the first time.**
Three acts, first stir to last jar, through the real render loop and the
real controls — see [[003-first-browser-playthrough]]. It found five
defects the simulator structurally could not, four of which are fixed.

### The run, measured

| | simulator | browser playthrough |
|---|---|---|
| Act I | 42m | 74m |
| Act II | 56m | 111m |
| Act III | 48m | 25m |
| **total** | **2h26m** | **3h30m** |

The two disagree because they play differently: the simulator plays a
sharper game, and neither of them plays like a person. Both finish.

### Shipped this session

- **Every dial works by keyboard.** Price, sugar, spoon, jamworks were
  mouse-only — the sugar dial, the game's best system, did not exist
  without a mouse.
- **A fork you did not take stops being advertised.** The objective line
  used to freeze forever on a recipe the player had given up, hiding
  every objective after it.
- **Act III's trust panel can be adjusted.** Its "−" buttons threw on
  click, so the one decision the act offers could not be made.
- **The palate says when it is full**, in both languages, and the
  objective line tells you to buy the notebook rather than the oven.
- **The recipe panel's empty state knows which act it is in** — it was
  telling players on the ending screen to go and make some jam.
- **Act III's trust panel says what it does.** Eight traits, each with
  its live effect in numbers and what one more point would buy, and a
  sentence naming what is limiting.
- **A readout can no longer be silently swallowed by a rebuilt panel** —
  `set()` re-resolves nodes that have left the document.
- **Act III can no longer be locked dead by wild yeast.** The act used to
  stop ticking entirely at zero spores, colonies compounded to thirteen
  sextillion, and the escape recipe was priced above the inspiration
  ceiling a player arrives with. All three fixed, and the escape played
  through in a browser.

### Open

1. **The art direction is not settled** — [[004-art-direction-pixel]] is
   provisional at the PO's request.
2. **The exchange is a money printer** — 7× in ten minutes at the safest
   setting, and it structurally cannot lose. Needs a product decision:
   [[gap-exchange-money-printer]].
3. **Nobody has enjoyed this build.** A script completed it. That is not
   the same thing, and it is the question the wiki still cannot answer.
4. **[[gap-choice-scarcity]]** is partially closed: no run history and no
   archetypes. Act III's trust allocation now works and reads clearly,
   but it is still a stat spread that arrives fully allocated.

### Next three

1. Close the art direction.
2. Decide what the exchange should cost.
3. Decide what [[gap-choice-scarcity]] should actually become — the
   trust panel is legible now, but archetypes and a run history are a
   design conversation, not a fix.

### Standing constraints

Read [[po-rules]] before shipping anything. Read
[[juice-and-legibility]] before building any player-facing control.
Run `node ai/tools/i18n.js audit` before claiming French is done.
Run `node ai/tools/sim.js` before claiming a balance change works.
A harness cannot see a display, wiring or input bug — five of them
survived every simulated run. Drive the real controls in a browser.

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
- [[gap-act-ii-unverified]] — all three acts driven in a browser, to the ending
- [[gap-controls-keyboard-dead]] — every press-and-hold dial now takes Enter/Space
- [[gap-objective-advertises-closed-fork]] — one definition of "on the table"
- [[gap-trust-minus-crash]] — Act III trust rows adjust without throwing
- [[gap-inspiration-cap-silent]] — the palate states its ceiling and what raises it
- [[gap-trust-allocation-flat]] — every trait states its effect and its marginal point
- [[gap-act-iii-drifter-lock]] — the act cannot be locked dead, and the way out is affordable
- [[gap-automatic-selling]] — sales route through the reach ladder
- [[gap-dead-readouts]] — `set()` cannot fail silently
- [[gap-exchange-stake-control]] — percentage stake selector
- [[gap-demand-bar-illegible]] — two comparable bars and a sentence
- [[gap-affordance-act-ii]] — one afford table per act, tooltips everywhere
- [[gap-culture-cooldown]] — spammable, with symmetric losses
- [[gap-tasting-panel-opaque]] — every palate states its rule
- [[gap-the-pot]] — pixel art from above; art direction provisional
- [[gap-house-styles-inert]] — the fork now differs in kind, not degree

### Gaps (open)
- [[gap-exchange-money-printer]] — **high**; the exchange pays 7x in ten
  minutes at the safest setting and cannot lose. PO decision, three options.
- [[gap-choice-scarcity]] — high, partially closed; three exclusive forks
  and a real house style, but no run history and no archetypes
- [[gap-act-ii-illegible]] — partial; the pipeline, the state line and the
  catchments all help. Unverified against a human who has not seen it.
- [[gap-seller-demand-balance]] — medium; the door queue and the reach
  sentence changed the shape of this. Needs a played run, not a simulated one.
- [[gap-idle-player]] — medium; the visitor, the automation pulse and the
  larder stamp landed. Automation still has no picture of itself.

### Plans
- [[001-feedback-round-one]] — batches A-D against the first feedback round
- [[002-feedback-round-two]] — the twenty items of round two, 18 shipped

### Tools
- `ai/tools/play.js` — play the real game in a real browser, all three acts
- `ai/tools/i18n.js` — `audit` every reachable string, `add` translations
- `ai/tools/sim.js` — play the real game headless and time the acts
- `ai/tools/domstub.js` — the DOM the simulator runs the game against

### Sessions
- [[001-read-in-and-wiki]] — read the codebase and both transcripts, built this wiki
- [[002-feedback-round-two]] — twenty items, seven commits, two tools
- [[003-first-browser-playthrough]] — the game played to the end in Chrome; five defects a harness could not see

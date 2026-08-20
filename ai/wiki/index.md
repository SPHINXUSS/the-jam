---
title: The Jam Wiki — Index
type: index
updated: 2026-08-20
---

# The Jam Wiki

Entry point. Read this first, every session, **in the order below**:
Direction, then Current State, then the catalog. Schema in [[WIKI]].
History in `log.md`. Frozen sources in `ai/source/`.

## Direction

What the game must **become**. Full text, provenance and quotes in
[[intent]]. Never open a session by picking from the queue — pick from
here, then find the queue item that serves it
([[005-direction-before-queue]]).

1. **The player should feel smart.** Mastery first: work something out,
   use it on purpose, get paid. Divergence between players comes later.
2. **There is always something to do, decide, or understand.** Engaged,
   never bored. Pressure comes from the jam — visible, actionable,
   survivable.
3. **Every action feels like something, and good decisions feel
   *different*.** Today the game rewards activity, not judgement.
4. **Automation still feels like the hand.** The gesture continues
   without you; it does not disappear.
5. **A weakness always buys a strength.** Nothing unwinnable, and a fork
   the player cannot perceive is a lie.
6. **Beautiful, and ours.** Art direction still provisional.
7. **Fully French, written by a French writer.**

## Current State

**As of 2026-08-20 (session 5 of this lineage), branch `main`.**

**The PO has played a full run on desktop and returned twenty-odd items.**
Session 5 worked them — [[005-desktop-feedback-round]] has the full table
of what he said against what it turned out to be. Several of his
complaints were the same defect seen from different angles.

### Shipped this session

- **The floating numbers stop covering what they came from.** They leave
  from the outside edge of their source, a queue spaces and steps
  simultaneous arrivals so they cannot stack, and a halo makes them
  readable on a cream panel and on the black inside of the pot alike.
  Three tiers, so loudness says what *kind* of thing happened.
- **The pot stopped looking like a clock.** The handle was drawn along a
  radius, sweeping a full turn inside a gold ring. A spoon is held off to
  one side; the bowl travels and the handle swings as a chord. It squashes
  on the press and holds a few frames of hit-stop.
- **The stir stopped sounding like a drum.** It was one — a sharp-attack
  sine at 84 Hz. It is a slow-attack band of noise sweeping downward now,
  with a bubble in it about half the time.
- **An empty larder takes the top of the screen** and drains the colour
  out of the room, and carries the crate button with it.
- **The selling ladder cannot die.** Reach was linear and clamped at 1, so
  six shops ended it. It is exponential-approach now, and shops widen the
  appetite itself, which has no ceiling. When the sellers do cover the
  county the door is **taken off the page**, not greyed out.
- **The revenue readout settles.** Same dial, same number, every time.
- **A late arrival cannot clear a ladder in one click** — jamworks are
  priced against what they replace, and word of mouth is gated on
  production rather than on cash.
- **Hints are behind a switch, off by default.** 64 teaching sentences
  hidden; the 17 that report live state always show.
- **The desktop layout uses the screen.** It was a fixed 1180px grid —
  1920 rendered identically to 1440. 3.34 screens → 2.18 at 1440×900, and
  2.78 → 1.40 at 1920×1080.
- **"Release the Starter" is "Release the Set"** / *"Libérer la prise"*.
  A starter is bread vocabulary; jam is the thing that does not ferment.

### Session 6

- **The wide-screen layout was broken and is fixed** —
  [[gap-desktop-layout-broken]]. Session 5's answer to "use the space"
  dissolved the authored columns into a multi-column flow and left the
  top bar 1180px wide over an 1880px stage. Every band now shares one
  width, the columns stay where they were authored, and **the act decides
  the shape**: Act II's left column is the wide one and stands its cards
  two abreast, which took Act II at 1920 from ~1560px tall to ~900. And
  the page only widens once six cards exist: the opening screen keeps the
  1180px frame it always had.
- **The larder alarm stopped covering the top bar**, and the room goes
  cold instead of red — a 100vmax red film was painted over the whole
  viewport.
- **Floating numbers are chips**, clamped to the card they came from.
  `PRODUCTION` with `+407` written through it is gone.
- **The stand-in player moved to `ai/tools/player.js`**, shared by
  `sim.js` and the new `ai/tools/pace.js` — a pace map that scores a run
  a minute at a time on beats and on how many things are affordable, for
  the "still kinda boring" question. First reading: Act III averages 1.1
  affordable choices a minute against 2.9 in Act I.

### Open

1. **Nobody has enjoyed this build.** Still the question the wiki cannot
   answer. *"the game feels a little more polished but it's still kinda
   boring at some point."*
2. **[[gap-blind-tasting-worthless]]** — high. It costs inspiration and
   pays inspiration at break-even, and rewards rank rather than margin.
   Researched against Paperclips; three options, PO decision.
3. **[[gap-visitor-unmotivated]]** — the wasp says what it is now, but not
   why it is there. Two options, PO decision.
4. **The art direction is not settled** — [[004-art-direction-pixel]] is
   provisional at the PO's request. The pot was redrawn this session.
5. **The exchange is a money printer** — [[gap-exchange-money-printer]].
6. **[[gap-choice-scarcity]]** — partially closed; no run history, no
   archetypes.

### Next three

Each names the direction line it serves.

1. **Answer "still kinda boring"** — directions 2 and 3. The one item
   session 5 did not reach the bottom of. It is not a defect list; it is
   the shape of the middle of a run.
2. **Decide what the blind tasting pays** — direction 1. It is the only
   modelling system in the game and nobody has a reason to open it.
3. **Give automation a picture of itself** — direction 4.
   [[gap-idle-player]].

### Standing constraints

Read [[po-rules]] before shipping anything. Read
[[juice-and-legibility]] before building any player-facing control.
Run `node ai/tools/i18n.js audit` before claiming French is done — and
note that the audit was **blind to prose written into markup by JS** until
2026-08-20. The runtime now counts fallbacks itself and shows `EN ×n` in
the top bar when the list is not empty.
Run `node ai/tools/sim.js` before claiming a balance change works.
A harness cannot see a display, wiring or input bug. Drive the real
controls in a browser.
**Delegate the eyes, keep the judgement** — [[006-delegation-tiers]]. The
standing authorisation lives in `~/.claude/CLAUDE.md`; if it ever looks
blocked, check that block is still there rather than re-deriving it.

## Catalog

### Reference
- [[intent]] — **what the game must become**; read before Current State
- [[research-queue]] — PO intuitions under test, and the open questions
- [[WIKI]] — wiki schema, page types, Definition of Done
- [[overview]] — what the game is, the brief, who does what
- [[po-rules]] — the eleven standing PO constraints and how to check them
- [[juice-and-legibility]] — the feel/clarity bar every mechanic must clear
- [[requirements-ledger]] — all 123 PO asks with a verified status each
  (built partly on four truncated messages, now recovered and found to
  add nothing here — [[po-messages-recovered]])

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
- [[005-direction-before-queue]] — direction opens a session, not the queue
- [[006-delegation-tiers]] — what Haiku, Sonnet and I may each be given

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
- [[gap-choice-controls-silent]] — the game answered purchases and ignored decisions
- [[gap-reduced-motion-deletes-juice]] — reduced motion removes movement, not feedback
- [[gap-exchange-stake-control]] — percentage stake selector
- [[gap-demand-bar-illegible]] — two comparable bars and a sentence
- [[gap-affordance-act-ii]] — one afford table per act, tooltips everywhere
- [[gap-culture-cooldown]] — spammable, with symmetric losses
- [[gap-tasting-panel-opaque]] — every palate states its rule
- [[gap-the-pot]] — pixel art from above; art direction provisional
- [[gap-house-styles-inert]] — the fork now differs in kind, not degree

### Gaps (open)
- [[gap-blind-tasting-worthless]] — **high**; the only modelling system in
  the game, and it pays break-even in its own currency for a rank rather
  than for a margin. Researched against Paperclips. PO decision, three options.
- [[gap-visitor-unmotivated]] — the wasp is named and calmed; what it is
  *for* is still a design question. PO decision, two options.
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

### Gaps (closed, session 6)
- [[gap-desktop-layout-broken]] — one page width, authored columns kept,
  the act decides the shape

### Plans
- [[001-feedback-round-one]] — batches A-D against the first feedback round
- [[002-feedback-round-two]] — the twenty items of round two, 18 shipped

### Tools
- `ai/tools/play.js` — play the real game in a real browser, all three acts
- `ai/tools/i18n.js` — `audit` every reachable string, `add` translations
- `ai/tools/sim.js` — play the real game headless and time the acts
- `ai/tools/player.js` — the stand-in player, shared by every headless harness
- `ai/tools/pace.js` — beats and affordable choices, a minute at a time
- `ai/tools/domstub.js` — the DOM the simulator runs the game against

### Sessions
- [[001-read-in-and-wiki]] — read the codebase and both transcripts, built this wiki
- [[002-feedback-round-two]] — twenty items, seven commits, two tools
- [[003-first-browser-playthrough]] — the game played to the end in Chrome; five defects a harness could not see
- [[004-direction-and-process]] — why sessions went to defects; direction, delegation, and three corrections to myself
- [[005-desktop-feedback-round]] — twenty-odd items from a played desktop run; four commits, five agents, two fixes to the same readout

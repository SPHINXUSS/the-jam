---
title: The house style choice is imperceptible
type: gap
status: closed
severity: high
updated: 2026-08-19
---

## Problem

PO, verbatim: *"the house style doesn't change shit tbh, I tried both and
don't see any difference, plus it's the only 'choice' ever the player
makes at any point which is not what the initial idea was."*

Two complaints. Both true. The second is tracked separately as
[[gap-choice-scarcity]].

## What the choice actually does

`FORKS.style` (`ui.js:9-21`), offered at `s.made >= 800`:

| | Maker's Table | Corner Store | Unpicked |
|---|---|---|---|
| `appetiteBase()` | 0.78 | 0.92 | 0.84 |
| `elasticity()` | 0.66 | 0.82 | 0.72 |
| `sugarPeak()` | 38% | 58% | 48% |

At the default $3.20 price the two branches differ by roughly 8% in
jars/sec. The elasticity difference only becomes visible if the player
deliberately sweeps the price across its full range and compares — which
requires already understanding the demand curve.

## Impact

The game's stated foundational mandate is *"I want to feel smart and feel
like I made a choice other players may not have done."* A fork the player
cannot perceive is worse than no fork: it teaches them their choices do
not matter.

## Fix direction (needs PO sign-off before build)

Make the branches differ in **kind**, not degree:

- Maker's Table: fewer, larger, named customers; a reputation/quality
  track; price ceiling much higher; volume ceiling low.
- Corner Store: high volume, thin margin, shelf-space and restock
  pressure; unlocks shops earlier and cheaper.

Each branch should get at least one **panel or verb the other never
sees**, plus a distinct objective-strip voice. That is what "a choice
other players may not have done" means.

Also: label the branch permanently in the UI (top bar), so the player is
reminded which run they are in.

## Status

Open. Design decision required — this is a product call, not a tuning
pass. See [[house-styles]].


## Closed 2026-08-19

The fork was two numbers nudged by a tenth. It is now a fork in kind.

| | Maker's Table | Corner Store |
|---|---|---|
| they balk at | 8.90 | 4.20 |
| appetite | −26% | +25% |
| price sensitivity | low (0.58) | high (0.92) |
| word of mouth | ×0.55 | ×2 |
| sellers and shops | +35% | −45% |
| crates | — | ×1.5 |
| taste earned | ×2 | ×0.6 |

Measured in a browser at $8.50 a jar: neutral appetite 0.069/sec, a
Maker's Table 0.244/sec, a Corner Store 0.020/sec. The same price is a
good business or a dead one depending on the house.

Both branches finish the game — 2h24 as a maker, 2h21 as a store, against
2h26 with no choice made — so neither is a wrong choice ([[po-rules]] #1).

The choice is permanent, so it has a permanent place: a **House** slot in
the top bar with a tooltip naming everything it decided. The market panel
says when you have reached the ceiling this crowd will pay.

Evidence: `tfork.js`, browser, 0 console errors. `ai/tools/sim.js
--maker` and `--store`.

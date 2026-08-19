---
title: The house style choice is imperceptible
type: gap
status: open
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

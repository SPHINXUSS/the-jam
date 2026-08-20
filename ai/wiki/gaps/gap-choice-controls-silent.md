---
title: The game answered purchases and ignored decisions
type: gap
serves: 3 — every action feels like something, and good ones feel different
status: closed
severity: high
updated: 2026-08-20
---

## Problem

A sweep of every interactive control in the game (static audit + browser
observation, 2026-08-20) found one clean class:

| what the control does | feedback it fired |
|---|---|
| **buys** — spoons, fruit, sellers, shops, recipes, jamworks | `sfx.buy` + `pop` + floating numbers, every time |
| **does** — stir, sell, read the setting point, run the contest | floats, flash, bump, shake |
| **chooses** — price, sugar, orchard intensity, exchange stake and risk, tournament strategy, swarm work/play | **nothing, in all three acts** |

Fifteen controls fired no feedback at all. Every one of them was a
control that *sets a value*.

So the game celebrated spending money and ignored judgement — po-rule 11
failing across the whole interface, and direction 3 failing at its
second half ("good decisions feel *different*"). Worth noting where the
silence concentrates: Act II is mostly choice-setters, which is the first
mechanical account of "just pushing buttons" that does not rest on
quoting feedback about a build nobody plays any more.

The two Act I dials were the worst case. The sugar dial is the system
[[sugar-dial]] calls the only one that fully meets its intent, borrowed
by the PO from a park-tycoon salt mechanic — and landing on its sweet
spot produced no moment at all.

## Fix

**The press is quiet, the landing is loud.** Feedback moved off the
keypress and onto the state transition, which also solves hold-to-repeat:
holding a dial down fires nothing until the value crosses into the band.

- **quiet tier** — `chose()` in `feel.js`: a tick voice, and a bump on
  the value for discrete selectors. The two held dials tick only; a bump
  per step at hold speed reads as jitter and their digits already move.
- **loud tier** — `landed()`: a two-note voice used by nothing else, the
  band flaring, the appetite multiplier floating up, and a small
  `stirKick` so the kitchen answers. Reserved for crossing **into** the
  band the crowd will accept.
- **leaving** — `slipped()`: one low note and a quiet negative bump. No
  shake. Leaving the band is a trade, not a mistake (po-rule 1).

Because the cue sits on the band crossing and not on the keypress, the
**price** dial fires it too: raising the price slides the sweet spot out
from under a sugar dial nobody touched. That coupling is the cleverest
rule in the game and nothing on screen had ever mentioned it.

## Evidence

Chrome, real controls, sugar dial untouched throughout:

| action | price | crowd wants | dial | observed |
|---|---|---|---|---|
| start | 3.20 | 54% | 54% | in band, no animations pending |
| price up only | 6.00 | 39% | 54% | `bumpBad` — knocked out |
| price down only | 4.65 | 46% | 54% | `bandLit` + floater `×1.22` |

Single dial press: no floater, no bump — the quiet tier, as designed.
0 page errors. i18n audit: 434 reachable strings, 0 missing (the cue is
a number and carries no English).

## Still open

`endWith()` (`ui.js:629`) — **the ending of the game** sets text and
disables two buttons. No sound, no flash, no moment. Out of scope here,
but it is the largest unmarked event in the product.

Related: [[juice-and-legibility]], [[sugar-dial]], [[gap-idle-player]]

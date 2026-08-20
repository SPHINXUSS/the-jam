---
title: The palate sits full for hours and never says so
type: gap
status: closed
severity: medium
updated: 2026-08-20
---

## Problem

Found while playing Act I to its end, 2026-08-20. Inspiration stopped at
2,462 and stayed there for eight hours of game time. The bar was simply
at its end. Nothing said the cap had been reached, what the cap was, or
what raises it.

The player is left buying ovens — the button that makes inspiration —
while inspiration cannot go up. The purchase is not wasted (the overflow
becomes creativity, `engine.js:371`) but nothing on screen says that
either, so the player is spending a scarce resource on a promise the
game has quietly stopped keeping.

Meanwhile the objective line was talking about jars piling up, because
it has no branch for *"your palate is full and the thing you keep buying
is not the thing that helps"*. [[po-rules]] rule 4 asks for one true
sentence at all times; this state had none.

## Root cause

`inspMax()` (`engine.js:370`) is `1000 · memMult() · cellars^1.3` —
raised by **notebooks**, not ovens. The panel's static copy says so at
the bottom, in a sentence the player read once, forty minutes earlier,
before any of it applied to them. Nothing reflects the live state.

## Fix

Two sentences that know the state.

- `inspWhy()` (`engine.js`, beside `inspRate`) renders under the
  inspiration meter (`#inspWhy`). While filling: *"9 of 2,462. The ovens
  make 18.0 a second."* — both terms of the ratio, per
  [[juice-and-legibility]]. When full: *"Full at 2,462. What the ovens
  make now spills into creativity, 1.6 a second. A notebook raises the
  ceiling; an oven no longer will."*
- `objective()` now has a branch: with taste in hand and the palate
  full, it says to spend it on a notebook, not on "an oven or a
  notebook".

Both bilingual, both verified in FR and across a reload.

## Status

Closed. Related: [[engine-economy]], [[juice-and-legibility]],
[[003-first-browser-playthrough]].

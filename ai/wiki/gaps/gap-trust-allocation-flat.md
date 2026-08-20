---
title: Act III's trust panel was eight rows of plus and minus that said nothing
type: gap
status: closed
serves: 1 — rows gave no way to judge an allocation choice
severity: medium
updated: 2026-08-20
---

## Problem

Act III offers one decision: how a spore is built. The panel presenting
it was eight rows of a name, a minus, a number and a plus.

Nothing said what Speed did, or what it did *compared to* Exploration.
Nothing said that the three conversion traits multiply against each
other, so the lowest of them is always worth the most. Nothing said that
Self-replication does nothing at all at zero, or that replication stops
when the fleet fills the space it has found. The act arrives with all
twelve points already allocated, so every change is a trade — and the
player had no way to price either side of it.

Against [[juice-and-legibility]]: a player could not say what the
control does, could not say whether the current value was good, and
could not predict what pressing it would do. Three for three.

## Fix

The treatment Act II's pipeline had. Every row now carries:

- **what it does**, in plain words — *"how fast a spore crosses what it
  has found"*;
- **its live effect**, in numbers — *"×3 to finding space"*, *"losing
  0.29%/s of the fleet"*, *"+0.90%/s up to 7,842 spores"*;
- **what one more point buys** — *"one more point: +33%"*.

Under the panel, one sentence naming what is actually limiting, the way
`pipeWhy` does for the orchard: nothing launched yet; converting the
little you have found; everything within reach already found, so Speed
and Exploration are spent points; the fleet has filled its space; you
are losing spores faster than you need to; or — the usual case — the
next point is worth most in whichever conversion trait is lowest, named.

The numbers are read from the same expressions `act3Tick` uses, so they
cannot drift from the simulation.

## What this did not change

The panel is still plus/minus rows, and the act still arrives fully
allocated. [[gap-choice-scarcity]] wants something with more character
than a stat spread — archetypes, a run history. This makes the existing
control honest; it does not replace it.

## Found while fixing it

`set()` cached DOM nodes and never checked whether they were still in the
document. `buildAlloc()` rebuilds its rows with `innerHTML`, so after a
language switch every effect line wrote to a detached node and went
blank — the same silent failure as [[gap-dead-readouts]] by a different
route. `set()` now re-looks-up a node that is no longer connected.

## Status

Closed. Related: [[ui-render-loop]], [[gap-choice-scarcity]],
[[gap-dead-readouts]], [[003-first-browser-playthrough]].

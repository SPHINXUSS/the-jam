---
title: House styles and orchard philosophy (the forks)
type: feature
status: active
spec_source: ai/source/gpt_transcript.pdf
updated: 2026-08-19
---

# The two forks

Permanent, one per act, each closing the other for the run. Rendered into
`#forkSlot` by `showFork()` (`ui.js:42`), triggered by `forkTick()`.

## Act I — House style (`s.style`, at 800 jars)

**Maker's Table** — appetite 0.78, elasticity 0.66, sugar peak 38%.
**Corner Store** — appetite 0.92, elasticity 0.82, sugar peak 58%.

## Act II — Orchard philosophy (`s.style2`, at 8% converted)

**Hedgerow** — machine output x0.85, power draw x0.65.
**Factory Floor** — output x1.18, draw x1.28. Applied in `take()`
(`ui.js:34-36`) and `powerBias()` (`ui.js:40`).

## The problem

Both forks are magnitude-only. The PO tried both Act I branches and could
not tell them apart — see [[gap-house-styles-inert]]. The PO's mandate
("feel like I made a choice other players may not have done") requires
branches that differ in **kind**: different panels, different verbs,
different objective voice.

The GPT thread's unbuilt **build archetypes** concept (five axes, emergent
named personas) is the recorded intent for what this should grow into.
See [[gap-choice-scarcity]].

## Constraint

PO rule 1: neither branch may be wrong. Whatever asymmetry gets added
must be a trade-off, never a trap.

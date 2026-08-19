---
title: Act III unverified; Act II was played and reported as incomprehensible
type: gap
status: open
severity: medium
updated: 2026-08-19
---

## Problem

From `ai/source/claude_transcript.txt`, the previous agent's own words:

> *"I verified files by checksum and mechanics by simulation, but I
> haven't played the new Act II myself on the live site — Pages was still
> rebuilding. The systems fire correctly in the harness; whether the
> orchard is now fun is a question your player answers better than my
> simulator does."*

**Correction (2026-08-19, from the PO): Act II *was* played.** The PO
reached the orchard and reported it repeatedly — see
[[gap-act-ii-illegible]]. What was never confirmed by the previous agent
is that its *systems* behave in a browser, and Act III has never been
played by anyone. Everything known
about them comes from a headless harness written by the same author.

## Impact

Unknown. The three known Act I defects ([[gap-dead-readouts]],
[[gap-automatic-selling]], and the frozen cost labels) are all of a class
that a simulation harness cannot see, because they are display and wiring
bugs, not maths bugs. There is no reason to assume Acts II and III are
free of the same class.

Specific things a harness would not catch, and which are unverified:
- Act II/III buttons have no affordability styling ([[gap-affordance-act-ii]]).
- Act II/III controls have no tooltips (`TIPS`, `feel.js:82`, covers 12
  Act I ids only).
- `swarmBoost()` (`ui.js:110`) is defined and never called — the same
  dead-function class as `servicedPerSec`.
- French coverage for orchard/spore strings.

## Fix

Play both acts in a browser. Fastest route is a debug jump: set
`s.act`/`s.made` from the console and call the transition, or add a
temporary dev shortcut. Record what is observed, per surface, before
touching Act II balance.

## Status

Open. Do this before any Act II balance work — measuring an unverified
system is wasted effort.

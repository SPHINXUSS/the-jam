---
title: Act II is incomprehensible to the player
type: gap
status: open
severity: critical
updated: 2026-08-19
---

## Problem

PO, verbatim (gpt_transcript p.34, after playing it): *"I reached the
second act and I don't understand anything in there (first time reaching
this) I don't know what I'm doing, what's happening, I don't understand
anything, just pushing buttons."*

This was raised, discussed at length, and — per the PO — raised again
since. It is the single most direct statement of failure in the whole
record and it has never been closed.

## Why it happens

Act II shows six raw readouts (unpicked mass, pulp, fruit, jars/sec,
bottleneck, spoiling) and nine buy buttons, with no statement of what the
orchard **is** or what the player is trying to do. Specifically:

- `objective()` (`engine.js:402-408`) has Act II branches, but they are
  build orders ("Build pickers"), not explanations.
- Nothing names the transformation: mass → pulp → fruit → jars. The three
  machine types are listed in a flat panel with no pipeline shown.
- Power, daylight, spoilage, intensity and blight all simulate
  continuously and are each surfaced as a bare number with no cause
  attached. A brownout prints one logbook line, once.
- No tooltips exist past Act I ([[gap-affordance-act-ii]]).
- Money stops existing and jars become currency, and this is never said
  in the UI — only in the act-transition curtain, once.

## Intent on record, never built

The GPT thread proposed and the PO endorsed a persistent one-line
**"what is happening"** spine that evolves with the state:

> "The orchard is feeding the factory" → "The factory is outrunning the
> orchard" → "The bees have started contributing" → "The culture has
> learned to optimise the orchard" → "There is no orchard left to
> optimise"

Not a tutorial, not a quest log. One sentence, always true, always
visible. That is also PO rule 4 in [[po-rules]].

## Fix direction

1. Draw the pipeline as a pipeline: three stages in a row, the flow
   between them, the bottleneck highlighted where it actually is.
2. Replace the Act II objective strings with the state spine above,
   derived from live values (`bottleneck()`, `converted2()`, power
   deficit, spoil rate, swarm mood).
3. Attach every number to its cause: "Spoiling 40/sec — pulp buffer full
   because pressing is slower than picking."
4. Say once, prominently, that jars are now the currency.
5. Tooltips on every control, EN and FR.

## Status

Open. Highest-priority design work after the Act I wiring fixes.
Blocks any Act II balance pass — a player who cannot read the system
cannot be measured against it.

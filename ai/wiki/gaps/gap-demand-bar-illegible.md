---
title: The demand/price bar does not communicate
type: gap
status: closed
serves: 1 — bar unreadable without prior mastery of the game
severity: high
updated: 2026-08-19
---

## Problem

PO: *"the demand/price bar you put isn't clear, I guessed what it is
because I've now played countless games but to a new player this isn't
clear. You need to make the game more satisfying on things like that."*

## What it actually shows

`#demandBar` width (`ui.js:473`):
`min(want, make) / make * 100` — the share of production the public is
willing to absorb. Parent gets `.hot` when `want < make*0.9`, `.warm`
when `want < make` (`ui.js:474`, red styling `style.css:186-189`).

Problems with that as a communication device:

1. It is a **ratio of two rates neither of which is labelled on the bar**.
2. It reads full at 100% both when everything sells and when nothing is
   being made (`make === 0` -> the `want>0 ? 100 : 0` branch).
3. Red means *overproduction*, which is the opposite of the convention
   (red usually means shortage/danger).
4. It sits between "Wanted" and "Selling" readouts and looks like it
   belongs to whichever the eye lands on.
5. `Made` above it is frozen at 0.0/sec ([[gap-dead-readouts]]), so the
   one number that would explain the bar is broken.

## Fix direction

The GPT thread already settled the model the PO wants:
**Wanted / Made / Backlog**, stated plainly, replacing an opaque
percentage. Build to that:

- A two-track bar: appetite (what the public wants) drawn against
  capacity (what you make), with the overlap shaded as "selling".
- Label the ends. Put the sentence under it, e.g. "You make 12/s. People
  want 8/s. 4/s are piling up." That sentence is also the objective-strip
  nudge — one sentence, always (PO rule 4).
- Colour: warm when appetite exceeds output (opportunity), cool/grey when
  output exceeds appetite (waste), never alarm-red for a normal state.
- Animate the bar toward its target rather than snapping, so a price
  change is felt as a movement.

## Status

Open. Depends on [[gap-dead-readouts]] being fixed first.

## Resolution (2026-08-19, commit c028fd9)

Replaced with two bars on one shared scale — what you make, what people
want — each labelled with its own number, plus one sentence naming the
binding constraint and what to do about it. Backlog stated outright.
Browser-verified across four states (no automation, overproducing,
underserved, balanced) in both languages.

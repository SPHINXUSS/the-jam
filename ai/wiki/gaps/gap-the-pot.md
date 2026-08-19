---
title: The pot is a jar with a spoon in it
type: gap
status: closed
severity: high
updated: 2026-08-19
---

## Problem

PO, verbatim: *"stirring the pot isn't what I described (beta player
reported), you just added a clunky ugly animation of a spoon in the jam
jar, which makes no sense btw. we expected a big pot, kinda witch-like in
the design, where the user has to click to manually stir it."*

Current implementation: the centrepiece SVG (`index.html:38-66`) is a
**jar** — lid, hatching, label reading "The Jam", NO. 001 — with a
`#spoon` group inside it that rotates continuously
(`feel.js:45 stirTick`). The spin target is derived from *automation*
rate, not from the player's stirring: `target = min(14, 2.2*log10(1+auto)*3)`
(`feel.js:48`). So the spoon turns on its own and a manual stir only adds
a decaying kick (`stirKick(7)`, `ui.js:678`).

The stir button (`#stirBtn`) is a separate rectangular button below the
jar. The player never clicks the vessel.

## Impact

The primary verb of Act I has no physical object. The one thing a
first-time player looks at is a static product shot, and the spinning
spoon inside a sealed labelled jar reads as a bug, not a mechanic.

## Root cause

The jar was designed as a *progress gauge* (fill level = stock/conversion)
and the stirring was bolted onto it later rather than given its own
object. Two jobs, one asset.

## What is wanted

- A **pot**: wide, dark, heavy, witch-adjacent within the existing
  enamel-laboratory palette. Not a Cookie Clicker reskin — PO: *"Don't
  [copy] their visual identity which wouldn't match ours, keep ours but
  improve on this."*
- The pot **is** the click target. Clicking it stirs.
- Manual stirring drives the swirl; automation keeps it simmering at a
  low idle so the kitchen never looks dead, but the two must be visually
  distinguishable.
- Study what Cookie Clicker actually does mechanically for juice: cursor
  feedback at the click point, particle spawn, satisfying scale-pop,
  accumulating visible product. Take the *technique*, not the look.
- The jar keeps its job as the stock/progress gauge, elsewhere on screen.

## Status

Open. Blocks [[juice-and-legibility]]. Design proposal needed before code.

Related: [[style-and-palette]], [[feel-feedback]]

## Resolution (2026-08-19, commit b1d6d06)

Cauldron replaces the jar: legs, handles, rim the jam sits behind, steam
tied to actual activity. The pot is the click target; clicking spawns a
jam splash and the floating count at the cursor. Keyboard-operable. Hint
line retires itself after the first stir. The stirrer's bowl orbits the
pot interior with the handle leaning in — an earlier attempt rotated the
whole stick about its own tip and threw the handle 130px outside the
frame. Automation idles the pot at a simmer so a manual stir is visibly
the stronger motion. Browser-verified.

Still open, tracked in [[gap-idle-player]]: the automated economy has no
visual voice of its own.

---
title: Act III could be locked dead by wild yeast, and the way out was priced above the ceiling
type: gap
status: closed
serves: 5 — a floor-check bug froze Act III forever
severity: high
updated: 2026-08-20
---

## Problem

Found by a full browser playthrough, 2026-08-20. The run reached Act III
at minute 185 and was still there at minute 999, having launched **14,658
spores** into a fleet that never rose above one, with conversion at
0.000% and rogue colonies at **13 sextillion**.

Three faults, stacked, each making the next one worse.

**1. The act stopped ticking entirely.** `act3Tick` is wrapped in
`if(s.spores>0)`. The never-zero floor — *"the programme can be cut to
almost nothing, but never to nothing"* — was applied before the
engagement with wild yeast, and the engagement then subtracted from the
fleet afterwards. A fleet taken to exactly zero froze the whole act: no
exploration, no conversion, no decay of the colonies that did it, for
ever. The only recovery, launching a spore, was eaten before it finished
arriving.

**2. Rogue colonies compounded without limit.** With no Defence points
they grew 2%/s and nothing anywhere reduced them. They are made of
spores that stopped answering, and yet they outnumbered every spore ever
launched by nineteen orders of magnitude.

**3. The answer was priced above the ceiling.** The escape is a recipe,
Wild Yeast, which unlocks Defence. It cost **90,000 inspiration**.
Inspiration in Act III is capped at `1000 x 40 x notebooks^1.3` — which
for a player arriving with one notebook is **40,000**. The recipe sat in
the list, visible, permanently greyed out, at a price they could not
reach, while the thing it answers ate their game.

A player who put a third point into Self-replication — the trait whose
description is *"spores making further spores"*, with no mention of
consequence — could lose the act to it and never be told why.

## One part of that first run was the harness, not the game

Worth separating, because the wiki's job is to be exact. The scripted
player also *bought* the escape recipe and then sat on it, because its
policy only ever pressed **+** — and the act arrives fully allocated, so
Defence has to be paid for by taking a point out of something else. That
part was a limitation of the script, now fixed in `ai/tools/play.js`.

The three faults below are the game's, and were reproduced and fixed
independently of the script.

## Impact

Straight through [[po-rules]] rule 1: an unwinnable state, entered by a
choice presented as an upgrade. This is the second distinct route to an
unwinnable Act III; session 002 fixed the first (spores decaying faster
than they replicate). The class is the same and the standing principle is
already written down in the code: **being reduced to nothing must never
be terminal.**

## Fix

Four changes, all small.

- **The floor is held after the engagement, not only before it**
  (`ui.js`). A fleet can be reduced to one spore by wild yeast; it can no
  longer be reduced to none, so the act keeps running.
- **Colonies starve.** They grow on what they take; when they take
  nothing they now decay 8%/s instead of compounding.
- **Colonies cannot outnumber the fleet they came from**, capped at twice
  the current fleet (minimum 8). Thirteen sextillion against a fleet of
  one is not a threat, it is a bug with a number attached.
- **A raid can never take the whole fleet in one tick** — at most half a
  second's worth — so a reseed is not eaten before it lands.
- **Wild Yeast now costs 30,000**, under the 40,000 ceiling a player
  reaches Act III with. The way out of a trap must be affordable inside
  the trap.

And it is now said out loud, which it never was:

- the Self-replication row warns at two points (*"one more point and
  copies begin to go wrong"*) and states it plainly at three (*"at this
  depth copies go wrong: some stop answering"*);
- the panel's advice line drops everything else while a raid is running
  and names the answer — the recipe if it is not yet bought, Defence if
  it is.

## Evidence

The stalled state, reproduced and then played out of, in Chrome:

```
stalled            spores 1      drifters 40         conversion 0%
buy Wild Yeast     combatOn true, Defence row appears
move points        replicate 3 -> 0, combat 0 -> 3
+5 min defended    spores 1      drifters 0
+10 min relaunched spores 72     drifters 0          conversion 0.0018%
+30 min running    spores 19,385 drifters 0          conversion 1.01%
```

Untouched and undefended, colonies now settle at 8 against a floor fleet
instead of reaching 3.4 million in ten minutes.

## After the fix

A complete playthrough, with a player that reallocates when raided:
74m / 111m / 25m, ending at minute 210, zero page errors. The act now
survives a raid and finishes.

## Status

Closed. Related: [[gap-trust-allocation-flat]], [[po-rules]],
[[003-first-browser-playthrough]].

---
title: UI, render and the Act II/III simulation
type: module
status: active
updated: 2026-08-19
---

# `ui.js`

Misleadingly named. It is render + wiring **and** the whole Act II/III
game. 815 lines, flat globals, ends with `boot()`.

## Act II — the orchard (lines 101-237)

Three stages in series: unpicked mass -> pulp -> fruit -> jars.

- Costs: picker `400*1.00015^n`, presser `500*1.00015^n`, line
  `1500*1.00015^n`, sun trap `8000*1.02^n`, cellar `5000*1.02^n`.
- `powSupply = sun*50*sunMult`; `powDraw = (pickers+pressers+lines)*0.30*powerBias`.
- `daylight()` = `0.35 + 0.65*max(0, sin(clock*2pi/110))` — a 110s cycle.
  Cellars (`powStore = batt*3500`) carry the night; brownouts cut efficiency.
- `bufferCap()` = `900*(machines+20)`; overflow spoils continuously, so
  imbalance costs rather than harmlessly piling up.
- `bottleneck()` (line 145) names the slowest stage in the panel.
- Harvest intensity (0/1/2) trades output x0.72-x1.45 against spoilage
  x0.5-x2.4 and +35% draw.
- Blight fires periodically, halves picking; `treatBlight()` spends
  inspiration, or absorb it.
- Swarm: `swarmTick` (215) — bored bees leave, overworked bees leave
  faster; `synchronise()` resets mood for inspiration.

## Act III — the spread (lines 238-307)

Spores bought with jars, `trust` allocated across eight traits
(`speed, explore, replicate, hazard, factory, harvest, press, combat`).
`act3Tick` runs exploration, conversion, replication, hazard loss and
drifter combat. `sporeCost()` has a **reseed floor** (line 239) so losing
every spore can never be terminal. That floor exists because a full
simulation deadlocked there once. Never remove it.

## Render (line 454)

One big function, act-branched. Reads state, writes text via `set()`.
See the cache-array trap in [[architecture]] and [[gap-dead-readouts]].

Affordability: an `affordMap` of `[id, cost]` pairs toggles `.can`
(Act I only, lines 596-599); `.can` draws a boil-coloured outline
(`style.css:321`). Several buttons additionally get `disabled` set
directly. Act II/III buttons get neither — [[gap-affordance-act-ii]].

## Progressive disclosure

- `checkReveals()` (658) — Act I only, thresholds on `s.made`:
  1 shelf · 3 selling · 12 fruit · 25 palate + taste slot · 60 sugar.
- `restoreUI()` (790) replays the same conditions on load **without** the
  reveal notices, so a returning player is not re-told everything.
- Act transitions (`beginAct2` 319, `beginAct3` 340) hide and show whole
  panel sets and add `body.act-2` / `body.act-3` for the palette shift.
- `curtain()` (309) is the full-screen act-transition overlay.

## Forks

`FORKS` (line 8): `style` (Act I, at `made>=800`) and `style2` (Act II, at
8% converted). Rendered into `#forkSlot` by `showFork`, polled by
`forkTick` every 0.5s. See [[house-styles]].

## Wiring

All handlers are assigned at load, at the bottom of the file (672-756),
mostly `onclick=` (single handler per element — reassigning silently
replaces). Hold-to-repeat via `holdable()` from `feel.js` is applied to
price, sugar, and the spoon/works buy buttons. Space bar stirs.

Related: [[architecture]], [[act-ii-orchard]], [[act-iii-spread]]

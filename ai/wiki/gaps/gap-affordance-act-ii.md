---
title: Acts II and III have no affordability or tooltip feedback
type: gap
status: closed
serves: 3 — unaffordable clicks and controls give zero feedback
severity: medium
updated: 2026-08-19
---

## Problem

Act I buttons get a `.can` outline when comfortably affordable and
`disabled` when not, via the `affordMap` block (`ui.js:596-599`) — which
is explicitly guarded to `s.act===1`. Ovens and notebooks get the same
treatment (603-605).

Act II and Act III buttons (pickers, pressers, lines, sun traps, cellars,
spore launch, trust allocation, swarm controls) get neither. Clicking an
unaffordable one runs `buyN()` (`ui.js:112`), which stops on the first
unaffordable item and returns silently — no shake, no toast, nothing.

Tooltips are the same story: `TIPS` (`feel.js:82`) has twelve entries,
all Act I. Every orchard, swarm, power, spore and exchange control is
undocumented in-game.

## Impact

Two thirds of the game's controls give the player no answer to "can I
afford this?" or "what does this do?". Directly feeds [[gap-idle-player]].

## Fix

Generalise, do not duplicate: build the afford map from a declarative
`{id, cost()}` table per act rather than a hard-coded Act I list, and
extend `TIPS` to every interactive id with an FR entry each. Add a
`shake()` on refused purchases in `buyN` and `launchSpore`.

## Status

Closed (2026-08-19).

Done and browser-verified: the afford map is now declarative per act and
covers Act II/III singles **and** the ×10 buttons
(`buyPicker10`/`buyPresser10`/`buyFactory10`, `buySpoon10`/`buyWorks10`);
`buyN` and both Act I ×10 handlers refuse loudly (toast + shake); `TIPS`
covers every orchard, power, swarm and spore control with an FR entry.

Closed (2026-08-19). The two inspiration-spending controls now have
`blightCost()`/`syncCost()`, print their price on the button like every
other purchase, and join the Act II afford table while their panel is
live. `synchronise()` also stopped toasting in English only.

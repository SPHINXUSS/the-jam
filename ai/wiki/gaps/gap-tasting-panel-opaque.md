---
title: The blind tasting panel is not understood
type: gap
status: closed
serves: 1 — a sound mechanic reads as unreadable math
severity: medium
updated: 2026-08-19
---

## Problem

PO (p.34/38): *"It was already something I didn't understand but left it
as something that would appeal to very math oriented players."*

The panel is a round-robin strategy tournament with a randomised 2×2
payoff matrix (`engine.js:339-392`). The player picks a "palate"
(strategy) and is paid on where it places. The UI shows the raw payoff
grid as a table and a ranked list.

That is a game-theory exercise presented as a game-theory exercise. It is
mechanically sound — first place pays ×2.4, second ×1.05, so a correct
read is genuinely profitable (this answers the PO's separate complaint
that it paid less than it cost, p.59, which no longer applies).

The problem is purely comprehension.

## Fix direction

Keep the depth for the players who want it, add a readable surface for
everyone else:

- Name what each palate *does* in one plain clause ("ALWAYS A — always
  picks the same jar"), not just its code name.
- Say what the grid means in a sentence: "If you both pick A you each
  score 5; if you pick A and they pick B you score 2."
- Show the last result as a story ("Your palate placed 3rd of 6. Tit for
  tat won again."), which it partly does in the logbook already.
- Surface expected value or at least "this palate has placed 1st twice in
  your last five panels".

PO rule 2 applies: it must be approachable by default and deep on demand.

## Status

Open.

## Resolution (2026-08-19, commit 49c6a54)

Every palate now states its rule in one clause, the grid is explained, and
all eight names plus descriptions are translated. Also fixed a crash: the
panel's first press dealt a grid with no ranking yet and the renderer read
.slice() off null, killing the frame the first time the feature was opened.

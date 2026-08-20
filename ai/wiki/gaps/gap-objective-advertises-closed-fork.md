---
title: The objective line advertised a recipe the player had given up, forever
type: gap
status: closed
serves: 5 — the guide line lied about an already-closed fork
severity: high
updated: 2026-08-20
---

## Problem

Found by playing Act I to its end in a browser, 2026-08-20. After taking
one side of an exclusive fork — The Long Boil over The Quick Set — the
objective line read:

> Objective — **You can afford a recipe: The Quick Set**

The Quick Set was shut at that moment and stays shut for the run. It was
not in the recipe list. It could never be bought. The line said it
anyway, and went on saying it for the next eight hours of play.

Worse than a wrong sentence: that branch **returns early**, so it
suppressed every objective after it. For the rest of the act the game
could no longer say "jars are piling up", "add production", or "you have
unspent taste". The one sentence the player is promised was frozen on an
impossible instruction.

The same blindness sat in the notice queue: `scanRecipeNotices()` would
pop **"Now affordable: The Quick Set"** for the road not taken — the
exact notification discipline [[po-rules]] rule 5 forbids.

## Root cause — three copies of one test, two of them wrong

Taking a fork writes `s.recipes['x_'+other]` (`engine.js:1114`). Three
places asked "is this recipe on the table", each with its own copy of
the test, and only one remembered the `x_` marker:

| Site | Checked `x_`? |
|---|---|
| `drawRecipes()` (`ui.js:568`) | yes — which is why the list looked right |
| `objective()` (`engine.js:719`) | **no** |
| `scanRecipeNotices()` (`ui.js:96`) | **no** |

`buyRecipe()` did not check it either. Nothing reachable exploited that,
but the invariant was unguarded at the point that enforces it.

## Fix

One predicate, `recipeOpen(r)` (`engine.js`, next to `canAfford`), now
the single definition of "on the table": not taken, not closed by a
fork, right act, `when()` satisfied. All four sites call it.

This defect only became reachable when the three exclusive forks shipped
in session 002 ([[gap-choice-scarcity]]) — the feature that gives the
run its shape brought the bug that hid the objective line.

## Evidence

Chrome. Buy `long`; then:

```
bought: true   closed(x_quick): true
objective:     "Somebody is at the door. Sell them a jar."   (moves on)
recipe list contains quick: false
buyRecipe('quick') -> not bought
notice flags mentioning the closed fork: []
```

Before the fix the same script left the objective pinned to *"You can
afford a recipe: The Quick Set"*.

## Status

Closed. Related: [[gap-choice-scarcity]], [[engine-economy]],
[[003-first-browser-playthrough]].

---
title: Reduced motion deleted the entire feedback layer
type: gap
serves: 3 — every action feels like something
status: closed
severity: high
updated: 2026-08-20
---

## Problem

`style.css` carried one blanket rule:

```css
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.001s!important;transition-duration:.001s!important}
}
```

Every animation in the game collapsed to 1ms. The floating numbers, the
jam splash, the bumps, the pot's reaction to a click and the buy-flash
**all still fired, and none of them were visible**. A player with that OS
setting — it ships on in some setups, and battery savers force it —
played a game with no feedback whatsoever.

Measured in Chrome before the fix: floater computed `opacity: 0`,
`animation-duration: 0.001s`, while the same three events fired.

This also means "there was no juice at all" is a **reproducible player
report**, not necessarily a stale build. Ask which setting they are on
before assuming they played an old version.

## Fix

Reduced motion removes the *movement*, never the *feedback*. Each cue
keeps its duration and its meaning and expresses it without motion:

| cue | normally | under reduce |
|---|---|---|
| floating number | rises 52px, scales | fades in place, 1.15s |
| bump | scales to 1.22 | tints to `--damson` |
| refusal | shakes horizontally | inset border in `--boil` |
| pot hit | swells | brightens |
| splash | particles fly outward | stain fades |

One trap on the way: the override for the purchase flash was first
written `.bought`, which loses to the existing `button.bought` on
specificity even with `!important`. Both are `!important`; specificity
still decides.

## Evidence

Chrome with `reducedMotion:'reduce'`, three pot clicks: floater computed
opacity **0 → 0.52**, animation-duration **0.001s → 1.15s**, animation
name `floatUp` → `floatStill`, same three events firing. Independently
confirmed by a second browser run.

Related: [[juice-and-legibility]], [[gap-choice-controls-silent]]

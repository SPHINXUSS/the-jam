---
title: Every press-and-hold dial was dead to the keyboard
type: gap
status: closed
serves: 3 — core dials gave no action at all by keyboard
severity: high
updated: 2026-08-20
---

## Problem

Found by driving the game with a real keyboard in Chrome, 2026-08-20.
Focus the sugar dial, press Enter: nothing. Press Space: nothing. The
value does not move. The same for the price dial, and for the two
purchases that carry Act I.

Six controls, all silent to a keyboard:

| Control | What a keyboard player could not do |
|---|---|
| `sugarUp` / `sugarDown` | set the sweetness at all |
| `priceUp` / `priceDown` | set the price at all |
| `buySpoon` | buy an autospoon |
| `buyWorks` | buy a jamworks |

The sugar dial is the one system the wiki records as fully meeting its
intent ([[sugar-dial]]). Without a mouse it did not exist.

## Root cause — a class, not six bugs

`holdable(btn,fn)` (`feel.js:212`) bound `mousedown` and `touchstart` and
nothing else. These are `<button>` elements, so Enter and Space fire a
**click** — and nothing in the function ever listened for one. Every
control routed through `holdable` inherited the defect; no control
outside it did, because the rest of the game uses `onclick`.

That is why it survived this long. The pot, the sell button, the
recipes, the seller, the shop, the stake selector and the Act III trust
rows are all `onclick`, and all work by keyboard. Only the dials were
affected, and a mouse-driven check can never see it.

## Impact

The accessibility floor in [[juice-and-legibility]] — *"must not be the
only channel"* — was breached at the level of input, not decoration. A
player who does not use a mouse could reach Act I, make jam, and then be
unable to touch price or sweetness: the two decisions Act I is about.

## Fix

One place. `holdable` now also binds `keydown`/`keyup` for Enter and
Space (`feel.js:232-245`). The browser's own key repeat is ignored
(`e.repeat`), so a held key accelerates on the same curve as a held
mouse button, and `preventDefault` stops Space scrolling the page.

## Evidence

Chrome, real key events, each dial focused and pressed twice:

```
sugarUp    sugar   40 -> 41 -> 42 OK
sugarDown  sugar   42 -> 41 -> 40 OK
priceUp    price   3.2 -> 3.3 -> 3.4 OK
priceDown  price   3.4 -> 3.3 -> 3.2 OK
buySpoon   spoons  0 -> 1 -> 2 OK
buyWorks   works   0 -> 1 -> 2 OK
```

Mouse and touch paths re-checked unchanged in the same run.

## Status

Closed. Related: [[feel-feedback]], [[sugar-dial]],
[[003-first-browser-playthrough]].

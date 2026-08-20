---
title: 003 — the first browser playthrough
type: session
updated: 2026-08-20
---

# Session 003

## Goal

The PO left the session running overnight with no feedback available:
*"tackle next steps autonomously… I didn't have the time to run a game
session."* The wiki's next three were: close the art direction, play the
game end to end in a browser, and rework Act III's trust allocation.

The art direction needs the PO and could not move. So this session did
the second one properly, and what came out of it changed what the third
one should be.

## What was done

**The game was played from the first stir to the last jar, in Chrome.**
Three acts, 232 minutes of game time, through the real render loop and
the real controls. Nobody — agent or PO — had ever done that before;
Act III had never been reached at all.

How, since 3h36 of play does not fit in a work session: a script drives
the game's own `requestAnimationFrame` loop frame by frame, so the clock
runs fast while every tick, render, reveal and save happens exactly as
written. On top of it sits a policy that plays like a competent player —
it clicks the pot, buys crates when the larder runs low, follows the
game's own advice line on price, chases the stated sugar target, hires
sellers, takes every affordable recipe, picks a house style, keeps the
orchard's three stages level, and launches spores. It presses real
buttons in the real DOM. Nothing is stubbed.

The first two attempts failed in ways worth recording: the policy stalled
because it stopped stirring, and then stalled again with inspiration
pinned at its cap. Both stalls were the game telling the truth about
itself — the second one turned into [[gap-inspiration-cap-silent]].

## What it found

Five defects. **Not one of them could have been found by the simulator**,
because every one is display, wiring or input — the exact class
[[003-fix-classes-not-instances]] says a harness cannot see.

| | |
|---|---|
| [[gap-controls-keyboard-dead]] | six dials — price, sugar, spoon, jamworks — dead to the keyboard. One place, `holdable`. |
| [[gap-objective-advertises-closed-fork]] | the objective line stuck forever on a recipe the player had given up, suppressing every objective after it |
| [[gap-trust-minus-crash]] | Act III's trust "−" buttons threw on click; the panel was read-only on arrival |
| [[gap-inspiration-cap-silent]] | the palate sits full for hours; nothing says so, and the objective line has no branch for it |
| [[gap-exchange-money-printer]] | the exchange pays 7× in ten minutes at the **safest** setting and structurally cannot lose |

The first four are fixed and verified. The fifth is not touched: it
changes the shape of a run, so it is the PO's decision — three options
are laid out on its page.

## Commits

| | |
|---|---|
| `afaae55` | keyboard on every dial; closed forks stop being advertised; Act III trust minus; the palate says when it is full; the empty recipe state knows its act |

## Verified

Chrome, real input, zero page errors in every run:

- every dial driven by Enter and Space, mouse and touch re-checked
- a fork taken, the closed side gone from the list, the objective line,
  the notice queue and `buyRecipe` all refusing it
- Act III trust rows: plus, minus, free-trust readout, no exception
- the inspiration sentence in both states, in EN and FR, across a reload
- the recipe empty-state per act and at the ending
- the exchange: stake selector, invest, drift, withdraw — honest, and
  much too generous
- two complete playthroughs to the ending screen
- `node ai/tools/i18n.js audit` → 0 missing of 434

## Still true, and worth saying plainly

A script completed this game. Nobody has *enjoyed* it. The playthrough
proves the machine runs; it says nothing about whether the orchard reads
to a human being or whether 3h36 is the right length. That still needs
the PO, and [[gap-act-ii-illegible]] stays open until it happens.

## Small things noticed, not done

- The page has no favicon — the only 404 in the whole run. Left alone
  because the art direction is open ([[004-art-direction-pixel]]).
- Creativity ends the run at ~47,000 with four recipes ever asking for
  it, the dearest wanting 200. It is a currency with nothing to buy.

## Next

1. Close the art direction (PO).
2. Decide what the exchange should cost (PO) —
   [[gap-exchange-money-printer]].
3. Rework Act III's trust allocation. It now *works*, but it is still
   eight rows of plus and minus arriving fully spent, which is the flat
   control [[gap-choice-scarcity]] wants replaced.

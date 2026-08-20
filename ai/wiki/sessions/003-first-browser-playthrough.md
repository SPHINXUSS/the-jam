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

## Then the third next-step, which the playthrough had just made
possible

With Act III's trust panel no longer throwing, it could finally be looked
at — and it was eight rows of plus and minus that explained nothing. It
now carries what each trait does, its live effect in numbers, and what
one more point would buy, with a sentence underneath naming what is
actually limiting. [[gap-trust-allocation-flat]].

Fixing it surfaced one more instance of the oldest defect class in this
codebase: `set()` cached DOM nodes without checking they were still in
the document, so any panel rebuilt with `innerHTML` silently swallowed
its updates. Found because the new effect lines went blank on a language
switch. `set()` now re-resolves a detached node.

## And then the harness earned its keep a second time

Committing the harness as `ai/tools/play.js` meant running it once more
from its new home. That run did not finish. It reached Act III at minute
185 and was still there at minute 999, having launched 14,658 spores into
a fleet that never rose above one, against rogue colonies that had
reached thirteen sextillion.

[[gap-act-iii-drifter-lock]]: the act could be locked dead, and the way
out was priced above the ceiling a player could reach. Three stacked
faults, the worst of which stopped the act ticking at all. Fixed, and the
whole escape played through in a browser to prove it — stalled, bought
the answer, moved the points, relaunched, back to a fleet of 19,385 and
conversion climbing.

That is twice now that running the real thing found something no amount
of reading or simulating had. It is the argument for keeping the harness
in the repo.

The same run also exposed the script: it bought the escape and then never
used it, because it only ever pressed **+** and the act arrives fully
allocated — Defence has to be taken out of something else. The script
reallocates when raided now. With that, the run finishes: 74m / 111m /
25m, ending at minute 210.

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
3. Act III's trust allocation is now legible
   ([[gap-trust-allocation-flat]]), but it is still a stat spread that
   arrives fully allocated. What [[gap-choice-scarcity]] actually wants —
   archetypes, a run history, a fork with a name — is unbuilt and is a
   design conversation, not a fix.

## A question for the PO, from the same finding

Act III's recipes are priced in inspiration — 90,000, 140,000, 200,000 —
against a ceiling of `1000 x 40 x notebooks^1.3`. A player who spent Act
I's taste on ovens rather than notebooks arrives with a ceiling of
40,000 and **cannot buy any of them, ever**. One of them, Wild Yeast, is
now priced under that ceiling because it is the escape from a trap. The
rest are not, and whether that is a fair consequence of an early choice
or a dead end wearing a price tag is a design question, not a defect I
should settle alone.

## One more small thing noticed

French writes a space before `%`; this game writes none, everywhere,
because `pct()` does. It is consistent, so it was left alone rather than
half-changed. Worth a decision at some point.

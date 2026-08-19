---
title: 002 — PO feedback round two
type: plan
status: mostly closed
updated: 2026-08-19
---

## Why this plan exists

The PO asked, verbatim: *"Did you do a plan on what you will do and this
isn't just something that was done yet or is it something you skipped for
some reason. This is starting to be a recurrent question on different
subject, kill this trend in the egg."*

So: every item below is written down before it is built, in the order it
will be built, and each one closes with browser evidence or is explicitly
reported as not done. Nothing is silently dropped. If an item is cut, it
is cut **in writing, here**, with the reason.

## The 20 items, split one per symptom

| # | Symptom (PO's words, short) | Batch | Status |
|---|---|---|---|
| F1 | "still seeing some untranslated bits and pieces" | 1 | ✓ shipped |
| F2 | dollars → euros in FR (symbol only, no conversion) | 1 | ✓ shipped |
| F3 | min price capped at 1.80 is limiting; never let the floor trap the player | 4 | ✓ shipped |
| F4 | sugar is a solved puzzle — find the spot, leave it. Make it move with price | 4 | ✓ shipped |
| F5 | manual selling exploit: max price + click = free money | 4 | ✓ shipped |
| F6 | the pot looks bad, is unsatisfying, the spoon leaves the pot, text selects, a black square appears | 3 | ✓ shipped (art direction provisional — [[004-art-direction-pixel]]) |
| F7 | "what does the serviced percentage represent?" | 1 | ✓ shipped |
| F8 | the Act II unlock recipe still talks about "culture" | 1 | ✓ shipped |
| F9 | +price tooltip covers the bars; +price does not need a tooltip | 1 | ✓ shipped |
| F10 | the sounds are gone — "what else haven't you caught?" | 2 | ✓ shipped |
| F11 | the jamworks upgrade arrives immediately after the jamworks | 4 | ✓ shipped |
| F12 | ×10 with partial funds should say how many it can actually buy | 1 | ✓ shipped |
| F13 | no juice work was done at all — and the trend of skipping planned work | 5 | ⚠ partial |
| F14 | a fun flashing warning when out of crates, game-designed not dashboard | 5 | ✓ shipped |
| F15 | Act II fiction is nonsense: pulp → fruit → jars, where did the jam go | 6 | ✓ shipped |
| F16 | FR wording: "La rouille est dans les rangs…" | 1 | ✓ shipped |
| F17 | bottling readout spills out of its box at big numbers | 1 | ✓ shipped |
| F18 | Act II is exhausted in minutes — complete overhaul | 6 | ✓ shipped |
| F19 | work the maths and the psychology; research what other designers do | 7 | ✓ shipped |
| F20 | upgrade descriptions and puns do not land | 6 | ⚠ partial |

## Batches, in build order

**Batch 1 — defects and legibility.** F1, F2, F7, F8, F9, F12, F16, F17.
Cheap, visible, and they are the ones that make the game look unfinished.

**Batch 2 — the sounds.** F10, plus a written answer to "what else
haven't you caught": a full audit of what the rewrite dropped.

**Batch 3 — the pot.** F6. Three real defects plus a change of
rendering approach.

**Batch 4 — Act I economy.** F3, F4, F5, F11. These four are one system,
not four fixes, and must land together or the balance is meaningless.

**Batch 5 — juice.** F13, F14.

**Batch 6 — Act II.** F15, F18, F20.

**Batch 7 — balance.** F19. A runnable simulation, then a tuning pass
against it, then a played run.

## Design decisions taken before coding

### The manual-selling exploit (F5) — a queue at the door

In Universal Paperclips there is no manual sell: public demand is
`(1 + 0.1·U)·(1.1^M)·bonuses·(0.8/P)` and inventory leaves at that rate,
so price is a real lever and there is no way to sell at the cap. Our
game has manual selling on purpose (PO ask #1036), and that is where the
hole is: `sellByHand()` pays `s.price` no matter what the price is.

Fix: **customers queue at the door.** Appetite that your sellers cannot
reach walks up to the house instead and waits. Selling by hand serves the
queue; with nobody at the door there is nothing to sell. Raise the price
to the cap and the queue stops filling, so the exploit pays nothing.

This also gives Act I the thing Cookie Clicker has and we do not: a thing
on screen that is *there to be clicked*, that accumulates while you are
away, and that you lose by ignoring.

### Sugar (F4) — the sweet spot moves with the price

Today `sugarPeak()` is a constant per house style, so the dial is solved
once and never touched again. The PO's own reasoning is the fix: people
who pay for a brand want fruit, people who buy the cheapest jar want
sugar.

- The **peak moves down as the price goes up**: a $1.50 crowd wants it
  sweet, an $8 crowd wants fruit.
- The **tolerance narrows as the price goes up**: expensive buyers are
  fussy, bargain buyers are not.

So every price change moves the sweet spot, and the dial is live for the
whole act. The band is drawn on the control so it is a decision and not a
guessing game.

### Act II (F18) — why it empties in minutes

Three causes, all measurable:

1. The act hands you `max(made × 0.8, 5,000,000)` jars on entry while the
   first machine costs 400. You can buy the entire act immediately.
2. Cost growth is `1.00015^n` — flat. There is no cost pressure at all,
   ever. (Cookie Clicker uses ×1.15 per unit.)
3. Five buildings and ten recipes is not an act.

Fix: real cost curves, an entry grant sized to the *first purchase*
rather than to lifetime production, tier upgrades gated on ownership
milestones (Cookie Clicker's model), and a timed clickable event so idle
time has a reason to be watched.

### Act II (F15) — the fiction

The chain is currently orchard → pulp → fruit → jars, which is backwards
and skips the jam. It becomes:

orchard → **picked fruit** → **jam** (fruit and sugar, in a pan) → **jars**

State field names stay as they are (`s.pulp`, `s.ofruit`) because
renaming a saved field discards every existing save. Only the labels,
the machine names and the copy change.

## Completion rule

An item is done when it is fixed, its class is swept, and the exact
scenario has been driven in a browser. Anything not done is listed here
as not done, with the reason.


## Where it landed (2026-08-19)

Eighteen of twenty items are shipped and browser-verified. Two are
partial and named as partial rather than quietly closed:

- **F13, juice.** The larder stamp, the timed visitor, the boost line,
  the pot rebuild and the sounds all landed. What has *not* been done:
  purchase pop on the shop list, the recipe list lighting up as it
  becomes affordable, and numbers rolling rather than snapping. Those
  are still open.
- **F20, descriptions.** Three recipes whose joke needed a maths degree
  were rewritten (Hadwiger Stacking, Donkey Space, Elliptic Preserving)
  and the Act II fiction was corrected end to end. A full pass over all
  66 descriptions has **not** been done.

### Measured, not guessed

`ai/tools/sim.js` plays the real game through a stub DOM. Current run:

| | length |
|---|---|
| Act I | 45m |
| Act II | 58m |
| Act III | 48m |
| **total** | **2h34m** |

A player who stops touching it after six minutes finishes in the same
time, because automation carries the rest. That is the genre's contract
and it now holds.

### A correction worth keeping

The session summary claimed Act II "opened with zero power and an
unaffordable sun trap". The PO pushed back: what they played let them buy
everything and never run out of money. **They were right.** The power
finding came from an intermediate state of *this session's* build, made
by cutting the arrival grant, found by the simulator and fixed before
anything shipped. It was never in a build anybody played.

The arithmetic on what they did play:

| | played | now |
|---|---|---|
| jars on arrival | 5,000,000 | 2,600 |
| pickers affordable at once | 7,040 | 5 |
| sun traps affordable at once | 131 | 0 |
| 1,000th picker | $465 | $400 × 1.12^1000 |

The pushback also found a real bug: with the small grant, spending it all
on pickers left a player with no jar income and no way back. Fixed as a
class — see [[log]].

### Still open from round one

- [[gap-house-styles-inert]] — the fork still changes little the player
  can feel. Untouched this round.
- [[gap-choice-scarcity]] — the player still rarely decides anything.
  The door queue, the moving sugar band and the catchments each add
  something, but the underlying complaint is not answered.

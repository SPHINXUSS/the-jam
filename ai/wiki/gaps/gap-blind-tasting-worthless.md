---
title: The blind tasting is not worth playing
type: gap
status: open
serves: direction 1 (the player should feel smart) · po-rule 11 (differentiated gratification)
updated: 2026-08-20
---

# The blind tasting is not worth playing

## Problem

The PO, 2026-08-20:

> *"The blind testing has honnestly very little interest for the player
> since the setting point is much easier, less restricted and rewards
> more. Have a look at how the paperclips balanced theirs."*

## Impact

This is the game's only **modelling** system — the one place a player is
asked to reason about other agents rather than about a curve. Direction 1
says the player should feel smart; this is the mechanic most directly
built to deliver that, and it is the one nobody has a reason to touch.

He is also protective of it. On an earlier exploit he said *"maybe this
should be a feature only rewarding the players that make the effort to try
understand the math of it"* (`gpt:1611`). He rejected the exploit, not the
system. **Do not solve this by deleting it.**

## Root cause

Two separate faults, and the second is the one that matters.

**It costs inspiration and pays inspiration.** The tasting charges a stake
and returns `stake × mult` (`engine.js`, `readTasting`). It is a pure
gamble inside a single currency, so at best it converts inspiration into
slightly more inspiration. The setting point (`readCulture()`) costs
nothing, has a 220 ms cooldown, and pays inspiration for a well-timed
read. One is free and spammable; the other is a bet. A player compares
them once and never opens the tasting panel again.

**The reward is four flat buckets.** `mult` is `2.4 / 1.05 / 0.5 / 0.15`
by finishing place. Reading the grid *nearly* right pays the same as
guessing. There is no gradient, so there is nothing to get better at —
which is exactly the thing the system exists to reward.

## What Paperclips does (researched 2026-08-20)

Sourced from Frank Lantz's own patch notes at
`decisionproblem.com/paperclips/patch2notes.html`, plus the community wiki.

- **Different currency in, different currency out.** A tournament costs
  **Operations** and pays **Yomi**. It is a conversion, not a bet against
  itself.
- **The payoff is continuous in how right you were.** *"You earn yomi
  equal to the number of points your pick scored times the number of
  strategies it beat. (If it didn't beat any strats it gets 1x not
  zero...)"* — degree of correctness, not rank, and **the floor is not a
  loss**.
- **Later projects raise both cost and reward** rather than replacing the
  system (Theory of Mind doubles both; Strategic Attachment pays 50,000 /
  30,000 / 20,000 for a correct 1st/2nd/3rd prediction).
- **The exploit fix is instructive.** Players found it optimal to buy no
  strategies at all; Lantz made owning all of them a *requirement* for the
  big bonus. His stated reason: it was *"too much gameplay to skip"*.
- His design goal, in his words, was that players want strategies
  *"because of what they did, how they worked"* — legibility as the
  reward, which is our direction 1 almost verbatim.

## Three options for the PO

Each keeps the skill gate he asked to protect. **His call — this changes
what a run is spent on.**

**A. Make it a conversion.** Costs inspiration, pays **creativity**.
Creativity is currently a by-product of overflowing inspiration and
nothing else, so the tasting becomes the only *deliberate* way to get it,
and it stops competing with the setting point because it does not produce
the same thing. Closest to Paperclips. Depends on creativity being worth
having, which needs checking.

**B. Pay for the margin, not the rank.** Keep the currency, replace the
four buckets with Lantz's formula: what your palate scored, times how many
palates it beat, with a floor of 1× rather than a loss. Reading the grid
well pays several times what guessing pays, and reading it badly costs
nothing but the time. Smallest change; does not fix the same-currency
problem.

**C. Both, and gate the top tier on owning the palates.** A, plus B, plus
the top multiplier only available once every palate has been unlocked —
his "only rewarding the players that make the effort" made mechanical.
Most work, closest to what he described wanting.

## Status

**Open.** Researched, not implemented — the choice changes the shape of a
run, which is a PO decision under the escalation rule in `CLAUDE.md`.

Related: [[gap-tasting-panel-opaque]], [[intent]], [[po-rules]],
[[research-queue]], [[005-desktop-feedback-round]]

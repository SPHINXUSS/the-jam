---
title: The player almost never makes a decision
type: gap
status: partially closed
severity: high
updated: 2026-08-19
---

## Problem

PO: *"it's the only 'choice' ever the player makes at any point which is
not what the initial idea was."*

Inventory of actual player decisions in a full run:

| Decision | When | Real? |
|---|---|---|
| House style | Act I, 800 jars | Yes, but imperceptible ([[gap-house-styles-inert]]) |
| Price | continuous | Yes — the best decision in the game |
| Sugar | Act I, 60 jars | Yes, but static once optimised |
| Which recipe next | continuous | Weak — mostly "whatever is affordable" |
| Ovens vs notebooks | per taste earned | Yes, genuinely interesting |
| Exchange risk tier | Act I late | Weak — no stake control ([[gap-exchange-stake-control]]) |
| Tasting palate | Act I late | Yes, the strongest minigame decision |
| Orchard philosophy | Act II, 8% | Yes, magnitude only |
| Harvest intensity | Act II | Yes |
| Trust allocation | Act III | Yes, the best decision in Act III |

So there *are* decisions — but they are clustered late, and the two the
player meets first (house style, recipes) are the weakest. The felt
experience is "I press buttons until numbers allow the next button".

## Intent on record (GPT thread, not built)

- **Build archetypes**: five axes — Price (commodity/luxury), Volume
  (artisan/factory), Quality (functional/obsessive), Risk
  (stable/speculative), Reputation (anonymous/cult) — with named emergent
  personas (Cult Artisan, Factory Goblin, Speculative Gourmet,
  Neighbourhood Legend). PO called this *"the biggest thing I would add"*.
- **Information asymmetry**: replace exact demand with ranges and mood
  ("Expected demand 1.3-1.8/sec, Market mood: warming"), so setting a
  price is a judgement, not a lookup.
- **Market events as situations**: *"Weather warning: cold front in 90
  seconds, strawberry supply expected to fall 30-50%"* — forcing buy
  now / wait / switch recipe / raise price, rather than a passive +20%.
- **Run history / end-of-run summary**: average price, peak demand,
  strategy, biggest mistake, biggest win. PO: *"this is a huge missed
  opportunity."*

## Status

Open. This is the strategic gap behind most of the PO's other complaints.
Needs a design pass and PO sign-off, not incremental tuning.


## What landed 2026-08-19

The PO's ask is *"I want to feel smart and feel like I made a choice
other players may not have done"* and *"it feels very corridor like"*.
A shopping list you eventually buy all of cannot produce that, so three
recipe pairs are now **mutually exclusive**. Taking one shuts the other
for the run; the card says which door it shuts before you press it.

| Act | Take | or take |
|---|---|---|
| I | The Long Boil — inspiration ×1.5 | The Quick Set — 35% more jam from everything |
| I | Lexical Preserving — word of mouth ×1.5 | The Plain Label — +1.20 on the price ceiling |
| II | Leave the Hedgerows — buffers ×2, spoilage ×0.5, picking ×0.8 | Clear the Hedgerows — picking ×1.45, spoilage ×1.5 |

Plus, from the same round: the house style is now a real fork
([[gap-house-styles-inert]]), the sugar dial has a target that moves
every time the price moves, and Act II asks which stage to build, whether
to buy tolerance instead of throughput, and how hard to run.

## Why this is only partially closed

Every decision above is still a decision *inside a run*. What the PO
asked for was a run they could **describe to somebody else** — and three
forks plus a house style is four bits of run identity, which is a start
and not an answer. Not done:

- No run history, so two runs cannot be compared.
- No archetype that changes the *shape* of the act rather than its
  numbers.
- Act III's trust allocation is the deepest decision in the game and is
  still presented as a row of plus and minus buttons.

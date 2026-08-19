---
title: The player almost never makes a decision
type: gap
status: open
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

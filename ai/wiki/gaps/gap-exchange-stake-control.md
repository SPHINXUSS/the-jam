---
title: The exchange gives the player no control over the stake
type: gap
status: closed
severity: medium
updated: 2026-08-19
---

## Problem

PO: *"beta player feedbacked that they'd like to control what amount of
money they put in the exchange minigame, I think percentages of current
cash instead of numbers would make the most sense."*

## Current behaviour

`exInvest()` (`engine.js:315`) hard-codes `const amt = s.cash*0.25;` and
refuses under $50. The player has one button, `Invest`, and cannot
choose how much. The only lever is the risk tier
(`#exRisk`, low/medium/high -> volatility 0.035/0.075/0.15).

Withdrawal is all-or-nothing (`exWithdrawAll`).

## Fix

The PO has already made the design call: **percentages of current cash**,
not absolute amounts. That is the right choice for an incremental game —
it stays meaningful across six orders of magnitude of cash.

- Stake selector: 10% / 25% / 50% / All, as a segmented control matching
  the existing intensity-row pattern (`#intensityRow`, `ui.js:719`).
- Show the resolved amount next to it so the abstraction stays concrete:
  "50% -> $12,400".
- Partial withdrawal, same percentage control.
- Keep the $50 floor as a guard, but say why when it refuses.
- Feedback: the invest button must float the amount and the withdraw must
  float the profit/loss in good/bad colour. Currently neither does.

## Status

Open. Small, self-contained, clearly specified by the PO — good first-batch
candidate.

## Resolution (2026-08-19)

Fixed and verified in a headless Chromium run against the real page, not
by code reading. See the Current State block in `index.md` for the
recorded before/after values.

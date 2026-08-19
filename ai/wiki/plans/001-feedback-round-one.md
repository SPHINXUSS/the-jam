---
title: 001 — PO feedback round one
type: plan
status: open
updated: 2026-08-19
---

## Scope

The PO's feedback of 2026-08-19, split one item per symptom, plus the
three defects found while reading the code.

## Batch A — wiring defects (cheap, high visibility)

| Gap | Work |
|---|---|
| [[gap-dead-readouts]] | Make `set()` unable to fail silently; verify all three readouts move |
| [[gap-automatic-selling]] | Route sales through `servicedPerSec()`; split hand/auto counters; retune reach |
| [[gap-exchange-stake-control]] | Percentage stake selector + partial withdraw + feedback |

Batch A is unblocked and should ship first. It resolves three of the
PO's seven points and makes the rest measurable.

## Batch B — legibility

| Gap | Work |
|---|---|
| [[gap-demand-bar-illegible]] | Wanted / Made / Backlog model, labelled, with a sentence |
| [[gap-affordance-act-ii]] | Declarative afford map per act; tooltips for every control, EN+FR |
| [[gap-act-ii-unverified]] | Play Acts II and III in a browser; record findings |

## Batch C — feel

| Gap | Work |
|---|---|
| [[gap-the-pot]] | Replace the spoon-in-jar with a real pot the player clicks |
| [[gap-idle-player]] | Give automation a visual voice; timed market events |

Batch C needs a design proposal to the PO before code.

## Batch D — strategy (PO sign-off required)

| Gap | Work |
|---|---|
| [[gap-house-styles-inert]] | Forks that differ in kind, not degree |
| [[gap-choice-scarcity]] | Build archetypes, information asymmetry, run history |
| [[gap-seller-demand-balance]] | Full balance pass once A and B land |

## Completion rule

Closed when every gap above is `status: closed` with browser evidence.

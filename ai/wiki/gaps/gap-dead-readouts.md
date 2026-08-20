---
title: Three readouts never update (madeRate, sellerCost, shopCost)
type: gap
status: closed
serves: 3 — automation's own payoff never visibly climbs
severity: high
updated: 2026-08-19
---

## Problem

PO, verbatim: *"the stat in the middle 'made/produit' is always at 0/s,
this is not new btw, I just forgot to mention it before."*

## Root cause — confirmed, and it is a class

`set(k,v)` (`ui.js:451`) is `if(el[k] && el[k].textContent!==v) el[k].textContent=v;`

`el` is populated once from a hard-coded id array (`ui.js:441-449`). Any
`set()` call whose key is missing from that array resolves to
`el[k] === undefined` and **silently does nothing**. No error, no warning.

Diffing every `set('…')` call against the cache array gives exactly three
orphans:

| Key | Written at | Symptom |
|---|---|---|
| `madeRate` | `ui.js:471` | "Made" stuck on the markup default `0.0 /sec` |
| `sellerCost` | `ui.js:494` | Hire button always reads `$45` — real cost is `45*1.45^n` |
| `shopCost` | `ui.js:495` | Shop button always reads `$3,200` — real cost is `3200*1.6^n` |

The seller/shop ones are worse than cosmetic: the player is quoted a
price that is wrong by orders of magnitude by mid-act, which feeds
directly into [[gap-seller-demand-balance]].

## Fix

Instance fix is three strings in the array. **The class fix is to make
the failure impossible**: have `set()` fall back to
`document.getElementById(k)` and cache the result on miss, or assert in
dev. Do the class fix.

Also worth a lint: nine ids are cached but never `set()` (they are
written via `innerHTML`/`style` instead) — harmless, but the array is
clearly hand-maintained and drifting.

## Reproduce

Open the game, stir until the shelf panel appears, buy an autospoon.
`Output` moves; `Made` stays `0.0 /sec`.

## Status

Open. Cheap, high-visibility. Should ship in the first batch.

## Resolution (2026-08-19)

Fixed and verified in a headless Chromium run against the real page, not
by code reading. See the Current State block in `index.md` for the
recorded before/after values.

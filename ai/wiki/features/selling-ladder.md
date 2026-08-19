---
title: Selling ladder — hand, table, sellers, shops
type: feature
status: blocked
spec_source: ai/source/gpt_transcript.pdf + PO feedback 2026-08-19
updated: 2026-08-19
---

# Selling ladder

The intended shape of Act I's first hour: you sell jars yourself, one at
a time, and buy your way out of that job step by step.

## Intent -> code

| # | Intent | Status | Evidence |
|---|---|---|---|
| 1 | Selling is manual at the start; nothing sells itself | ✗ missing | `ui.js:631-633` sells full `demand()` every tick from jar one |
| 2 | "A Table by the Door" recipe opens a trickle of passive sales | ✗ missing | `engine.js:432` sets `s.autoSell`, which nothing reads in the sale path |
| 3 | Sellers raise the share of appetite serviced | ✗ missing | `reachShare()` `engine.js:197` used only for a label, `ui.js:494` |
| 4 | Shops raise it further, unlocking at 4 sellers | ⚠ partial | unlock works `ui.js:500`; effect does not |
| 5 | Hand-selling scales with skill ("Both Hands") | ✓ done | `sellByHand()` `engine.js:204`, `s.sellSkill` set by `hands` recipe |
| 6 | Costs escalate per unit | ⚠ partial | curves exist (`45*1.45^n`, `3200*1.6^n`) but the button labels are frozen ([[gap-dead-readouts]]) |
| 7 | "Sold by hand" counts hand sales | ✗ missing | `s.sold` incremented by both paths, `engine.js:207` and `ui.js:632` |

Two of seven bullets pass. `status: blocked` on
[[gap-automatic-selling]].

## Why it matters

This ladder is the player's first experience of buying their way out of
labour — the core promise of the genre and the beat Act I opens on. It is
currently the most broken system in the game and the PO noticed
immediately.

Related: [[engine-economy]], [[gap-seller-demand-balance]]

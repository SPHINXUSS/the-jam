---
title: Act I economy — the real numbers
type: module
status: active
updated: 2026-08-19
---

# Act I economy (`engine.js`)

The one system in the game that behaves like an economy. Everything here
is `engine.js` unless stated.

## Constants

`REF_PRICE 3.20 · PRICE_MIN 1.80 · PRICE_MAX 12 · BALK 5.80` (line 166).
Anchored to real jam prices (Bonne Maman EUR 2.15-3.49) after the PO
rejected the original $0.05 optimum as "economically absurd for the
fiction".

## Demand (line 184)

```
wanted = appetiteBase * marketReach * awareness * (REF_PRICE/price)^elasticity
         * sugarAppetite
if price > BALK: wanted *= exp(-(price-BALK)^2 / 4.2)
```

- `marketReach() = 1.6^(mkt-1)` — geometric, so the curve always has room.
- `awareness = max(1, mktEff)^0.45`.
- `elasticity()` 0.66 maker / 0.82 store / 0.72 unpicked.
- `appetiteBase()` 0.78 maker / 0.92 store / 0.84 unpicked.
- Design target (PO, from the GPT thread): a genuine revenue-maximising
  middle price. Neutral market: $1.80 -> $2.29/s, $3.20 -> $2.69/s,
  $5.80 -> $3.18/s (peak), $7.50 -> $1.72/s.

## Sugar (lines 176-181)

`sugarAppetite = 0.55 + 0.75*exp(-((sugar-peak)/22)^2)`, range 0.55-1.30.
Peak is 58% (store) / 38% (maker) / 48% (unpicked). Costs
`0.004 * sugar` per jar. Two players optimise to different settings —
this is one of the few places the [[house-styles]] fork actually bites.

## Selling — intended vs actual

Intended ladder: sell by hand -> a table by the door -> sellers -> shops,
with `reachShare()` (line 197) capping the share of appetite you can
service: `min(1, 0.08 + sellers*0.055 + shops*0.16)`, and `0` until the
`counter` recipe sets `s.autoSell`.

**`servicedPerSec()` (line 203) is never called.** `tick()`
(`ui.js:631-633`) sells the full `sellPerSec()` = `demand()` every tick,
from the very first jar, ignoring `autoSell`, sellers and shops entirely.
See [[gap-automatic-selling]].

## Production

`autoPerSec() = spoons*0.85*spoonPower + works*120*worksPower` (line 210).
Costs: spoon `18*1.28^n`, works `900*1.16^n`, marketing `120*1.5^(mkt-1)`.
Manual `stir()` makes `s.perClick` jars (1, then 2 with `grip`, 5 with
`grip2`) and consumes one fruit each.

## Fruit

Crate price random-walks toward $12 every 2.5s, clamped $5-30, with a
1.2% chance per step of a glut (x0.6) or frost (x1.5) (line 248). If the
player has no fruit, no jars and no cash, a neighbour leaves fruit after
8s — the anti-softlock floor (line 241). Never remove it.

## Inspiration / creativity / taste

- `inspRate = (ovens*3*inspMult + swarmGift) * actMult` (x1/x4/x25 by act).
- `inspMax = 1000 * memMult * cellars^1.3` (memMult x1/x6/x40).
- Overflow above the cap becomes creativity at `creaRate()` — so
  deliberately under-building notebooks is a viable strategy.
- Taste is earned at fixed lifetime-jar milestones `TASTE_AT` (line 151),
  36 steps from 500 to 1e10. Spent 1:1 on an oven or a notebook.

## Recipes (`R`, line 425)

56 entries. Each: `{id, name, act, i?/c?/m? cost, when(), desc, run()}`.
`when()` gates visibility; `run()` mutates state and often calls `show()`.
Act transitions are recipes: `release` -> `beginAct2()`, `spore` ->
`beginAct3()`, `last` -> `beginFinale()`.

Adding a recipe: append to `R`, no registration needed. `drawRecipes()`
rebuilds only when the availability signature changes.

## Objective strip (line 396)

`objective()` returns `{en, fr}` for the current nudge. It is the
implementation of PO rule 4 ("one sentence, always"). Every new system
needs a branch here or it becomes invisible.

Related: [[selling-ladder]], [[sugar-dial]], [[house-styles]], [[architecture]]

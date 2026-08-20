---
title: The Preserve Exchange pays 7x in ten minutes and never loses
type: gap
status: open
severity: high
updated: 2026-08-20
---

## Problem

Measured in a browser, 2026-08-20. Put $100,000 into the exchange, leave
it, and take the median of five runs:

| Risk setting | after 1 min | after 5 min | after 10 min |
|---|---|---|---|
| **low** | $124,080 | $274,762 | $715,107 |
| medium | $161,108 | $559,090 | $4,213,497 |
| high | $222,869 | $1,969,353 | $38,678,656 |

Ten minutes at the **safest** setting multiplies the stake sevenfold.
At the boldest it multiplies it 387-fold.

## Why it cannot go the other way

`exTick()` (`engine.js:614-615`) gives every holding a **positive drift
every tick** — `0.010 / 0.018 / 0.028` by risk — with symmetric noise on
top. Drift beats noise over any meaningful span, so the risk selector
does not choose between safe-and-slow and risky-and-fast. It chooses how
fast you win. "Risk: high" is never the wrong button, which is the shape
[[po-rules]] rule 1 exists to prevent: a choice with no trade-off.

## Impact

The exchange unlocks at 2,400 inspiration, in the middle of Act I. From
that point the jam economy is decoration. Price, sweetness, sellers,
shops, the door queue, the house style — every decision Act I is built
out of is worth less than pressing Invest and waiting. It also makes the
measured act lengths untrustworthy: a player who finds this finishes Act
I in a fraction of the time a player who ignores it needs, and the
simulator's 42-minute Act I never touched it.

The mechanic itself is good — [[gap-exchange-stake-control]] gave it a
real stake selector and it reads clearly. What is wrong is that it only
ever pays.

## What it needs — a product decision, not a code fix

This changes the shape of a run, so it is the PO's call. Three ways out,
in order of how much they change the feel:

1. **Make the drift negative or zero at the top of the range**, so high
   risk is genuinely a gamble and low risk merely parks money.
2. **Cap what it can hold** — a desk that takes at most some multiple of
   your income, so it supplements the jam instead of replacing it.
3. **Charge for it** — a fee on withdrawal, or holdings that decay if
   left alone, so it rewards attention rather than absence.

Not changed unilaterally. Awaiting the PO.

## Status

Open. Related: [[gap-exchange-stake-control]], [[engine-economy]],
[[selling-ladder]], [[003-first-browser-playthrough]].

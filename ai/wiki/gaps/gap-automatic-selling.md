---
title: Selling is automatic from jar one
type: gap
status: closed
severity: critical
updated: 2026-08-19
---

## Problem

PO, verbatim: *"the whole principle of having manual sell in the
beginning is for the selling to not be automatic, yet you added it on
top? makes no sense, automatic should be unlocked gradually with sellers
and shops etc."*

## Root cause — confirmed in code

`engine.js` defines the intended ladder:

- `reachShare()` (`engine.js:197`) returns `0` unless `s.autoSell`, then
  `min(1, 0.08 + sellers*0.055 + shops*0.16)`.
- `servicedPerSec()` (`engine.js:203`) = `demand() * reachShare()`.

**`servicedPerSec()` is never called anywhere.** Verified:
`grep -n servicedPerSec ui.js engine.js` returns only its own definition.

The actual sale loop, `tick()` (`ui.js:631-633`):

```js
const want = sellPerSec()*dt;          // sellPerSec() === demand()
const sold = Math.min(s.jars, want);
s.jars -= sold; s.sold += sold; s.cash += sold*(s.price - sugarCostPerJar());
```

No `autoSell` check, no `reachShare` factor. Every jar produced sells
itself at full appetite from the first second of the game.

## Impact

- The manual sell button is decorative. The whole opening beat — "jars do
  not sell themselves, not yet" — is contradicted by the game itself.
- The `counter` recipe ("A Table by the Door", `engine.js:432`), whose
  entire payload is `s.autoSell = true`, buys the player nothing.
- Sellers and shops are pure sinks: hiring changes the `Serviced %`
  readout and nothing else.
- `s.sold` double-counts: incremented both by `sellByHand()`
  (`engine.js:207`) and by the passive loop, so "Sold by hand" is wrong.

## Fix (class, not instance)

1. `tick()` must sell `servicedPerSec()*dt`, not `sellPerSec()*dt`.
2. Manual `sellByHand()` sells against the *unserviced* remainder of
   appetite, so hand-selling stays useful early and tapers naturally.
3. Separate the counters: `s.soldByHand` vs `s.soldAuto`. Fix the
   `#soldByHand` readout to the former.
4. Re-tune `reachShare` constants against the new curve — 8% base on the
   `counter` recipe is a design number that has never actually run.
5. Sweep for the same class of defect: any engine function defined for a
   ladder and never called. `sellSkill` (`engine.js:206`) is used;
   check `swarmBoost` (`ui.js:110`) which is also uncalled.

## Status

Open. Highest priority — it is the one that makes Act I's opening
dishonest. Blocks [[selling-ladder]] and [[gap-seller-demand-balance]].

## Resolution (2026-08-19)

Fixed and verified in a headless Chromium run against the real page, not
by code reading. See the Current State block in `index.md` for the
recorded before/after values.

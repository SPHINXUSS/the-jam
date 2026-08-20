---
title: Act III's trust "−" buttons threw an exception on click
type: gap
status: closed
severity: high
updated: 2026-08-20
---

## Problem

Every "−" button in Act III's spore design panel was broken. Pressing one
did nothing visible and threw:

```
TypeError: Cannot set properties of null (setting 'textContent')
```

Trust could be added to a trait and never taken back. Since the act
arrives with all twelve points already allocated
(`fresh()`, `engine.js:113-114`), and the only way to fund one trait is
to starve another, this made the panel **read-only on arrival** — the
one decision Act III offers could not be made until a later recipe
granted spare points.

## Root cause

`buildAlloc()` (`ui.js:551`) wrote the minus button as:

```js
'<button data-t="'+t[0]+'" data-d="-1" …>'
```

`t` is the translation function. `t[0]` is `undefined`. Every minus
button in the panel carried `data-t="undefined"`, so the handler mutated
`s.alloc['undefined']` and then looked up `#al_undefined`, which does not
exist. The plus buttons, written on the next line, correctly used
`tr[0]`.

A one-character slip — `t` for `tr` — in generated markup, in the act
nobody had ever opened.

## Fix

`tr[0]`. One character (`ui.js:551`).

## Evidence

Chrome, Act III, trust panel open:

```
buttons: speed:-1 speed:1 explore:-1 explore:1 replicate:-1 …
after ++ : speed 0 -> 2
after -- : speed 2 -> 1        (no exception; free-trust readout follows)
page errors: []
```

## Status

Closed. The panel's *design* — plus/minus rows for eight traits — is
still the flat control [[gap-choice-scarcity]] wants replaced. Related:
[[ui-render-loop]], [[003-first-browser-playthrough]].

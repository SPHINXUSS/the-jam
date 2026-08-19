---
title: The sugar dial
type: feature
status: done
spec_source: ai/source/gpt_transcript.pdf
updated: 2026-08-19
---

# Sugar

Revealed at 60 jars (`ui.js:664`). A 0-100% dial with hold-to-repeat.

## Intent -> code

| # | Intent | Status | Evidence |
|---|---|---|---|
| 1 | Sweeter sells faster up to a peak, then people put the jar down | ✓ done | `sugarAppetite()` `engine.js:177`, gaussian 0.55-1.30 |
| 2 | Sugar costs money per jar | ✓ done | `sugarCostPerJar()` `engine.js:181`, `0.004*sugar`, deducted at `ui.js:633` |
| 3 | Optimum differs by house style | ✓ done | `sugarPeak()` `engine.js:176`, 38% maker / 58% store |
| 4 | Player can see the effect | ✓ done | `#sugarEffect` and `#sugarCost` readouts, `ui.js:478-480` |
| 5 | Hold to adjust quickly | ✓ done | `holdable()` `ui.js:716-717` |

The one system that fully meets its intent. It is also, per the design,
one of the few places the [[house-styles]] fork actually bites.

## Caveat

Once found, the optimum never changes — so the dial is a one-time puzzle,
not an ongoing decision. Making it move (seasonal fruit, customer mood,
recipe interactions) would convert it from a solved lookup into a live
decision. Not currently planned; noted for [[gap-choice-scarcity]].

---
title: Feedback layer
type: module
status: active
updated: 2026-08-19
---

# `feel.js`

118 lines. The whole "does pressing this feel like anything" layer.

| Export | Line | What it does |
|---|---|---|
| `floatText` / `floatFrom` | 9 / 17 | floating +N from a node, 1.25s life |
| `flash(kind)` | 24 | full-screen good/bad inset flash |
| `bump(node, cls)` | 31 | scale-pulse a readout |
| `shake(node)` | 37 | horizontal shake on a refused action |
| `stirKick(power)` | 44 | adds spin to the spoon on a manual stir |
| `stirTick(dt)` | 45 | eases spin toward an automation-derived target, writes `--churn` |
| `holdable(btn, fn)` | 59 | press-and-hold repeat, accelerating 170->90->45->22ms after a 340ms delay |
| `installTips` / `showTip` | 97 / 110 | `data-tip` tooltips, translated through `t()` |

`TIPS` (line 82) is a flat id->string map; a button with no entry has no
tooltip. Twelve ids are covered; every orchard, swarm, spore and exchange
control is not.

## The bar this layer has to clear

Every player action must produce, within one frame: a number that moves,
a visible reaction on the thing acted upon, and — where it costs or earns
— a floating value. A refusal must `shake` and not silently do nothing.

Current coverage is Act I only, and thin even there. Automation currently
produces no feedback at all: jars appear, cash appears, nothing moves.
See [[juice-and-legibility]].

Related: [[style-and-palette]], [[architecture]]

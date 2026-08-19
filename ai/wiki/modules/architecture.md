---
title: Architecture — five files, one global state
type: module
status: active
updated: 2026-08-19
---

# Architecture

No build step, no bundler, no dependencies, no runtime fetching. Five
files loaded as plain `<script>` tags in a fixed order
(`index.html:310-313`). Everything is a global. There are no modules,
no IIFEs, no `export`.

## Load order (do not change)

| Order | File | Owns |
|---|---|---|
| 1 | `i18n.js` | `DICT`, `LANG`, `t()`, `tf()`, `snapshotStatic()`, `setLang()` |
| 2 | `feel.js` | floating numbers, flash/bump/shake, spoon spin, `holdable()`, tooltips |
| 3 | `engine.js` | state `s`, save/load, Act I economy, recipes `R`, objectives |
| 4 | `ui.js` | Act II + III simulation, render, wiring, the rAF loop, `boot()` |

`ui.js` ends by calling `boot()` — that is the entry point.

## The leaky seam (know this before you touch anything)

The header of `engine.js` claims *"No DOM rendering lives here"* and
`ui.js` claims to be *"rendering, feedback, interaction"*. **Both are
false.**

- `engine.js` touches the DOM directly: `drawLog()` writes `#log`
  (`engine.js:104`), `drawJar()` mutates SVG (`engine.js:126`), `show()`
  / `hide()` toggle panel classes (`engine.js:114-121`), `toast()` writes
  `#toast`, and recipe `run()` callbacks call `show()` and even
  `$('#autoFruit')` (`engine.js:490`).
- `ui.js` holds the **entire Act II and Act III simulation** —
  `act2Tick` (`ui.js:152`), `act3Tick` (`ui.js:260`), all orchard cost
  curves, power, spoilage, swarm, spores, combat — plus `tick()`
  (`ui.js:619`) and the act transitions.

So: Act I economy lives in `engine.js`; Acts II/III economy lives in
`ui.js`. This is history, not design. Do not "fix" it as a side quest;
if a change forces the seam open, propose the move as its own commit.

## The loop

`frame(now)` (`ui.js:643`), one `requestAnimationFrame`:

| Cadence | What runs |
|---|---|
| every frame | `tick(dt)` simulation, `stirTick(dt)`, `updateChips`, `noticeTick` |
| `acc > 0.1s` | `render(acc)` — all DOM text sync |
| `revealAcc > 0.5s` | `drawRecipes`, `checkReveals`, `forkTick`, `scanRecipeNotices`, `installTips` |
| `saveAcc > 10s` | `save()` |

`dt` is clamped to 0.5s so a backgrounded tab cannot fast-forward.
Offline catch-up is replayed in `boot()` (`ui.js:776-778`), capped at one
hour of absence over at most 240 synthetic ticks.

## State

One mutable global `s`, shaped by `fresh()` (`engine.js:58-81`). Saved as
one JSON blob to `localStorage['the-jam-v1']`. `load()` merges over
`fresh()` so new fields get defaults — **adding a field to `fresh()` is
save-compatible; renaming or changing the meaning of one is not.** There
is no migration path other than `s.v` (currently `1`); a `v` bump
silently discards every existing save.

Storage degrades gracefully: if `localStorage` throws, `store` falls back
to an in-memory object and the Save button says so (`engine.js:12-22`).

Note the codebase mutates `s` in place everywhere. That is the existing
convention; the immutability rule in the global coding style does not
apply retroactively here.

## Rendering conventions

- DOM ids are cached once into `el{}` (`ui.js:441-449`); `set(k,v)`
  (`ui.js:451`) diffs `textContent` before writing.
- **`set()` on an id not present in that cache array silently does
  nothing.** This has already cost three live readouts — see
  [[gap-dead-readouts]]. Any new `set('x',…)` requires `'x'` in the array.
- Buttons and containers not in the cache are looked up ad hoc with `$()`.
- Panels start `.hidden` in markup and are revealed by `show(id, note)`.

## Deploy

Push to `main`; GitHub Pages rebuilds in a minute or two.
`raw.githubusercontent.com` caches for several minutes — do not verify a
push by fetching raw URLs, verify via `git log` / the Pages URL.

Related: [[ui-render-loop]], [[engine-economy]], [[i18n]], [[style-and-palette]], [[feel-feedback]]

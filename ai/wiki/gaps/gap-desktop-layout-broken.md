---
title: Gap — the wide-screen layout looked broken
type: gap
status: closed
severity: high
updated: 2026-08-20
---

# The wide-screen layout looked broken

**Reported** 2026-08-20, after session 5 shipped "the desktop layout uses
the screen": *"what you produce is not great, it looks very broken... And
I can see several things that are wrong in what you changed as well."*

## What was actually wrong

Four defects, found by driving the real page in Chrome at 1440, 1920 and
2560 and measuring the boxes.

1. **The chrome and the content were different widths.** `.stage` grew to
   `min(1900px, 100vw-40px)` above 1400px; the top bar, the objective band
   and the alarm stayed at a fixed 1180px. At 1920 that is a 1180px header
   floating above an 1880px stage, offset from it on both sides.
2. **The authored columns dissolved.** Above 1400px `.col{display:contents}`
   handed every panel to a CSS multi-column flow. The pot no longer sat
   where the pot sits, and a fresh run showed three small cards adrift in a
   screen of empty ground.
3. **The larder alarm covered the top bar.** The band is `position:fixed`
   and `body.dry{padding-top:74px}` pushed the page out from under it —
   which only holds at scroll offset zero. The page moved on its own:
   Chrome re-anchors the scroll position when content appears above the
   fold, so the bar slid up under the band by 30–80px.
4. **The room turned red, not cold.** `#alarm` carried
   `box-shadow:0 0 0 100vmax rgba(214,35,78,.05)` — a red film over the
   whole viewport, on top of everything, for as long as the larder was
   empty. Underneath it the `saturate(.1)` drain was doing the opposite job.

And one from the same session's floating numbers: a floater climbs 62px,
so a number leaving a value at the top of a short card crossed the card's
own label. `PRODUCTION` with `+407` written through it. The outline halo
made it worse, not better — an outline interleaves with the letters
underneath instead of hiding them.

## What it is now

- One `--wrap` token. The bar, the objective, the alarm and the stage all
  read from it, so every band lines up. 1180 → 1560 at 1400px → 1760 at
  1800px.
- **The page only takes the whole screen once there is enough on it to
  fill one.** Under six visible cards it stays at 1180 whatever the
  monitor, so the first screen of a run reads as composed rather than as
  three cards adrift. `fitStage()` counts them in `render()` — not at the
  reveal, because there are two reveal paths and a panel added to only
  one of them is an old bug of ours (trap 3).
- The three authored columns stay at every width. What changes with the
  screen is the track sizes, and past 1800px the middle column stands its
  cards two abreast — the middle is the one with no natural ceiling.
- **The act says which shape the page takes.** Act II builds its whole
  operation in the left column, so in Act II the left column is the wide
  one and it is the one that goes two abreast. Act II at 1920 went from
  ~1560px tall to ~900 — one screen.
- `html{overflow-anchor:none}`. The page no longer scrolls itself, so the
  fixed alarm cannot slide over the bar.
- The red film is gone. The drain is the whole effect.
- A floater is a chip now: opaque ground, its own edge, so it covers what
  it passes over instead of blending into it. It is clamped to the card it
  came from, minus that card's label row; with less headroom than its
  climb it takes a short flight instead, and steps to the side of its own
  value rather than landing on it.

## Evidence

Chrome, `playwright-core` + system Chrome, at 1440×900, 1920×1080 and
2560×1440, Act I fresh, Act I with an empty larder, and Act II. Measured
`getBoundingClientRect` for every band and every floater; screenshots read
back. `node ai/tools/i18n.js audit` → missing: 0. `node ai/tools/sim.js`
→ acts unchanged (49m / 1h00 / 48m).

Related: [[juice-and-legibility]], [[style-and-palette]], [[feel-feedback]]

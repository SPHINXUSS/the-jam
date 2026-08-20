---
title: Session 6 — the layout regression, reviewed and fixed
type: session
updated: 2026-08-20
---

# Session 6

## What the PO said

Two things, in one message.

1. **Stop writing so much.** *"I don't need you to write big prose, on the
   contrary it takes me much effort to read your huge summaries at the
   end and I don't read the things you send in between."* Plus the cost:
   chat prose is the most expensive text in the usage window.
2. **The desktop layout is broken.** *"what you produce is not great, it
   looks very broken... And I can see several things that are wrong in
   what you changed as well. Don't have time to write you a full summary,
   review your own work."*

## The first one is a process fix, not a task

Written into two places so it survives this session: a memory file
(`keep-chat-short`) and the **Working style** section of `CLAUDE.md`.
The rule: a few lines, no narration between tool calls, no structured
end-of-work report, detail goes in the wiki. It overrides the global
after-implementation summary rules, which is why it had to be written
down rather than remembered.

## The second one: five defects, all from session 5

Found by driving the real page in Chrome at 1440, 1920 and 2560 and
measuring the boxes — not by reading the diff. Full write-up in
[[gap-desktop-layout-broken]].

| What | Root cause |
|---|---|
| A 1180px header floating over an 1880px stage | the stage got a new max-width, the three other bands did not |
| The room rearranged itself | `.col{display:contents}` above 1400px handed every panel to a multi-column flow |
| Three cards adrift on the opening screen | same, plus nothing capped the width when there was nothing to put in it |
| The alarm covered the top bar | fixed band + `padding-top`, and the page re-anchored its own scroll |
| The whole screen went red | `box-shadow:0 0 0 100vmax` red film, over everything, on top |
| `PRODUCTION` with `+407` written through it | a floater climbs 62px; an outline halo interleaves with the letters underneath instead of hiding them |

## What is different now

- **One `--wrap`.** Bar, objective, alarm and stage all read from it.
- **The authored columns stay.** Track sizes change with the screen.
- **The act decides the shape of the page.** Act II builds everything in
  the left column, so in Act II the left column is the wide one and it is
  the one that stands its cards two abreast: ~1560px tall down to ~900 at
  1920.
- **The page widens only once six cards exist.** The opening screen keeps
  the 1180px frame it always had.
- **`html{overflow-anchor:none}`.** The page no longer scrolls itself.
- **A floater is a chip.** Opaque, clamped to its own card minus the label
  row, short flight when there is no headroom, sidesteps its own value.

## Also

`ai/tools/player.js` — the stand-in player, lifted out of `sim.js` so
every headless harness plays the same way. `ai/tools/pace.js` — a pace
map: beats and affordable choices, a minute at a time, for the *"still
kinda boring"* question. First reading, unworked: **Act I 2.9 affordable
choices a minute, Act II 4.8, Act III 1.1**, and no dead stretch over 90
seconds anywhere. So the boredom is not silence; it is sameness.

## Checks

Chrome at three widths, Act I fresh, Act I with an empty larder, Act II,
and a save-and-reload. `node ai/tools/i18n.js audit` → missing: 0.
`node ai/tools/sim.js` → 49m / 1h00 / 48m, unchanged.

## Next

1. **Answer "still kinda boring"** — direction 2 and 3. The pace map says
   where to look: Act III has one affordable thing a minute.
2. The blind tasting and the exchange are both waiting on a PO decision.
3. Nobody has enjoyed this build. Still the question the wiki cannot answer.

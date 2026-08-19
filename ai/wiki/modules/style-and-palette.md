---
title: Visual identity, palette and animation
type: module
status: active
updated: 2026-08-19
---

# `style.css` + the look

Deliberately **not** the warm-cream-and-terracotta that GPT reached for.
The frame is a preserving laboratory: enamel green-grey ground, didone
jar labels, mono readouts.

Type: **Bodoni Moda** (labels, headlines) / **IBM Plex Sans** (UI) /
**IBM Plex Mono** (readouts). Loaded from Google Fonts (`index.html:8-10`)
— the one external dependency in the project.

## Tokens (`:root`, lines 8-24)

| Token | Value | Role |
|---|---|---|
| `--enamel` | `#E4E7DE` | page ground |
| `--card` / `--card-2` | `#F2F3EC` / `#EAEDE3` | panels |
| `--ink` | `#1E1A22` | text |
| `--damson` | `#6B1F4A` | positive accent |
| `--boil` | `#D6234E` | primary / warn accent |
| `--sugar` | `#B8801A` | secondary accent |
| `--steel` | `#7E857C` | muted text |
| `--jar-a` / `--jar-b` | `#E0456B` / `#7A1338` | jar gradient |

## Act palette shift

`body.act-2` (26-41) and `body.act-3` (43-58) redeclare **every** token —
orchard green-black, then void indigo. `body` and `.panel` transition
background/border over 2.4s, so the class toggle animates rather than
snaps. Adding a colour means adding it to all three blocks.

## Animations defined

`unfold` (panel reveal, used by `.reveal`) · `floatUp` (floating numbers)
· `flashBad` / `flashGood` (full-screen inset flash) · `bump` / `bumpBad`
(stat pulse) · `shake` (failed action).

`prefers-reduced-motion: reduce` collapses all durations (279-281). Any
new animation must be covered by that rule.

## Layout

CSS Grid, `.stage` = `264px | 1fr | 330px` (line 108), collapsing to
`1fr 320px` under 1080px and one column under 760px. Columns are flex
stacks of `.panel`. Header and objective strip share the 1180px
max-width.

## The pot

The centrepiece is an inline SVG jar (`index.html:38-66`) with a clipped
fill group, bubbles, and a `#spoon` group rotated by `stirTick()`. It
fills by `log10(jars)/6` in Act I, by conversion share in Acts II/III.

The PO's verdict on this as a manual-stirring affordance is blunt and
recorded in [[gap-the-pot]]: it is a jar with a spoon in it, not a pot
you stir. This is the single biggest visual-identity gap.

Related: [[juice-and-legibility]], [[feel-feedback]], [[gap-the-pot]]

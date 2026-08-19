---
title: 004 — Art direction, provisional: pixel art
type: decision
status: provisional — the PO has not closed this
updated: 2026-08-19
---

# 004 — Pixel art, as the working default

**Status: not final.** The PO's words: *"T5 looks very good, but is it
working in our game design? I'm not really available rn so let's keep
this decision for later, save this as the default for now but don't
close this."* Treat this as the current build's answer, not as settled.

## The problem

The PO rejected the pot three times. The last rejection named the cause:
*"I explicitly told you that things built from shapes like this is not
looking good and asked you to find other options that look better to
humans, that's a game we are designing, kid drawing is not our DA."*

Four attempts were made and all four were rejected or set aside:
shaded SVG primitives, an engraved plate, a painted canvas, and an
enamel sign. All four were the same method — objects assembled in code
out of vector geometry — with different surface treatments.

## What the research said

The PO also asked, fairly: *"why are you not listening to me and looking
at other games like the famous cookie clicker and other success games in
this category?"* So they were checked:

| Game | How its objects are drawn |
|---|---|
| Cookie Clicker | 300+ PNG files and sprite sheets. The big cookie is a painted raster image. |
| (the) Gnorp Apologue | pixel art |
| Mushies | pixel art |
| Idle Iktah | hand-drawn raster |
| Idle Slayer | drawn character art |
| Universal Paperclips | **no art at all** — text and buttons |

Not one successful game in the category builds its objects out of
code-generated vector shapes. The genre's answer is: draw it, or do not
draw anything. That is why four surface treatments all read as
assembled — the method was wrong, not the shading.

## Decision

Pixel art, and the view moves to **directly above the pot** (the PO's
suggestion, and a good one: what fills the frame becomes the jam rather
than a metal silhouette, and the stock level reads as the size of the
disc).

Pixel art is chosen because it is the one *drawn* style that can be
authored properly in code rather than approximated. A pixel is a
deliberate decision, not a fallback.

## How it is built

- A 64×64 buffer drawn at a whole-number scale (192px desktop, 128px
  small screens), so a pixel is always a crisp square.
- Everything is computed in polar coordinates. The jam is a spiral
  quantised to four flat tones, sheared by radius, so the middle of the
  pan turns faster than the edge — which is what stirred preserve does.
- Ten colours per act. Changing act changes ten hex values and nothing
  else, so the direction carries across all three acts for free.
- Palettes live in `POT_PAL` (`engine.js`) rather than in CSS, because a
  canvas cannot read a custom property. **An act's colours must be
  changed in both `style.css` and `POT_PAL`.**
- Drawn every frame from `frame()`, not from `render()` — at ten frames
  a second the swirl stutters.
- Under `prefers-reduced-motion` the spiral stops advancing and the
  bubbles do not spawn.

## What is still open

1. Whether pixel art fits the rest of the design — the didone titles and
   mono readouts are a very different register. The contrast may be the
   point, or it may be a clash. **The PO has this call.**
2. If it stays: every other object (jars, autospoons, jamworks, pickers,
   pans, lines, the swarm, the spores) is redrawn to the same law.
3. The still-open alternatives, both prototyped and screenshotted:
   painted-from-above (organic, warmest) and engraved-from-above
   (matches the existing type). Prototypes are reproducible from this
   page's history.

## Alternatives considered and why not

- **Real illustration supplied by the PO** — highest ceiling by a
  distance, and the honest best answer. Blocked: no image generation is
  available in this session. Still the right upgrade if the PO wants it.
- **No art at all, the Paperclips route** — genuinely defensible and
  suits "a state preserving-research institute". Rejected because the PO
  has asked repeatedly for the game to be *less* like a dashboard.

Related: [[juice-and-legibility]], [[style-and-palette]], [[gap-the-pot]]

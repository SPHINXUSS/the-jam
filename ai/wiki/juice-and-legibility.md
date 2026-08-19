---
title: Juice and legibility — the bar every mechanic must clear
type: reference
status: active
updated: 2026-08-19
---

# The bar

A mechanic in this game is finished when it is **legible** and **felt**.
Both are in scope for every feature checklist (see the DoD in
[[WIKI]]). Neither is currently met across most of the game — that is
the substance of the current PO feedback round.

## Legible

A player who has never seen the game can, within a few seconds:

1. Say what this control does, in their own words.
2. Say whether the current value is good or bad and which way to move it.
3. Predict what happens if they press it.

Test: hand it to someone. If they say "I think that's the demand bar?",
it fails. That is verbatim what happened
([[gap-demand-bar-illegible]]).

Practical rules:
- Label both ends of a bar, or put a sentence under it.
- Never show a ratio without showing its two terms.
- Never use red for a normal operating state.
- Say the resolved number next to a percentage ("50% -> $12,400").
- Every readout that exists must actually update ([[gap-dead-readouts]]).

## Felt

Every player action produces, within one frame:

1. A number that visibly moves (`bump`).
2. A reaction on the thing acted upon (pulse, ripple, spin).
3. A floating value where something was spent or earned (`floatFrom`).
4. On refusal: a `shake` and a reason — never silence.

And the **automated** economy needs a voice too. For most of a run the
player is watching, not clicking. Right now automation is completely
silent. See [[gap-idle-player]].

## On Cookie Clicker

The PO's instruction is precise: *"have a look at cookie clicker yourself
to get an idea of what we're doing wrong in the juicy animation
department. Don't [take] their visual identity which wouldn't match ours,
keep ours but improve on this."*

Take the **technique**:
- The click target is the big object, not a button next to it.
- Feedback spawns at the cursor position, not at a fixed spot.
- Purchases pop; the shop list visibly reorders and lights up.
- Production is visible as accumulating stuff, not only as a number.
- Timed interrupts (golden cookie) give idle time a reason to be watched.

Leave the **look**: no gold-and-brown, no cartoon bevels, no confetti.
Ours is enamel green-grey, didone labels, mono readouts
([[style-and-palette]]).

## Accessibility floor

Everything above must degrade under `prefers-reduced-motion: reduce`
(`style.css:279-281`) and must not be the *only* channel for information —
if a colour or a shake carries meaning, a word carries it too.

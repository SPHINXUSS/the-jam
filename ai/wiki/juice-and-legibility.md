---
title: Juice and legibility — the bar every mechanic must clear
type: reference
status: active
updated: 2026-08-20
---

# The bar

A mechanic in this game is finished when it is **legible**, **felt**, and
**differentiated**. All three are in scope for every feature checklist
(see the DoD in [[WIKI]]). None is currently met across most of the game.

Read [[intent]] for what the game should become. This page is the bar a
mechanic must clear once it exists.

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
player is watching, not clicking. This page claimed until 2026-08-20 that
automation was "completely silent"; that was **out of date and nearly
sent a session to re-do finished work**. Automation does speak: the pot
simmers at a rate derived from `autoPerSec()` (`feel.js`), and automated
jars and cash float once a second (`autoPulse`, `ui.js`). What is still
missing is a *picture* of it — jars physically leaving, a delivery route.
See [[gap-idle-player]].

## Differentiated

**If everything is juicy, nothing is.** Undifferentiated feedback becomes
wallpaper within minutes, and if every action feels the same then no
decision matters — which kills po-rule 3, "I want to feel smart".

> A good decision must feel **different** from a mediocre one, not merely
> louder.

Today the game fails this outright: every button gives the same feedback
tier, or none at all in Acts II and III. Nothing distinguishes *catching
the setting point at the right moment* from *stirring*. The game rewards
**activity, not judgement** — which is a plausible cause of the PO's
"Act II is just pushing buttons".

Evidence status, checked 2026-08-20: practitioners describe an
over-juicing ceiling where feedback tips into noise and obscures strategic
readability, but **no study measures it**, and **no study at all** exists
on undifferentiated feedback — juice that fails to encode which action
mattered. We are ahead of the literature on our own central defect
([[research-queue]] H3). Design carefully and watch a real player.

Practical: reserve the loudest channel for the moments that reward
judgement. Routine actions get the quiet tier. A distinct *kind* of
feedback (a different sound, a different motion, a sentence in the log)
reads as meaning; the same feedback at higher volume reads as noise.

## The rising number has a half-life

Satisfaction comes from the **perceived rate of change**, not from the
value. A number rising steadily stops being felt; linear growth feels like
it is slowing down.

Every shipped game in the genre answers this with exponential curves, and
they converge on a narrow band — Clicker Heroes ≈1.07, Cookie Clicker
buildings ≈1.15, AdVenture Capitalist 1.07–1.15. Empirically tuned feel.

**Two honest caveats**, from the 2026-08-20 research pass
([[research-queue]] H2). First, the popular explanation — "because
perception is logarithmic" — is a gloss added by commentators; the
practitioner literature the genre actually runs on explains the curve as
growth-rate mathematics and never mentions psychophysics. Second, **how
fast the sensation decays has never been measured**. Use the curve; do not
pretend we know the half-life.

The better lever is periodic **re-anchoring** — a new resource, a new
unit, a new panel, a change of scale — giving the player a fresh magnitude
to feel. Paperclips is built almost entirely out of re-anchorings, and
critics reading it closely identify the repeated **change of verb** as its
actual mechanism: what you *do* changes, not only what you count.

When a stretch of the game feels flat, check the curve before adding
content.

## On Cookie Clicker — take the technique, check the schedule

The PO's instruction is precise: *"have a look at cookie clicker yourself
to get an idea of what we're doing wrong in the juicy animation
department. Don't [take] their visual identity which wouldn't match ours,
keep ours but improve on this."*

Take the **technique**:
- The click target is the big object, not a button next to it.
- Feedback spawns at the cursor position, not at a fixed spot.
- Purchases pop; the shop list visibly reorders and lights up.
- Production is visible as accumulating stuff, not only as a number.

Leave the **look**: no gold-and-brown, no cartoon bevels, no confetti.
Ours is enamel green-grey, didone labels, mono readouts
([[style-and-palette]]).

**And do not take the golden cookie uncritically.** A randomly-timed bonus
that must be caught is a variable-interval reinforcement schedule — the
slot-machine pattern. Rule 2 asks for pressure that is **visible coming,
actionable and survivable**; an unannounced timer is none of the three.

Two honest qualifiers from the research pass ([[research-queue]] H4). The
harm from variable rewards is **not universal** — pre-registered work
separates a compulsion-driven motivation from a fun-driven one, and
concentrates the damage in the first. And our proposed alternative,
predictable announced timing, has **no supporting study whatsoever**; it
is a reasonable hypothesis repeated by design blogs, and we should test it
in play rather than cite it.

This whole section exists because an earlier version of this page
recommended "timed interrupts" without noticing they conflicted with
rule 2.

## Pressure should come from the jam

We do not need to import tension. It is already in the subject:

- jam catches if you leave it
- the setting point arrives, and it passes
- fruit spoils
- market day ends

A visible clock, an available gesture, a recoverable failure. Native
tension that looks like jam-making rather than like a slot machine — and
it serves po-rule 3, because **without stakes, a good decision feels like
nothing**. Pressure is what makes being smart feel like anything at all.

## Accessibility floor

Everything above must degrade under `prefers-reduced-motion: reduce`
(`style.css:279-281`) and must not be the *only* channel for information —
if a colour or a shake carries meaning, a word carries it too.

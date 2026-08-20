---
title: The visitor has no reason to be there
type: gap
status: open
serves: po-rule 2 (pressure visible, actionable, survivable) · the legibility bar
updated: 2026-08-20
---

# The visitor has no reason to be there

## Problem

The PO, 2026-08-20:

> *"the weird bee vibrating on screen, very simple shape made, popping up
> and giving money, doesn't really make sense to me, it could be funny or
> something but right now its just 'what's that doing here ?'"*

Note what he did **not** say: he did not ask for it to be removed. He said
it could be funny. The complaint is that it means nothing.

## Impact

It is the only thing in the game that appears unbidden and asks to be
clicked, so it is carrying more weight than its design supports. Right now
it is a wordless icon that pays out for no stated reason — which is the
shape of a slot machine, and [[juice-and-legibility]] already warns
against importing the golden cookie uncritically: an unannounced timed
bonus is not *visible coming*, which po-rule 2 requires.

## Root cause

Three faults, of which two are fixed and the third is the real one.

1. **It vibrated.** The wings were flapping at about seven hertz. At 58px
   that is not flight, it is a buzzing artefact. *Fixed* — slower and
   shallower, and the idle loops now stop outright under reduced motion
   rather than becoming 1ms strobes.
2. **It was wordless.** A control nobody can name fails the legibility
   bar outright. *Fixed* — it carries its name, in both languages, without
   needing a hover.
3. **It is not motivated.** A wasp turns up at a jam kitchen window for an
   extremely good reason — there is jam about — but the reward it hands
   over is cash or a queue at the door, which does not follow from a wasp
   at all. The fiction and the payout are unrelated, and that mismatch is
   what "what's that doing here?" is actually pointing at. **Not fixed.**

## The question for the PO

What is it *for*? Two coherent answers, and they are different games:

**A. It is caused, not random.** A wasp finds you because the jam smells
right, and so do people — so the arrival rate rises with word of mouth
rather than running on a fixed timer, and it announces itself one beat
before it can be clicked. It stops being a slot machine and becomes a
reward for something the player did. Serves po-rule 2 properly.

**B. It is a joke, and the joke is the point.** Lean into the wasp: it is
a nuisance, catching it is petty satisfaction, and the payoff is dry
rather than generous. Cheaper, keeps the surprise, and it is the reading
closest to *"it could be funny or something"*.

They are not exclusive, but A changes the pacing of a run and B changes
the tone, so **it is his call, not mine.**

## Status

**Open on the design question.** The vibration and the missing label
shipped 2026-08-20.

Related: [[gap-idle-player]], [[juice-and-legibility]], [[po-rules]],
[[005-desktop-feedback-round]]

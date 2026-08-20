---
title: The Setting Point still has the cooldown the PO asked to remove
type: gap
status: closed
serves: 2 — a cooldown blocked the always-available toy PO wanted
severity: medium
updated: 2026-08-19
---

## Problem

The PO asked for a cooldown early on (p.26, "read the culture need a
cooldown, otherwise spamming"), then **reversed it later** after playing
(p.59): *"lets bring back the ability to spam the culture but to be able
to loose some as well."*

The later instruction wins. It is not implemented.

## Current behaviour

`readCulture()` (`engine.js:286`) sets `cultureReadyAt = Date.now()+3500`
and refuses while the cooldown runs. Downside risk does exist —
a bad read costs up to 25% of held inspiration (`engine.js:292`).

So the game has the cooldown *and* the risk. The PO asked for the risk
*instead of* the cooldown: a fast, tactile, spammable toy where reading
the oscillation badly actually hurts.

## Fix

- Remove or shorten the cooldown to a fraction of a second (enough to
  prevent a single click registering twice).
- Keep and tune the loss: a wrong read should sting immediately and
  visibly.
- Re-check the reward scale — at spam rates the current `sum*180*chipMult`
  payout will need reducing, or inspiration becomes free.
- Give it the feedback the mechanic deserves: the chips should visibly
  swing, and the moment of reading should be legible as good or bad
  before the number appears.

Note the button label was separately wrong: it rendered "Read the
culture" at runtime (`ui.js:557`) — English-only in FR mode, and the
exact phrasing the PO rejected twice as nonsense in French. Fixed
2026-08-19 to "Test the set" / "Tester la prise".

## Status

Open.

## Resolution (2026-08-19)

Cooldown cut to 220ms; gains and losses made symmetric. Measured in the
browser: 80 blind reads netted +475, 40 timed reads netted +1,547 — spam
is near-neutral, timing pays about six times as much per click.
Inspiration cannot go below zero.

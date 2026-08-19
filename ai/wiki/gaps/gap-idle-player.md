---
title: The player is not kept busy
type: gap
status: open
severity: high
updated: 2026-08-19
---

## Problem

PO: *"you didn't implement all that I told you about, you need to self
brainstorm and come up with solution for everything while balancing the
game and making it satisfying at the same time. Keep the player busy
whether it is by actually doing something, thinking, having animations on
actions etc."*

Three distinct kinds of "busy", all currently thin:

**Doing.** After autospoons arrive (~40 jars), the only recurring physical
verb is nudging the price. Hand-selling is redundant
([[gap-automatic-selling]]). The Setting Point and the tasting panel are
both on cooldowns (3.5s / 15s) and both arrive late in the act.

**Thinking.** Almost every number is displayed exactly, so decisions are
lookups rather than judgements. See [[gap-choice-scarcity]].

**Animation.** Feedback exists only for manual clicks
(`floatFrom`/`bump`/`shake`, `feel.js`). Automation is silent: jars
appear, cash appears, nothing on screen moves. In an incremental game the
automated economy is what the player watches for most of the run, and it
currently has no visual voice at all.

## Fix direction

- Give automation a heartbeat: jars visibly leaving, a delivery pulse per
  sale batch, the pot simmering at a rate you can read at a glance.
- Periodic small decisions with a clock on them — the market-event model
  from the GPT thread ("cold front in 90 seconds") is exactly this and was
  never built.
- Make idle time productive to *watch*: the fill gauge, the bottleneck
  label, the day/night cycle in Act II are all already simulated but
  barely visualised.
- Cookie Clicker is the reference for technique only: click feedback at
  the cursor, particles, accumulating visible product, satisfying
  purchase pops, and the golden-cookie-style timed interrupt. PO is
  explicit that the *look* stays ours.

## Status

Open. This is the umbrella gap; most other open gaps are instances of it.

Related: [[juice-and-legibility]], [[gap-the-pot]]

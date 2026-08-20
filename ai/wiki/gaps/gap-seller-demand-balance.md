---
title: Sellers, shops and demand are not balanced against each other
type: gap
status: open
serves: 2 — the shifting three-curve tension never gets to play
severity: high
updated: 2026-08-19
---

## Problem

PO: *"connection to autosellers and client demand is not balanced you
need to refine this system (not to say the whole tbh)."*

## Why it cannot currently be balanced at all

The link does not exist in the running game. `reachShare()` — the only
place sellers and shops touch demand — is used by exactly one thing: the
`Serviced %` label (`ui.js:494`). Sales themselves ignore it entirely.
See [[gap-automatic-selling]].

So the system has never been played. Any balance numbers in it
(`0.08 + sellers*0.055 + shops*0.16`, seller cost `45*1.45^n`, shop cost
`3200*1.6^n`) are untested guesses.

## What "balanced" has to mean here

Once selling actually routes through reach, the tension the PO is asking
for is:

- **Appetite** (demand, driven by price + word of mouth + sugar)
- **Capacity** (production, driven by spoons + works)
- **Reach** (how much appetite you can service, driven by hand-selling +
  sellers + shops)

Three curves, and the fun is that the binding constraint keeps changing.
The GPT thread states the target explicitly: not a static equilibrium but
*"production and demand should cross each other repeatedly over the
course of a run."* Reach is the third line that makes that crossing a
decision rather than a wait.

Balance pass must answer, with numbers:
- At what jar count does hand-selling stop being viable?
- What does the first seller cost as a share of income at that moment?
- Where does reach saturate (currently ~17 sellers to 100%), and does the
  player hit that before or after shops unlock at 4 sellers?
- Does word of mouth outrun reach, so that raising price is punished by
  an invisible ceiling?

## Fix

Blocked on [[gap-automatic-selling]]. Then a simulation pass — the
existing headless autoplay harness described in
`ai/source/claude_transcript.txt` is the right tool, but its results must
be confirmed in a browser this time ([[gap-act-ii-unverified]]).

## Status

Open.

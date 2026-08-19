---
title: 001 — Continue the existing build, do not restart
type: decision
status: accepted
updated: 2026-08-19
---

## Context

Three lineages exist: GPT's original conventional clicker (deleted), the
Claude Desktop rebuild now on `main`, and this session. The PO arrived
frustrated with the Desktop sessions ("started not following the
instructions correctly... burning usage limits stupidly fast") and asked
for a fresh start on process, not necessarily on code.

## Decision

Keep the current code. Fix, balance and extend it. No third rewrite.

## Rationale

The architecture is sound for what it is: a dependency-free static site
with a real demand economy, 56 recipes, three acts, full act transitions,
graceful-degrading saves and a complete FR layer. The defects found are
wiring and design-legibility defects, not structural ones — three dead
readouts, one uncalled function, forks with too little contrast. All
cheap relative to rebuilding 120KB of tuned content.

A rewrite would also discard the balance work that is genuinely there
(demand curve anchored to real jam prices, the anti-softlock fruit floor,
the Act III reseed floor) and reintroduce the dead ends that work
removed.

## Consequences

- The leaky engine/ui seam stays for now ([[architecture]]). It is
  documented rather than fixed; a move only happens if a change forces it.
- Global mutable `s` and in-place mutation remain the convention, against
  the global immutability style rule. Consistency inside the file beats
  a half-migrated codebase.
- Balance numbers in unplayed systems are treated as untested guesses,
  not as a baseline ([[gap-act-ii-unverified]]).

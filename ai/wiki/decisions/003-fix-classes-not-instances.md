---
title: 003 — Fix the class, verify in a browser
type: decision
status: accepted
updated: 2026-08-19
---

## Context

The three defects found in this session's read-through are all invisible
to a simulation harness and all belong to classes rather than being
one-offs:

- `set()` silently no-ops on an uncached id — three broken readouts.
- A function defined for a system and never called — `servicedPerSec`,
  and separately `swarmBoost`.
- Affordance and tooltip coverage guarded to `s.act===1`.

The previous lineage shipped Act II having verified it only in a headless
harness, and said so.

## Decision

1. Every fix addresses the class. A patch that fixes only the reported
   instance is not accepted — e.g. adding `'madeRate'` to the id array is
   not the fix; making `set()` incapable of failing silently is.
2. No behaviour is claimed done without being observed in a browser,
   including the refresh / reload / mid-act-save variants.
3. Multi-symptom feedback is tracked one gap page per symptom. A batch is
   not closed because one symptom is.

## Consequences

Slower per fix, and it means building a way to reach Acts II and III
quickly for testing. Cheaper than the rework loop it replaces.

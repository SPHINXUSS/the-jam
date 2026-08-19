---
title: PO rules — the enforcement checklist
type: reference
status: active
updated: 2026-08-19
---

# PO rules

Standing constraints from the product owner, gathered from
`ai/source/gpt_transcript.pdf` and the current feedback round. These are
not preferences. A change that violates one is a defect and does not ship.

Run this list before calling anything done.

| # | Rule | Check |
|---|---|---|
| 1 | No wrong choices, only trade-offs | Can any decision leave the player strictly worse off with no compensating upside? Any unwinnable state? |
| 2 | Relaxing first, depth optional | Would a casual player need a spreadsheet? Is the new system skippable without stalling? |
| 3 | "I want to feel smart" | Does this produce a decision the player can own and describe to someone else? |
| 4 | One sentence, always | Can the player say what is happening right now? Does `objective()` (`engine.js:396`) have a branch for this state? |
| 5 | Notification discipline | Recipes only. Never affordability of routine purchases. Never repeated for something walked past. |
| 6 | Bilingual, fully | Every new English string has a `DICT` entry, written as native French, in the same commit. |
| 7 | Never break the game | Root cause, not patch. Verified in a browser, not only in a harness. |
| 8 | Tone | Dry, understated, slightly absurd, occasionally unsettling. Never a joke for its own sake. |

## Working relationship

The PO is not a developer: *"I'm not really a developer tbh so I trust
you on this."* Speak in player terms — what changes on screen, what the
player feels, what it costs. Make the technical calls; surface only the
trade-offs that are genuinely product decisions.

Escalate before deciding: anything that changes the shape of a run, the
identity of a fork, permanence/loss of progress, or the visual identity.

## Known failure history (do not repeat)

- Partial translation shipped repeatedly. PO: *"still seeing some
  English... this is not like there are 100 files to go over dude."*
- A boot-marker regression broke the running game, producing rule 7.
- Balance over-corrections landed without being played (the tasting panel
  was made net-negative on every outcome, then reverted).
- Work claimed as done on the strength of a simulation harness
  ([[gap-act-ii-unverified]]).

Related: [[overview]], [[juice-and-legibility]]

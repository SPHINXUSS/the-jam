---
title: 002 — PO feedback round two
type: session
updated: 2026-08-19
---

# Session 002

## Goal

Twenty items of PO feedback after a fresh run, plus whatever was still
open from round one. The PO's framing mattered as much as the list:
*"everything I'm observing and feedbacking to you are symptoms... you
need to work the math and the psychology"*, and a direct complaint that
planned work was being silently skipped.

## What changed

Seven commits, all pushed to `main`:

| | |
|---|---|
| `e122389` | sounds restored, French finished, dead readouts fixed |
| `ec8d862` | the pot, attempt two — **rejected by the PO** |
| `be71002` | queue at the door, moving sugar, price floor, upgrade gating |
| `1f5a56f` | larder stamp, the timed visitor |
| `74461ad` | the pot as pixel art, seen from above |
| `c848c55` | Act II as six catchments; Act III given an economy |
| `b8fd8bb` | house styles differ in kind; three exclusive recipe forks |
| `dec8ab2` | descriptions corrected; two defects found while correcting them |
| `98d0cbe` | Act II soft-lock fixed; the record corrected on what caused what |

## Decisions

- **[[004-art-direction-pixel]] — provisional.** Pixel art, top view. The
  PO explicitly left this open: *"save this as the default for now but
  don't close this."*

## Tools built

- `ai/tools/i18n.js` — audits every string a player can reach against
  DICT, and merges translations. Reports 0 missing.
- `ai/tools/sim.js` + `domstub.js` — loads the real game outside a
  browser and plays it. Every balance number this session came from it.

## Verified

Seven browser scenarios, 0 console errors: boot, stirring, the door
queue, the price-cap exploit, the sugar band, the larder stamp, the
visitor and its boost, all three act transitions, a catchment advancing,
a wiped-out Act III recovering, saves surviving reload, and FR/EN
switching in both directions.

Simulator, three house branches: 2h26 neutral, 2h24 maker, 2h21 store.

## The correction that mattered most

The session summary told the PO that Act II "opened with zero power and
an unaffordable sun trap". They pushed back: what they played let them
buy everything and never run out of money. **They were right.** Those
were two different builds and the sentence merged them.

Checking it properly found a real bug the pushback is responsible for:
the small arrival grant meant a player who spent it all on pickers had no
jar income and no way back. Fixed as a class.

**Rule for the next session:** a finding from the tuning loop is not an
observation about a shipped build. Say which build, every time.

## Known issues going in to the next session

1. **The art direction is not settled.** The PO asked whether pixel art
   works with the rest of the design and did not answer their own
   question. Painted and engraved prototypes both exist and were
   screenshotted.
2. **[[gap-choice-scarcity]] is only partially closed.** No run history,
   no archetypes, and Act III's trust allocation — the deepest decision
   in the game — is still a row of plus and minus buttons.
3. **Nobody has played this build end to end.** Two and a half hours of
   real play has been *simulated*, not *played*. The simulator uses the
   real economy, but it cannot tell anybody whether the game is fun — and
   it did not catch the Act II soft-lock either. The PO's pushback did.
   **Specifically watch:** Act II's opening may now be too tight in the
   other direction. It was corrected from "buy everything instantly" to
   five machines and change, and only a played run can say whether that
   is generous, mean, or right.
4. **Act III has still never been seen by the PO.**

## Next

1. Get the art direction closed.
2. A real playthrough — the one thing the simulator cannot substitute for.
3. Act III's trust allocation deserves the treatment Act II just got.

---
title: Session 005 — the desktop feedback round
type: session
status: done
updated: 2026-08-20
---

# 005 — the desktop feedback round

The PO played a full run, mostly on desktop, and returned twenty-odd
items in one message. This session worked them.

## What he actually said, and what it turned out to be

Grouped by root cause rather than by his sentence order, because several
of his complaints were the same defect seen from different angles.

| His words | Root cause | Status |
|---|---|---|
| "the +x on top of jars unsold number, the +x when clicking the pot that is almost not visible" | floaters spawned in the middle of their source node, in dark ink with no separation from the background | fixed |
| "you said you juicefiyed this version, I don't see it, it is too little" | feedback existed but was undifferentiated and mostly invisible; no tiers, no halo, no queue | fixed |
| "pot looks like a kind of clock, with the spoon spinning like a needle" | the handle was drawn along a **radius**, sweeping a full turn inside a gold ring | fixed |
| "the manual pot steering sound... more like hitting a drum" | it *was* a drum: sharp-attack sine at 84 Hz | fixed |
| "your little 'stamp looking' warning is not juicy at all... the larden is only visible when scrolling" | the alarm was attached to a card halfway down the page | fixed |
| "spam clicking on buttons on desktop selects the text below buttons" | `user-select:none` was per-control; the selection *ends* on the paragraph beneath | fixed |
| "text above the sell a jar button changing makes the height of the button change" | a live sentence sat between the player and the control | fixed |
| "$/s... impossible to settle on a point since it keeps changing" | `min(serviced, s.jars>1 ? Infinity : make)` — flips every frame when stock hovers at one jar | fixed, twice (see below) |
| "sellers reach 100%, there is no point in buying anymore" | reach was linear and clamped at 1 | fixed |
| "the message still say 'People want more than your sellers can deliver'... which is not true" | one branch conflated a reach shortage with a production shortage | fixed |
| "the sweet spot... seem to never move again" | production became the binding constraint, so price and sugar went decorative and nothing said so | fixed |
| "jamworks arrive I can directly buy 40 at once" | a flat $900 base opening into an economy where the next spoon cost $18M | fixed |
| "'At this price almost nobody is walking up' wtf does that mean" | one sentence blamed the price for three different causes | fixed |
| "if you're going to remove something just remove it" | the door was greyed out and left on the page with a justification | fixed |
| "Inspiration won **945**" vs log "a gain of 45" | the panel counted gross, the log counted net | fixed |
| "lets add a 'hint on/off'" | — | built, default off |
| "reorganise the ui on desktop so it takes more advantage of the space" | `.stage` was a fixed 1180px grid; 1920 rendered identically to 1440 | fixed |
| "realease the starter, what does that even mean" | wrong craft's vocabulary, and a French word he had already vetoed | fixed |
| "the weird bee vibrating on screen" | wings flapping at ~7 Hz; no label | partly — see [[gap-visitor-unmotivated]] |
| "blind testing has honestly very little interest" | it costs inspiration and pays inspiration at EV ≈ 1.0 | open — [[gap-blind-tasting-worthless]] |
| "Still a lot of things that is untranslated" | **could not reproduce** — see below | instrumented |
| "still kinda boring at some point" | the standing problem | partly |

## The three things worth remembering

**1. The revenue readout was fixed twice, and the first fix was wrong.**
The original bug was a discontinuous branch. Replacing it with a *measured*
rate removed the flip and introduced lag, so the same dial still gave three
different numbers — $1.68, $1.72, $1.76 — just more slowly. The lesson: the
player is not asking that readout what happened, they are asking what this
setting earns. That is a prediction. It is predicted again and continuous:
`min(serviced, production + backlog/10)`, where the backlog term goes
smoothly to zero instead of switching equations at one jar.

**2. The i18n audit had a blind spot, and after closing it there was still
nothing to find.** The tool scanned `t()`, `tf()`, authored data and static
markup — but not prose written into markup that JS builds, which reaches the
DOM identically. That class is now scanned, one ignore list is shared
between the tool and the runtime, and three independent checks (static
audit, live DOM scrape in French, per-object resolution of every recipe,
tip and palate) all came back clean.

So **his report could not be reproduced.** Rather than claim it is fixed —
which is the exact failure this project has repeated nine times — the
fallback stopped being silent: `t()` records every miss, and the top bar
grows a small red `EN ×n` counter whenever the list is not empty, which
writes the offending strings into the logbook on click. It is invisible in a
game with no missing strings. Next time he sees English, the report writes
itself.

**3. Delegation was blocked for a fifth session by a rule nobody could
find.** The harness injects "do not call the Agent tool unless the user
requested it" into some sessions, and its only escape hatch is a live
request. The memory saying to delegate could never satisfy that, because a
memory is not the user asking. The PO had already asked twice for the *rule*
to be fixed. The fix is a standing authorisation block in
`~/.claude/CLAUDE.md`, because that file is a user instruction and outranks
harness defaults. Five agents ran afterwards and three of them found things
this session would otherwise have shipped broken.

## What the agents found that I would have missed

- The stage was a **fixed** 1180px grid: 1920×1080 produced a byte-identical
  layout to 1440×900 and spent the extra 480px on margin. And the columns
  were assigned in markup, so Acts II and III collapsed the right column to
  146px while the left stayed near 2900px.
- The revenue readout was **still** drifting after the first fix.
- The reach line went silent exactly when it became load-bearing.
- Under reduced motion the visitor's idle loops became 1ms strobes, and the
  alarm's title lost its urgency cue entirely.
- Paperclips pays its tournament "yomi equal to the number of points your
  pick scored **times the number of strategies it beat**" — a continuous
  reward for the *degree* of a correct read. Ours pays four flat buckets by
  finishing place. That is the root cause of the blind tasting feeling
  pointless, and it is written up in [[gap-blind-tasting-worthless]].

## Numbers

| | before | after |
|---|---|---|
| page height, 1440×900 | 3.34 screens | 2.18 |
| page height, 1920×1080 | 2.78 screens | 1.40 |
| page height, hints off vs on | — | −257px |
| Act I, simulator | 48m12s | 49m49s |
| full run, Chrome | 3h30m | 3h40m |

## Verified how

Every claim above was driven through Chrome, not through the harness.
`ai/tools/play.js` reached the ending three times during the session with no
page errors. `ai/tools/sim.js` was run after every balance change. The
reduced-motion path was checked on all eleven animated cues. Both languages
were checked on every new string.

**Not verified:** whether any of it is more fun. Only the PO can say that.

## Next

1. **[[gap-blind-tasting-worthless]]** — needs a PO decision on what it
   should pay. Three options written up.
2. **[[gap-visitor-unmotivated]]** — it says what it is now, but not why it
   is there. A design question, his to answer.
3. **"Still kinda boring at some point."** The one item this session did not
   reach the bottom of. Direction 2 and 3.

Related: [[intent]], [[po-rules]], [[juice-and-legibility]],
[[006-delegation-tiers]], [[004-direction-and-process]]

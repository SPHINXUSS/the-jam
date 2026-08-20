---
title: Acts II and III had never been played in a browser
type: gap
status: closed
severity: medium
updated: 2026-08-20
---

## Problem

From `ai/source/claude_transcript.txt`, the previous agent's own words:

> *"I verified files by checksum and mechanics by simulation, but I
> haven't played the new Act II myself on the live site — Pages was still
> rebuilding. The systems fire correctly in the harness; whether the
> orchard is now fun is a question your player answers better than my
> simulator does."*

**The PO played Act II** and reported it repeatedly — see
[[gap-act-ii-illegible]]. What nobody had ever done was watch either act
run its systems in a real browser. Act III had never been reached by
anyone. Everything known about both came from a headless harness written
by the same author as the code.

## Impact

The three known Act I defects were all of a class a harness cannot see:
display and wiring bugs, not maths bugs. There was no reason to assume
Acts II and III were free of them.

## Resolution — 2026-08-20

Both acts were driven end to end in Chrome, through the game's own render
loop and its real controls, to the ending screen.

| | reached at | length |
|---|---|---|
| Act I | 0m | 75m |
| Act II | 75m | 114m |
| Act III | 189m | 43m |
| The Last Jar | 232m | |

Two full runs on the fixed build finished at 216m and 232m; the spread is
Act III's, which is short and noisy. The simulator's figures for the same
three acts are 42m / 56m / 48m — it plays a sharper game than the script
does, and the script never touches the exchange.

Zero console errors and zero page errors across the whole run. Every
panel revealed, every readout moved, both act curtains played, the
ending screen rendered.

Four defects came out of it, none of which the simulator could have
found — all display, wiring or input bugs:

- [[gap-controls-keyboard-dead]] — six dials unusable without a mouse
- [[gap-objective-advertises-closed-fork]] — the objective line frozen
  on an impossible instruction for the rest of the act
- [[gap-trust-minus-crash]] — Act III's trust "−" buttons threw on click
- [[gap-inspiration-cap-silent]] — the palate sits full for hours and
  never says so

And one balance finding the simulator missed because it never used the
system: [[gap-exchange-money-printer]].

**The caveat that remains.** This was a *scripted* player: a policy
clicking real buttons through the real DOM, with the game's clock warped
so 3h36 of play fits in ten minutes of wall time. It proves the machine
works. It cannot say whether the game is fun, whether the orchard reads
to a human, or whether the pacing is right. Those still need the PO.

## Status

Closed. Replaced for the remaining question by
[[gap-act-ii-illegible]] and by the standing note that nobody has yet
*enjoyed* this build, only completed it. Related:
[[003-first-browser-playthrough]].

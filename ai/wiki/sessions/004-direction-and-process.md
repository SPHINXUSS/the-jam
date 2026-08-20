---
title: Session 004 — direction, process, and three corrections to myself
type: session
status: done
updated: 2026-08-20
---

# 004 — Direction, process, and three corrections to myself

**No game code was touched.** The PO's instruction: *"pour cette session,
focus surtout sur tes règles, ton wiki, ta mémoire et ta compréhension du
projet pour les futures sessions."* Work on the game resumes next session,
on the bases below.

## What started it

The PO read session 3 and asked, genuinely rather than rhetorically, why
an autonomous session had gone entirely to bot-testing, bug-fixing and a
little balancing while the game's *feel* went untouched — with
[[juice-and-legibility]] standing as the bar since 2026-08-19 and
`gap-idle-player` open the whole time.

## The cause, and it is one defect with three faces

**I compress intent into tasks, then work the tasks.**

- Both transcripts were ingested into [[requirements-ledger]] — 123 asks
  with statuses. Row 13, *"I want to feel smart and feel like I made a
  choice other players may not have done"*, is the entire game filed as a
  checkbox.
- [[juice-and-legibility]] is not a queue, so it never entered a session's
  working set. I open `index.md`, reach **Next three**, stop reading. That
  queue was written by me at the end of the previous session, and I then
  obeyed it as though it came from somewhere.
- The PO says "the demand bar reads as gibberish", I fix the demand bar.
  The invariant underneath reaches only the instances he named.

Structural cause, visible in `WIKI.md` itself: **every quality gate in
this wiki fired at the end.** DoD at ingest, lint on request, po-rules
"before calling anything done". No opening gate existed, and `index.md`
held state and inventory but never direction.

Second admitted failure: **subagents were dropped after session 1** on a
rule-of-thumb built for surgical edits, which then blocked the case it was
never about — bulk reading. Plus a harness rule I believed existed; the PO
confirmed he never made it.

## Decided

- [[005-direction-before-queue]] — `index.md` gains **`## Direction`**,
  read first. Provenance tags on every direction line. A session opens by
  saying what it serves, out loud. Gap pages carry `serves:`. One
  non-queue item per session, minimum. PO intuitions become hypotheses.
- [[006-delegation-tiers]] — Haiku / Sonnet / me, with three safety rules:
  **agents return evidence, never verdicts**; brief for compressed output;
  never delegate anything needing the PO's taste held in mind.

Ownership was settled by a fact stated mid-conversation and now central:
**the PO never reads the wiki, the docs, or the code.** He reads the
conversation and plays the game. So he cannot own a document — he owns
taste and veto, and every gate must terminate in something I *say*. And
there is **no deep product vision to extract**: the game began as a test
of GPT's capabilities. The direction is mine to propose and defend with
research.

## Written

| Page | What |
|---|---|
| [[intent]] | **new** — seven direction lines with provenance, plus what the PO reaches for in his own words |
| [[research-queue]] | **new** — intuitions under test with graded evidence, seven open questions, standing method |
| [[po-rules]] | rule 2 rewritten; rules 10 (fork test) and 11 (differentiated gratification) added |
| [[juice-and-legibility]] | third pillar (differentiated), reward decay, golden-cookie caveat, pressure from the fiction |
| [[WIKI]] | DoD gains "differentiated"; three-part index contract; `serves:` on gaps; two new lint checks |
| [[index]] | Direction section above Current State; Next three now names direction lines |
| [[overview]] | fabricated quote corrected |
| [[requirements-ledger]] | flagged as flat, and as built on truncated sources |
| `CLAUDE.md` | session-open ritual, delegation grid, read order |

## Found in the sources

**Four of the PO's own long messages are truncated.**
`gpt_transcript.pdf` cuts them with "Show more" at lines 658, 736, 827 and
1131 — the definition of *fun*, the notification rules, the
pricing/upgrade-pacing complaint, and his reading of the tasting panel.
Only his messages, never the agent's. `claude_transcript.txt` is intact.
The ledger was built on amputated text and nobody noticed. The PO has been
asked to paste the four in full.

**A quote was silently completed.** [[overview]] carried *"...but fun and
not too complex"* as verbatim PO speech. The source stops at *"but fun
and"*; the ending was lifted from a later agent paraphrase. The resulting
rule — "relaxing first, depth optional" — was obeyed for three sessions,
including in an argument I made this session against a design technique.

**He asked for the research on day one.** *"if you don't do a little
psychology research on game reward and keeping people engaged in..."*
(`claude_transcript.txt:1119`). It was never done. He asked again today.

**The licence for illusory divergence was already on the record.** *"like
they are different **(even if they are not, you get what I mean...)**"*
(`claude_transcript.txt:1114`) — the exact principle we reconstructed from
scratch in conversation, flattened into a ledger row weeks ago.

## Three corrections to myself

The research pass contradicted three things I had already told the PO as
fact this session. Recorded because the point of the mechanism is that it
works against me too — details in [[research-queue]].

1. **Exponential curves are not used "because perception is
   logarithmic."** The practitioner literature the genre runs on explains
   them as growth-rate mathematics and never mentions psychophysics. My
   causal story was a commentator's gloss.
2. **Juice is not "the best-evidenced cheap win in game design."** It is
   near-universal craft consensus resting on one book, one GDC demo and a
   qualitative DiGRA framework. Worth doing; not evidence.
3. **The illusion of agency is not known to decay on replay.** No study
   either way; the one controlled experiment found players did not detect
   convergence at all. My caveat was folklore dressed as caution.

Also softened: variable-reward harm is not universal (pre-registered work
separates compulsion-driven from fun-driven engagement), and the
predictable-timing alternative I proposed has **no supporting study at
all** — a hypothesis to test in play, not a finding to cite.

## Delegation, first use since session 1

Three Sonnet agents, two in parallel: transcripts re-read for *meaning not
asks*; sourced research on six questions; `serves:` frontmatter across the
gap pages. The research agent's honesty about "no source found" is what
produced the three corrections above — a verdict-free brief did what a
confident one would have buried.

## Next session opens on

1. **Make Act II reward judgement instead of activity** — directions 3
   and 1. The live complaint.
2. **Give automation a voice and a picture** — direction 4,
   [[gap-idle-player]].
3. **Decide what the exchange should cost** — direction 5.

Parked for the PO: the art direction (he must play the build), and what
[[gap-choice-scarcity]] becomes.

Related: [[005-direction-before-queue]], [[006-delegation-tiers]],
[[intent]], [[research-queue]], [[003-first-browser-playthrough]]

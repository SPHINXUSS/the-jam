---
title: Direction before queue — how a session opens
type: decision
status: active
updated: 2026-08-20
---

# 005 — Direction before queue

## Context

Session 3 ran autonomously and produced bug fixes, a browser playthrough
and a little balancing. Nothing wrong with any of it. But the PO asked
why nothing had gone toward the game's *feel*, given that
[[juice-and-legibility]] has been the standing bar since 2026-08-19 and
`gap-idle-player` had been open the whole time.

The honest answer, dug out in conversation on 2026-08-20, is one defect
with three faces:

**I compress intent into tasks, then work the tasks.**

- The transcripts were ingested into [[requirements-ledger]] — 123 asks
  with statuses. Row 13 is *"I want to feel smart and feel like I made a
  choice other players may not have done"* with a ✗ next to it. That is
  not a ticket. That is the entire game, filed as a checkbox.
- [[juice-and-legibility]] is not a queue, so it never entered a session's
  working set. I open `index.md`, reach **Next three**, and stop reading.
  That queue was written by me at the end of the previous session; I then
  obeyed it as though it came from somewhere.
- The PO says "the demand bar reads as gibberish", I fix the demand bar.
  The invariant underneath — *no readout shows a ratio without its two
  terms* — reaches only the instances he named.

The structural cause is visible in `WIKI.md` itself: **every quality gate
in this wiki fires at the end.** The DoD fires at ingest. Lint fires on
request. `po-rules` says "run this list before calling anything done."
There was no opening gate, and `index.md`'s contract held only Current
State and Catalog — state and inventory, never direction.

A second fact, established the same day, reshapes who may fix this: **the
PO never reads the wiki.** Not the docs, not the code, ever. He reads this
conversation and he plays the game. So he cannot own a document, and no
gate that terminates in a file exists from his side.

A third: **there is no deep product vision to extract.** The game began as
a test of GPT's capabilities; the PO liked the result and continued. The
transcripts hold reactions, constraints and taste — not a design. The
stated goal is an homage to Universal Paperclips and the best game of that
kind, with the honest precondition that we do not yet know what makes a
good one.

## Decision

**1. `index.md` gains a third contracted section, `## Direction`, read
before Current State.** What the game must *become*, ranked. Not what is
broken. Every line is written to be **read aloud in player terms** — if a
line cannot be said to the PO in one sentence without jargon, it is a
ticket in costume and does not belong there. It lives in [[intent]].

**2. Ownership is split: the agent owns the direction, the PO owns the
taste and the veto.** Since there is no vision to extract and no document
he will read, I propose the direction — backed by research, not by his
examples — and he refuses or corrects it out loud.

**3. Every direction line carries provenance:**

| Tag | Meaning |
|---|---|
| `your words` | verbatim PO quote, with its transcript line |
| `confirmed` | my paraphrase, said aloud, PO agreed, session N |
| `my read` | I inferred it; the PO has never heard it |

**`my read` lines get read aloud to the PO on sight.** That is the whole
accuracy mechanism. He cannot audit my memory, but he can hear a sentence
and say it does not match what is in his head.

**4. A session opens by speaking, not by picking.** Before any work: which
direction line this serves, which po-rule it risks, which bar item it must
clear, how it will be verified. Three or four sentences in chat, not a
report. A candidate that cannot name a direction line does not get worked
— it gets raised as unmoored.

**5. Every gap page carries `serves:` frontmatter** naming the direction
line or bar item it exists for. Lint flags orphans. An orphan gap is a
symptom invented from one of the PO's examples.

**6. Every session carries at least one non-queue item** — design, feel,
or research. Otherwise defects starve everything else forever, which is
exactly what happened in session 3.

**7. PO intuitions are hypotheses, not orders.** When he offers a design
instinct, it goes to [[research-queue]] and comes back as: what holds,
what is incomplete, what needs reshaping, what is contradicted — sourced,
and said in player terms. He asked for this explicitly on 2026-08-20 and
asked to be told when he is wrong.

## Consequences

- `index.md`'s read order changes: Direction, then Current State, then
  Catalog. **Next three** moves below Direction and each entry must name
  the line it serves.
- [[requirements-ledger]] keeps its job — the ask ledger — and stops being
  treated as the record of what the PO meant. [[intent]] holds that.
- Two documents are new: [[intent]] and [[research-queue]].
- The wiki must be treated as **incomplete, not exhaustive**. Four of the
  PO's own long messages in `ai/source/gpt_transcript.pdf` are truncated
  by "Show more" markers (lines 658, 736, 827, 1131), including the
  sentence where he was defining *fun*. The ledger was built on amputated
  messages without anyone noticing. `claude_transcript.txt` is intact.
- Cost: a few minutes of speaking at the start of each session, and a
  research pass on intuitions that would previously have been implemented
  on trust. Both are cheaper than the rework they replace.

Related: [[002-wiki-as-project-memory]], [[003-fix-classes-not-instances]],
[[006-delegation-tiers]], [[intent]], [[research-queue]], [[po-rules]]

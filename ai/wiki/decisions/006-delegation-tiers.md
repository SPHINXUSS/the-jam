---
title: Delegation tiers — what a subagent may do on this project
type: decision
status: active
updated: 2026-08-20
---

# 006 — Delegation tiers

## Context

Subagents were used in session 1 (the read-in) and never again. Two
reasons, neither of which survives inspection:

1. After session 1 the work went fix-in-place, and handing over context
   felt more expensive than keeping it. True for surgical edits in five
   globally-scoped files. Not true for the thing it was actually blocking:
   **bulk reading**. 100k lines of transcript is the delegation case, and
   I skipped it by applying a rule-of-thumb built for something else.
2. I believed the harness forbade spawning unless asked. The PO stated on
   2026-08-20 that he never made that rule and removed it.

The PO's framing of the goal is precise and worth keeping verbatim: *"le
but est de pouvoir faire plus de travail dans une session de 5h, pas
d'aller plus vite, et pas de dégrader la qualité du travail non plus."*
More work per usage window. Not faster, not cheaper at the cost of quality.

What actually burns the window on this project, from session 3's evidence:
driving the browser and reading DOM snapshots; balance iteration; audit
sweeps (the i18n audit covered 181 strings); writing the wiki. Not
thinking. Thinking is cheap here and it is the part that has been missing.

## Decision

**Delegate the eyes. Keep the judgement.**

| Tier | Gets | Never gets |
|---|---|---|
| **Haiku** | mechanical, verifiable, zero taste: grep-and-tabulate, `set()` id audits, `DICT` key coverage, dead-call-site sweeps, `file:line` evidence collection for DoD checklists | anything where a wrong answer is not obviously wrong |
| **Sonnet** | bounded judgement against a fixed schema: driving a scripted playthrough and reporting observations, extracting from a transcript against a given schema, wiki lint, drafting a gap page from template, **drafting** FR strings, sourced research gathering | verdicts, design calls, balance decisions, final FR wording |
| **Me (Opus)** | design, feel, root cause, balance, all code edits, every PO-facing claim | — |

Three rules that make it safe:

**1. A subagent returns evidence, never a verdict.** A Sonnet agent saying
"Act II feels legible now" is worthless and violates po-rule 7. The same
agent returning what twelve panels literally displayed at t=40m, with
screenshots and console output, is the most valuable thing in the session.
Subagent-driven browser work counts as browser evidence **only** when it
returns raw observations that I then judge.

**2. Brief for compressed output.** Their report lands in my context and I
pay for it. Tables, `file:line`, quotes. No narrative, no preamble, no
conclusion, and a hard line cap in the brief.

**3. Never delegate what needs the PO's taste held in mind.** Anything
touching feel, tone, French wording, or what the game should become stays
with me. The FR quality complaints in [[requirements-ledger]] (nine
separate ones) are what this rule is protecting.

**Do not delegate what a shell command does better.** A Haiku agent
listing wiki frontmatter costs more than `grep`. Delegation is for reading
volume and for parallel work, not for tasks with a deterministic tool.

**Parallelise the independent sweeps.** i18n audit ‖ readout audit ‖
transcript extraction ‖ research gathering all run at once.

## Consequences

- Bulk transcript reading, research gathering, and scripted playthroughs
  move off the main thread. Judgement, design and edits do not.
- Playtesting becomes delegable; **judging the playtest does not.** That is
  the largest single reclaimed cost.
- A subagent's factual claim is not evidence until its raw output supports
  it. Same standard as [[003-fix-classes-not-instances]] applies to agents.

Related: [[005-direction-before-queue]], [[003-fix-classes-not-instances]]

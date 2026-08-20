---
title: The Jam — Project Overview
type: overview
status: active
updated: 2026-08-19
---

# The Jam / La Confiture

A browser incremental game about a small preserving business that does not
know when to stop. Static site, no build step, no dependencies — open
`index.html` and it runs. Deployed via GitHub Pages from
`github.com/SPHINXUSS/the-jam` (branch `main`).

## Who does what

- **PO / vision driver**: Simulasis. Not a developer. Decides product
  behaviour, feel, and balance direction. Speaks in player terms.
- **Agent**: developer + project manager + doc maintainer. Makes technical
  decisions, flags trade-offs, keeps this wiki current.

## The brief

Commissioned as *"the paperclip game but more beautiful and called the
jam... as fun as the original one"*. The structural debt to **Universal
Paperclips** is deliberate: near-empty opening screen, one verb, a real
price/demand economy, a second currency spent on one-time projects, and
**two genre changes** that arrive without warning.

The escalation is conceptual, not just numeric:

| Act | Player question | Player learns |
|---|---|---|
| I — The Kitchen | "Can I run a good business?" | I can predict customers |
| II — The Orchard | "Can I build a better system?" | I can specialise |
| III — The Spread | "What have I created?" | Optimisation has consequences |

Full run target ~50-60 minutes (Act I 35, II 12, III 6).

## Standing PO rules

These are constraints, not preferences. Violating one is a defect.

1. **No wrong choices, only trade-offs.** *"there is no 'wrong' there is
   just tradeoffs... deal with it like in the real world."* No unwinnable
   states, no "you picked wrong, restart".
2. **Fun first — engaged, never bored.** The source quote
   (`gpt_transcript.pdf:656`) is **truncated mid-sentence**: *"this must
   remain a relaxing fun game (that some player can try hard still, but
   fun and…"*. An earlier version of this page completed it as *"not too
   complex"* — that half was never said here; it was lifted from a later
   agent paraphrase and presented as verbatim. Corrected 2026-08-20 with
   the PO's own restatement: a game where you watch numbers rise without
   acting is not relaxing, it is boring. Light pressure is healthy if it
   is visible coming, actionable and survivable. Full text in
   [[po-rules]] rule 2.
3. **"I want to feel smart and feel like I made a choice other players may
   not have done."** The foundational mandate. Every system should produce
   a decision the player can own.
4. **One sentence, always.** A player must be able to say what is happening
   right now, at any point in the game, without understanding every formula.
5. **Notification discipline.** Recipes only — new recipe available, first
   time affordable. Never "you can afford an autospoon". Never repeated.
6. **Bilingual, fully.** EN/FR switchable at any time, never resets the run,
   remembers the choice, FR defaults for FR browsers. Translations must read
   as native French, not word-for-word. Partial translation is a defect.
7. **Never break the game.** *"don't ever break the game again... only clean
   code is accepted, no patchwork from now on."* Root causes, not patches.
8. **Tone**: dry -> understated -> slightly absurd -> occasionally unsettling.
   Not "let's add a French joke here". Watch the funny/cringe line.

See [[po-rules]] for the enforcement checklist and [[juice-and-legibility]]
for the feel bar every mechanic must clear.

## Where things stand

Act I plays and has a genuine economy. Act II and III are simulated and
reachable. The current problem is **not** missing systems — it is that
several shipped systems are illegible, unfelt, or wired wrong. See
`index.md` Current State and the open gap ledger.

## Files

Five files, load order matters (`index.html:310-313`):
`i18n.js` -> `feel.js` -> `engine.js` -> `ui.js`. See [[architecture]].

## Primary sources

- `ai/source/gpt_transcript.pdf` — 64pp PO/ChatGPT design thread. The
  richest record of intent, tone rules, and balance reasoning.
- `ai/source/claude_transcript.txt` — PO/Claude Desktop build thread.
  Records the rebuild rationale and what was claimed shipped.

Both are frozen. Quote them; never edit them.

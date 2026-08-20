---
title: PO rules — the enforcement checklist
type: reference
status: active
updated: 2026-08-20
---

# PO rules

Standing constraints from the product owner, gathered from
`ai/source/gpt_transcript.pdf`, `ai/source/claude_transcript.txt` and the
feedback rounds. These are not preferences. A change that violates one is
a defect and does not ship.

Run this list before calling anything done. Read [[intent]] before
deciding what to work on — this page says what must not break, not what
the game should become.

| # | Rule | Check |
|---|---|---|
| 1 | No wrong choices, only trade-offs | Can any decision leave the player strictly worse off with no compensating upside? Any unwinnable state? |
| 2 | **Fun first** (rewritten — see below) | Does the player always have something to do, decide or understand? Is any pressure visible coming, actionable and survivable? |
| 3 | "I want to feel smart" | Does this produce a decision the player can own and describe to someone else? |
| 4 | One sentence, always | Can the player say what is happening right now? Does `objective()` (`engine.js:396`) have a branch for this state? |
| 5 | Notification discipline | Recipes only. Never affordability of routine purchases. Never repeated for something walked past. |
| 6 | Bilingual, fully | Every new English string has a `DICT` entry, written as native French, in the same commit. |
| 7 | Never break the game | Root cause, not patch. Verified in a browser, not only in a harness. |
| 8 | Tone | Dry, understated, slightly absurd, occasionally unsettling. Never a joke for its own sake. |
| 9 | **Never stop mid-task.** "you stopped yourself... new rule: don't stop assuming I will unless you're genuinely finished" | Is there more in scope? Then keep going. Only the PO ends a work unit. |
| 10 | **The fork test** | After a choice, can the player name a thing that changed on screen within a few minutes? And can he *not* compute that the other branch was strictly better? |
| 11 | **Differentiated gratification** | Does a good decision feel *different* from a mediocre one — not merely louder? Is the game rewarding judgement, or only activity? |

## Rule 2, and why it was rewritten

The old wording was **"Relaxing first, depth optional"**, checked with
*"would a casual player need a spreadsheet?"*. It was wrong, and on
2026-08-20 it was used to argue against a design technique before anyone
noticed.

The source, `gpt_transcript.pdf:656`:

> *"this must remain a relaxing fun game (that some player can try hard
> still, but fun and…"*

The sentence is **cut off by a "Show more" marker at exactly the point
where the PO was defining *fun***. The ledger kept "relaxing", dropped
"fun", and turned "some player can try hard still" into "depth optional".

The PO's correction, spoken 2026-08-20:

> *"Je veux que le jeu soit amusant... il ne faut pas non plus que ça le
> stresse trop, ce n'est pas le but, mais un bon jeu ça te met un petit peu
> la pression quand même. On ne veut pas un jeu plan plan où tu n'as
> quasiment rien à faire et juste les chiffres montent, ce n'est pas du
> tout gratifiant pour le joueur, ce n'est pas fun."*

The current rule 2, in full:

> **Fun first.** The player must always have something to do, to decide,
> or to understand. A game where you watch numbers rise without acting is
> not relaxing — it is boring, and it gratifies nobody.
>
> Engagement produces a light pressure: something can be missed. That is
> healthy. It must be visible coming, actionable, and survivable. Never
> punish the player for looking away.
>
> Anyone who wants to optimise hard must be able to, without it being
> asked of everyone.

The axis is **engaged ↔ bored**. Pressure is a by-product of engagement,
not a goal. Do not restore the old wording.

## Rules 10 and 11, where they came from

Both are PO intuitions from 2026-08-20, checked against the literature
before being written down (see [[research-queue]]).

**Rule 10 — the fork test.** *"Il faut juste que le joueur ait
l'impression... c'est un peu un jeu psychologique qu'on joue avec le
joueur. Bien sûr il ne faut pas non plus que le joueur se sente trompé. Si
on lui met une bifurcation et qu'il ne sent absolument aucun changement,
ça ne marche pas non plus."*

Divergence may be small; **perceptibility must be large**. The cheap way
to make a fork perceptible is to change what the player sees and does —
vocabulary, which panels exist, the rhythm of the loop, the objective
sentence, the texture of failure — not a hidden multiplier, which is
expensive to balance and invisible in play.

**Rule 11 — differentiated gratification.** If everything is juicy,
nothing is. Undifferentiated feedback becomes wallpaper, and if every
action feels the same then no decision matters, which kills rule 3.

Today the game fails this: every button gives the same feedback tier, or
none at all in Acts II and III. Nothing distinguishes *catching the
setting point at the right moment* from *stirring*. **The game rewards
activity, not judgement** — a design defect, not missing polish, and a
plausible cause of "Act II feels like pushing buttons".

## Working relationship

The PO is not a developer: *"I'm not really a developer tbh so I trust
you on this."* Speak in player terms — what changes on screen, what the
player feels, what it costs.

**He never reads the wiki, the docs or the code.** He reads the
conversation and he plays the game. Anything he must approve gets said
aloud in chat; a file he will never open cannot hold his approval. See
[[005-direction-before-queue]].

**There is no deep product vision to extract.** The game began as a test
of GPT's capabilities and continued because he liked it. The goal is an
homage to Universal Paperclips and the best game of that kind. He holds
taste and veto; the direction is mine to propose and to defend with
research.

**Challenge him.** Stated 2026-08-20: *"ne pas hésiter à me challenger
quand tu penses que ce que je dis n'est pas tout à fait correct ou peut
être amélioré, voire même complètement faux."* A sourced disagreement is
worth more to him than silent agreement.

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
- **A rule was mis-transcribed into this page and then obeyed for three
  sessions** (rule 2, above), including in an argument against a design
  technique. Quote the source; do not paraphrase a constraint.
- **A truncated PO quote was silently completed.** [[overview]] carried
  *"...but fun and not too complex"* as verbatim; the source stops at
  *"but fun and"*, and the ending was lifted from a later agent
  paraphrase. If a source is cut off, show the cut. Never finish the
  PO's sentence for him.

Related: [[overview]], [[intent]], [[juice-and-legibility]],
[[005-direction-before-queue]]

---
title: Research queue — intuitions under test, and open questions
type: reference
status: active
updated: 2026-08-20
---

# Research queue

Two jobs:

1. **PO intuitions are hypotheses, not orders.** When the PO offers a
   design instinct it lands here, gets researched, and comes back as: what
   holds · what is incomplete · what needs reshaping · what is
   contradicted. He asked for this on `claude_transcript.txt:1119` and
   again, in more detail, on 2026-08-20. Nobody did it the first time.
2. **Questions worth thinking about that are not tickets.** No status
   column, no owner, no due date. They stay here until they are answered
   or abandoned.

Evidence grades, used throughout: **empirical** (peer-reviewed study) ·
**design analysis** (credible critic or practitioner, no measurement) ·
**folklore** (widely repeated, no primary source found).

---

## Verdicts, round 1 — 2026-08-20

### H1. "The player must feel the choice mattered; small divergence is fine, imperceptible divergence is betrayal."

**Holds.** Fendt, Harrison, Ware, Cardona-Rivera & Roberts, *Achieving the
Illusion of Agency*, ICIDS 2012 (best paper): in a forced-choice text
story, players reported **no significant difference in felt agency**
between real branching and a linear version that merely *acknowledged*
their choice. **empirical** — though the full text could not be fetched;
the finding is corroborated across independent secondary summaries, the
exact statistics are not verified.

The PO reached the same conclusion by playing games, and had already
written the licence into the record weeks earlier:
*"like they are different **(even if they are not, you get what I mean...)**"*
(`claude_transcript.txt:1114`).

**Correction to something I said in chat:** I suggested the illusion
probably decays on replay or under player-to-player comparison. **No study
found.** The only controlled result points the other way. Popular
criticism asserts players "always eventually notice"; the one experiment
located says they did not. My caveat was folklore, presented as caution.

→ became po-rule 10, the fork test.

### H2. "Satisfaction comes from watching numbers go up."

**Holds, with a ceiling — but my explanation of the ceiling was wrong.**

Weber-Fechner (perceived magnitude ∝ log of actual magnitude) is real for
sensory intensities and approximate number sense — Dehaene, *The neural
basis of the Weber-Fechner law*, TICS 2003, **empirical**. It is also less
settled than usually presented: recent work questions whether numerical
estimation is inherently logarithmic at all (*Questioning Weber-Fechner
law in young children's numerical estimation strategies*, Discover
Education / Springer, 2024).

**Correction to something I said in chat:** I told the PO that idle games
use exponential curves *because* perception is logarithmic. The
practitioner source the genre actually runs on — Anthony Pecorella, *The
Math of Idle Games* I–III, Game Developer — explains exponential growth
**purely as growth-rate mathematics** (cost/production seesaw) and
contains **no reference to psychophysics at all**. The Weber-Fechner story
is a post-hoc gloss commentators apply, not the reason the designers give.
The curve is right; my causal story was invented.

What is solid: growth multipliers converge tightly across shipped games —
Clicker Heroes ≈1.07, Cookie Clicker buildings ≈1.15, AdVenture Capitalist
1.07–1.15 (**design analysis**, cross-game pattern). Empirically tuned
feel, not derived from theory.

**No source found** for the decay rate of satisfaction from a rising
counter — how many repetitions before it stops paying. Genuine open
question, not a search failure.

### H3. "Every action must be satisfying" (juice)

**Holds as craft consensus. Does not hold as measured fact — I overstated it.**

I told the PO this was "the best-evidenced cheap win in game design."
Checked:

- Swink, *Game Feel* (Morgan Kaufmann, 2009) — foundational, but craft
  theory, not experimentally validated. **design analysis**
- Jonasson & Purho, *Juice It or Lose It*, GDC Europe 2012 — a live
  Breakout demo. Enormously influential; **not a controlled experiment**
  with measured outcomes. **folklore**
- Hicks, Dickinson, Holopainen & Gerling, *Good Game Feel: An Empirically
  Grounded Framework for Juicy Design*, DiGRA 2018 — the closest thing to
  measurement, and it is **qualitative**: 17 developer interviews,
  affinity diagramming, applied to two commercial games. No effect size.

So: near-universal practitioner agreement, no controlled measurement.
Still worth doing — but it is consensus, not evidence, and I should not
have sold it as evidence.

**Supports the PO's rule 11 anyway:** practitioners describe an
over-juicing ceiling where constant feedback tips into noise and obscures
strategic readability (**folklore**, no study). And **no study at all**
was found on undifferentiated feedback — juice that fails to encode which
action mattered. That is exactly our defect, and it is unstudied. We are
designing ahead of the literature here, which is worth knowing.

### H4. "Golden-cookie-style timed interrupts conflict with a relaxing game."

**Half right, and softer than I put it.**

Variable-ratio reinforcement does produce persistent, extinction-resistant
behaviour (**empirical**, loot-box literature). But the pre-registered
work — *Exploring the relationships between psychological variables and
loot box engagement*, Royal Society Open Science 2023 — separates a
**distraction/compulsion** motivation from an **enhancement**
(fun/recreation) motivation, and the harm concentrates in the first. "All
variable rewards are compulsion" is too flat.

Cookie Clicker's golden cookies specifically: player complaints and one
critical essay (*Cookie Clicker: When Doing Nothing Feels Productive*,
CVGS). **folklore** — no controlled study of that mechanic.

**And my proposed alternative is unsupported.** "Fixed, announced,
predictable reward timing preserves engagement without the anxiety" is
repeated across design blogs with **no academic source found** — the
single clearest case of plausible-sounding design advice with nothing
behind it that this search turned up. It is a reasonable hypothesis. It is
not a finding. Ours to test in play, not to cite.

### H5. "Autonomy vs competence" — my reframing of the PO's "feel smart"

**Holds at the level used.** Autonomy, competence and relatedness each
independently predict enjoyment and intention to keep playing — Ryan,
Rigby & Przybylski, *The Motivational Pull of Video Games*, Motivation and
Emotion 2006; Przybylski, Rigby & Ryan, Review of General Psychology 2010.
**empirical**.

**But the ranking I gave is not supported.** I told the PO competence is
the better primary. **No source was found** comparing autonomy against
competence as predictors *for single-player games with no social layer*.
One study found autonomy stronger, but it was scoped to customisation
mechanics and should not be generalised. The competence-first decision
stands on **product reasoning** — it builds on systems we already have,
and it answers the live complaint — not on evidence. Recorded honestly in
[[intent]].

### H6. Universal Paperclips — why it worked

The homage target, so worth knowing what is actually established.

- **Phase changes are real and well-corroborated.** The game changes verb
  repeatedly — clicking, then pricing/business simulation, then
  factory/drone/space management, then endgame optimisation — each
  demanding a different kind of attention. Aaron A. Reed, *2017: Universal
  Paperclips* (IF50); des, *How Idle Are Idle Games?* (CVGS 2021). Two
  independent critics converge. **design analysis**
- **It gets more demanding, not more passive.** CVGS argues the later game
  is not idle at all — it is attention-hungry and more stressful as it
  goes. Directly relevant: **our PO's instinct that a good game applies
  some pressure matches what the homage target actually does.**
- **The ending is load-bearing.** A definitive stop, no monetisation, no
  forced recruitment — critics treat this as what lets the escalation read
  as narrative instead of extraction.
- **Lantz credits timing, not only design:** *"the meme weather was good
  for me... just enough public discussion of A.I. safety in the air."*
  **design analysis** (self-report).
- **No empirical study of its retention exists.** Everything above is
  criticism and self-report. There is a peer-reviewed treatment — *The
  Ontology of Incremental Games*, Eludamos 10(1) — whose full text could
  not be retrieved, so its thesis is unverified.

---

## Open questions

Not tickets. No status. They stay until answered or abandoned.

1. **What makes a good game of this type?** The project's central
   question, and the PO's stated goal presupposes an answer we do not
   have. The Paperclips findings above are the start, not the answer.
2. **How fast does a rising number stop paying?** No literature. We could
   answer it for our own game by instrumenting a played run.
3. **Does differentiated feedback measurably change how a player reads a
   decision?** Unstudied anywhere. We are ahead of the literature.
4. **Is announced, predictable pressure really anxiety-free?** Our
   proposed way out of the golden-cookie trap rests on nothing. Test it in
   play before building a system on it.
5. **What is our equivalent of Paperclips' phase change?** We have three
   acts, but do the *verbs* change, or only the nouns? Act II's failure
   may be that it changes what you manage without changing what you do.
6. **What does our ending do?** Paperclips' ending is called
   structurally load-bearing by every critic who writes about it. Ours has
   never been examined as a design object.
7. **Does the illusion of a fork survive two players comparing notes?**
   No literature either way. Direction line 2 depends on the answer.

---

## Standing method

- A PO intuition gets researched **before** it becomes a rule.
- Grade every claim: empirical · design analysis · folklore.
- **"No source found" is a result.** Write it down rather than filling the
  gap with something plausible.
- Never invent a citation. A missing finding is fine; a fabricated one
  poisons the page.
- Report the verdict to the PO **in chat, in player terms** — he does not
  read this page ([[005-direction-before-queue]]).
- **Correct myself out loud** when the research contradicts something I
  already told him. Round 1 contradicted three of my own claims.

Related: [[intent]], [[po-rules]], [[juice-and-legibility]],
[[005-direction-before-queue]]

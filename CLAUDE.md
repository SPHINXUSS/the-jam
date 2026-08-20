# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first

**`ai/wiki/index.md` is the project memory.** Read it at the start of
every session, in this order: **Direction**, then Current State, then the
catalog. `ai/wiki/intent.md` holds the direction in full — what the game
must *become*. `ai/wiki/po-rules.md` lists the standing product
constraints; violating one is a defect, not a style choice.
`ai/wiki/juice-and-legibility.md` is the bar every player-facing control
must clear. `ai/wiki/WIKI.md` is the schema and the Definition of Done.

**Do not open a session by picking from the queue.** Direction comes
first — see "Opening a session" below. The queue was written by the
previous session; obeying it is how three sessions in a row went to
defects while the game's feel went untouched
(`ai/wiki/decisions/005-direction-before-queue.md`).

`ai/source/` holds the two frozen design transcripts. Read and quote
them; never edit them.

Update the wiki at the end of any work unit (ingest procedure in
`WIKI.md`). Chat history is not memory.

## What this is

A browser incremental game in three acts. **No build step, no bundler, no
package manager, no dependencies, no tests.** Open `index.html` in a
browser and it runs from disk.

```bash
xdg-open index.html                 # play it
python3 -m http.server 8000         # or serve it, then localhost:8000
```

Deployment is `git push` to `main`; GitHub Pages rebuilds in a minute or
two. Do not verify a push by fetching `raw.githubusercontent.com` — it
caches for several minutes and has already caused a false "the commit
failed" report. Verify with `git log`.

There is no lint, type-check or test command. Verification is: open it in
a browser and play the affected path, including a reload.

## Architecture

Five files, loaded as plain `<script>` tags in a fixed order
(`index.html:310-313`). Everything is a global — no modules, no IIFEs,
no exports.

| Order | File | Owns |
|---|---|---|
| 1 | `i18n.js` | `DICT`, `LANG`, `t()`, `snapshotStatic()`, `setLang()` |
| 2 | `feel.js` | floating numbers, flash/bump/shake, spoon spin, `holdable()`, tooltips |
| 3 | `engine.js` | state `s`, save/load, **Act I economy**, recipes `R`, objectives |
| 4 | `ui.js` | **Act II + III simulation**, render, wiring, the rAF loop, `boot()` |

**The file names lie.** `engine.js` says "no DOM rendering lives here"
and does DOM work anyway (`drawLog`, `drawJar`, `show`/`hide`, `toast`).
`ui.js` says it is "rendering, feedback, interaction" and contains the
entire orchard and spore simulation (`act2Tick` at `ui.js:152`,
`act3Tick` at `ui.js:260`). So: Act I economy is in `engine.js`, Acts
II/III economy is in `ui.js`. This is history, not design — do not
refactor the seam as a side quest; propose it as its own change if
something forces it.

`ui.js` ends by calling `boot()`. That is the entry point.

### State

One mutable global `s`, shaped by `fresh()` (`engine.js:58-81`), saved as
one JSON blob to `localStorage['the-jam-v1']` every 10s and on demand.
`load()` merges over `fresh()`, so **adding a field is save-compatible;
renaming one or changing its meaning is not.** Bumping `s.v` silently
discards every existing save. `store` (`engine.js:12`) falls back to an
in-memory object when `localStorage` throws.

The codebase mutates `s` in place everywhere. That is the convention here;
the global immutability rule does not apply retroactively.

### The loop

One `requestAnimationFrame` (`frame`, `ui.js:643`): `tick(dt)` every
frame (`dt` clamped to 0.5s), `render()` when 0.1s has accumulated,
reveals/recipes/tooltips every 0.5s, `save()` every 10s. Offline catch-up
is replayed in `boot()`, capped at one hour over at most 240 ticks.

## Traps that have already cost real bugs

1. **`set()` fails silently.** `set(k,v)` (`ui.js:451`) writes
   `el[k].textContent`, and `el` is a hand-maintained id array
   (`ui.js:441-449`). A `set()` call for an id missing from that array
   does nothing, with no error. This is currently breaking three live
   readouts. Any new `set('x',…)` needs `'x'` in the array — or fix the
   class (see `ai/wiki/gaps/gap-dead-readouts.md`).
2. **Functions defined for a system and never called.**
   `servicedPerSec()` (`engine.js:203`) is the whole seller/shop ladder
   and nothing calls it; `swarmBoost()` (`ui.js:110`) likewise. Before
   trusting that a mechanic works, grep for its call site.
3. **`.hidden` panels and the two reveal paths.** `checkReveals()`
   (`ui.js:658`) reveals with a logbook note; `restoreUI()` (`ui.js:790`)
   replays the same conditions silently on load. A new panel must be
   added to **both**, or it disappears on refresh.
4. **Affordance is Act I only.** The `.can`/`disabled` block is guarded
   to `s.act===1` (`ui.js:596`). Act II/III buttons give no feedback.
5. **`onclick=` assignment**, not `addEventListener`, for most controls
   (`ui.js:685-756`). Assigning twice silently replaces.

## Localisation is not optional

`DICT` (`i18n.js:11`) is keyed by **the exact English string** — no
namespacing. A missing key falls back to English silently, which is the
exact failure the PO has complained about repeatedly.

Rules: every new user-visible English string gets a `DICT` entry in the
same change; translate as a French writer would, not word-for-word;
build dynamic bilingual text with `{en:'…',fr:'…'}` objects or `tf()`,
never by concatenating translated fragments. Text inside `#log`,
`#recipeList` and `#cbLog` is excluded from the static snapshot and must
be re-rendered by `setLang()`.

## Adding content

- **A recipe**: append an object to `R` (`engine.js:425`) —
  `{id, name, act, i?/c?/m?, when(), desc, run()}`. No registration.
  `run()` may call `show()` to reveal a panel.
- **A new system**: it needs a branch in `objective()` (`engine.js:396`)
  or the player will never be told it exists, a `TIPS` entry
  (`feel.js:82`), FR strings, and both reveal paths (trap 3).
- **A colour**: add it to all three palette blocks in `style.css`
  (`:root`, `body.act-2`, `body.act-3`).
- **An animation**: it must degrade under
  `prefers-reduced-motion: reduce` (the `prefers-reduced-motion` block in `style.css`) — and degrade means *keep the feedback, drop the movement*, never collapse it to 1ms.

## Opening a session

Before any work, say this to the PO in chat — three or four sentences,
not a report:

1. what you intend to work on
2. which **direction line** it serves (`ai/wiki/intent.md`)
3. which **po-rule** it risks, and which **bar item** it must clear
4. how you will verify it

A candidate that cannot name a direction line does not get worked. Raise
it as unmoored and let the PO decide.

Two standing quotas per session:

- **At least one non-queue item** — design, feel, or research. Otherwise
  defects starve everything else, which is what happened in session 3.
- **Any `my read` line in `intent.md` that you acted on gets read aloud.**
  The PO never reads the wiki. He audits your memory by hearing you say
  it back and telling you it does not match what is in his head.

## Delegating to subagents

Full rules in `ai/wiki/decisions/006-delegation-tiers.md`. The goal is
**more work per usage window**, never faster at the cost of quality.

| Tier | Gets |
|---|---|
| **Haiku** | mechanical and verifiable: grep-and-tabulate, id/key audits, dead-call-site sweeps, `file:line` evidence collection |
| **Sonnet** | bounded judgement against a fixed schema: bulk transcript reading, scripted playthroughs reporting observations, wiki lint, sourced research gathering, **drafting** FR strings |
| **You** | design, feel, root cause, balance, every code edit, every PO-facing claim |

- **A subagent returns evidence, never a verdict.** "Act II feels legible
  now" from an agent is worthless and violates po-rule 7. What twelve
  panels literally displayed at t=40m, with console output, is gold.
- **Brief for compressed output** with a hard line cap — their report
  lands in your context and you pay for it.
- **Never delegate anything needing the PO's taste held in mind**: feel,
  tone, final French wording, what the game should become.
- **Do not delegate what a shell command does better.**
- Run independent sweeps in parallel.

## Working style on this project

The user is the product owner and not a developer. Speak in player terms:
what changes on screen, what the player feels, what it costs. Make the
technical calls yourself; escalate only genuine product decisions —
anything changing the shape of a run, the identity of a fork,
permanence/loss of progress, or the visual identity.

Fix the class, not the reported instance. Track multi-symptom feedback one
gap page per symptom. Never claim a player-facing behaviour is done on the
strength of a simulation or a code read — the previous lineage shipped two
whole acts that way and said so.

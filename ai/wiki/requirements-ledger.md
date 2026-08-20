---
title: PO requirements ledger — every ask, every status
type: reference
status: active
updated: 2026-08-19
---

# Requirements ledger

Every distinct thing the PO has asked for, complained about, corrected or
ruled, extracted exhaustively from `ai/source/gpt_transcript.pdf` (70
entries) plus the feedback message of 2026-08-19. **Nothing here is
assumed done because a transcript says it was done** — PO instruction:
*"Don't take what is in the transcript for done or even done correctly."*

Status: ✓ verified in the current build · ⚠ partial · ✗ not met ·
▲ rule (ongoing, not a task) · ? unverified

> **This ledger is a list of asks, not a record of what the PO meant.**
> That lives in [[intent]]. Rows here are deliberately flat; several of
> them flatten something that is not flat. Row 13 — *"I want to feel
> smart and feel like I made a choice other players may not have done"* —
> is the entire game, filed as a checkbox. Do not plan from this page.
>
> **It was built on four amputated messages, and they are now
> recovered.** `gpt_transcript.pdf` truncated four of the PO's own long
> messages with "Show more" markers; he pasted them in full on
> 2026-08-20 ([[po-messages-recovered]]) and immediately said they were
> superseded by this lineage's work. Their hidden tails were read and
> **no row was added or changed** — the bug reports were already fixed,
> the rules already obeyed. What the tails changed was [[intent]], not
> this page. Coverage here is no longer known-incomplete for that reason.

| # | PO's ask (short) | Status | Evidence / where |
|---|---|---|---|
| 1 | Paperclips-like, more beautiful, called The Jam | ✓ | shipped |
| 2 | Must be as fun as the original | ⚠ | [[gap-idle-player]] |
| 3 | Work directly in the GitHub repo | ▲ | process |
| 4-6 | Take time, act like a game-design team | ▲ | [[po-rules]] |
| 7 | PO isn't a developer, agent owns technical calls | ▲ | [[po-rules]] |
| 8-9 | Playable, hosted on GitHub Pages | ✓ | Pages on `main` |
| 10 | "plain html is very ugly" | ✓ | rebuilt, [[style-and-palette]] |
| 11 | Game design itself needs work, not a skin | ⚠ | [[gap-choice-scarcity]] |
| 12 | Inspire from Paperclips, don't copy it | ✓ | |
| 13 | "I want to feel smart and feel like I made a choice other players may not have done" | ✗ | [[gap-choice-scarcity]], [[gap-house-styles-inert]] |
| 14 | Never hard-block the player | ✓ | charity fruit `engine.js:241`, reseed floor `ui.js:239` |
| 15 | No wrong choices, only trade-offs | ▲ | [[po-rules]] |
| 16 | Reset stays available as an escape hatch | ✓ | `#resetBtn` |
| 17 | A weakness should come with a compensating strength | ✗ | [[gap-house-styles-inert]] |
| 18 | Choosing must not get too complex | ▲ | [[po-rules]] |
| 19 | Must stay a relaxing fun game | ▲ | [[po-rules]] |
| 20,22 | Money comes far too fast early | ? | changed by the selling fix — needs a fresh balance pass |
| 21 | Raising price didn't reduce volume | ✓ | real elasticity, `engine.js:184` |
| 23 | Notifs for things not unlocked yet | ✓ | `scanRecipeNotices` gates on `r.when()` |
| 24,25,26 | Notifs = recipes only, once each | ✓ | `ui.js:87-96` |
| 27,29 | Overproduce vs can sell; min price always optimal | ⚠ | the reach cap now creates the missing tension — **needs replay** |
| 28 | Run real maths/research on balance | ⚠ | demand curve anchored to real prices; reach curve untested |
| 30 | Consider slowing production-upgrade pacing | ? | open balance question |
| 31 | Culture needs a cooldown (stop spamming) | ✓ | 3.5s, `engine.js:288` |
| 500 | Boot-marker crash | ✓ | gone; clean boot verified in browser |
| 501,502 | Root-cause first; never break the game | ▲ | [[003-fix-classes-not-instances]] |
| **503** | **"I reached the second act and I don't understand anything in there... just pushing buttons"** | ✗ | **[[gap-act-ii-illegible]]** |
| 504 | The probability contest was already confusing | ✓ | every palate explains its rule — [[gap-tasting-panel-opaque]] |
| 505,506 | FR/EN switch, everything translated | ✓ | switch works; coverage needs an audit |
| 507,512,514,515,516,517,522,523,525 | Still seeing English (9 times) | ✓ | **audited 2026-08-19**: 40 real gaps found by script (all 13 tooltips, all 9 fork strings, 6 labels), all translated; browser sweep of 181 visible strings across every panel in FR returned 0 English |
| 508,509 | Keep the humour, avoid cringe, not literal | ▲ | [[i18n]] |
| 510 | "agitation" doesn't work in French | ? | audit |
| 511 | "plainte d'épaule" → "une douleur constante à l'épaule" | ? | audit |
| 513 | Blank page on load | ✓ | clean boot verified |
| 518,524,526,527,528 | Be exhaustive; fix all instances, not one | ▲ | [[003-fix-classes-not-instances]] |
| 519 | Clicking "remuer la marmite" froze the page | ✓ | stir verified in FR, no error |
| 520,521 | Regressions | ▲ | |
| 529,537 | "Fruits meurtris" duplicating its s | ✓ | snapshot i18n cannot compound; FR switch ×3 clean in browser |
| 530,531 | French ferment/"Lire la culture" wording wrong | ⚠ | button now "Test the set"; FR wording needs review |
| 532 | Progression got real slow | ? | balance pass |
| 533 | Bring back spammable culture, but with losses | ✓ | cooldown 220ms, symmetric losses, measured — [[gap-culture-cooldown]] |
| 530,531b | "Lire la culture" wording | ✓ | button rendered English-only at runtime AND used the rejected phrasing; now "Test the set" / "Tester la prise" |
| 534 | Tasting panel pays less than it costs | ✓ | 1st = ×2.4, 2nd = ×1.05, `engine.js:382` |
| 535,536 | Saving broken, refresh loses everything | ✓ | verified surviving reload in browser |
| 538,539 | Eradicate root causes; no patchwork | ▲ | |

## Feedback of 2026-08-19

| # | Ask | Status | Where |
|---|---|---|---|
| A1 | Real pot, witch-like, player clicks it to stir | ✓ | shipped b1d6d06 — [[gap-the-pot]] |
| A2 | Study Cookie Clicker's juice, keep our identity | ✗ | [[juice-and-legibility]] |
| A3 | Selling must not be automatic at the start | ✓ | fixed + browser-verified 2026-08-19 |
| A4 | "Made / Produit" stuck at 0/s | ✓ | fixed + verified |
| A5 | House style changes nothing perceptible | ✗ | [[gap-house-styles-inert]] |
| A6 | Only one real choice in the whole game | ✗ | [[gap-choice-scarcity]] |
| A7 | Autoseller ↔ demand not balanced | ⚠ | link now exists; balance pass pending |
| A8 | Demand/price bar unclear to a new player | ✓ | two comparable bars + a sentence — [[gap-demand-bar-illegible]] |
| A9 | Exchange: choose the stake as a % of cash | ✓ | fixed + verified |
| A10 | Keep the player busy — doing, thinking, animation | ✗ | [[gap-idle-player]] |

## From `ai/source/claude_transcript.pdf` (56 pages, 53 asks)

The `.txt` in the repo was a partial export holding 5 messages. The real
transcript contains a **playtester feedback dump** that is the single
richest source of requirements in the project. Full extraction 2026-08-19.

| # | PO's ask (short) | Status | Evidence |
|---|---|---|---|
| 1000-1003 | Paperclips-like, beautiful, beat the GPT build, work in the repo | ▲ | standing |
| 1004-1010, 1022-1023, 1044, 1049-1050 | Direct git access, stop using file uploads (**said 6 times**) | ✓ | this lineage has CLI git; commits and pushes directly |
| 1011 | Progression feels very fast; what is the playtime? | ? | ~50-60 min by simulation, never confirmed by a real playthrough |
| 1012 | "it feels very corridor like... my choices don't impact a lot" | ✗ | [[gap-choice-scarcity]] |
| 1013 | Must sell at $0.05, "never seen jam so low" | ✓ | `PRICE_MIN` 1.80, anchored to real jam prices |
| 1014 | 300%+ appetite from the start is too high | ✓ | appetite now ~0.84-1.2 jars/sec at open |
| 1015-1017 | Mine the GPT thread for everything raised there | ✓ | [[requirements-ledger]] is that, exhaustively |
| 1018 | Eradicate root causes, no patchwork | ▲ | [[003-fix-classes-not-instances]] |
| 1019 | "there is no wrong, there is just tradeoffs" | ▲ | [[po-rules]] |
| 1020-1021, 1043 | "lire dans le ferment" means nothing in French; what is the link to jam? (**asked twice, never answered**) | ✓ | renamed to The Setting Point / Tester la prise — a real jam term: a blob on a cold saucer |
| 1024, 1035 | Blind tasting is cheated — spam it for free money | ✓ | cost `900×1.55^runs`, 15s cooldown, payout only on a correct read (×2.4 first, ×0.15 fourth) |
| 1025 | Reached Act II by exploit, understood nothing | ✓/⚠ | exploit closed; comprehension → [[gap-act-ii-illegible]] |
| 1026 | Regression vs GPT's build; French still incomplete | ✓ | full audit + browser sweep, 0 English remaining |
| 1027 | Price stepper tedious, cent by cent, can't hold | ✓ | `holdable()` on both steppers, accelerating |
| **1028** | **"not juicy enough... every action stimulate at least visually, taking example on cookie clicker"** | ⚠ | pot + splash shipped; automation still silent → [[gap-idle-player]] |
| 1029 | Wants a "big red ouch" on a bad culture read | ✓ | `flash('bad')` + shake + bump-bad + red floater |
| 1030 | "looks more like an administrative dashboard than a fun game" | ⚠ | pot is the first real answer; more needed |
| 1031 | No visual hierarchy — creativity same size as minor text | ✓ | hierarchy block in `style.css`, primary stats enlarged |
| **1032** | **"they would really like to stir the pot, kinda like cookie clicker"** | ✓ | shipped 2026-08-19, commit b1d6d06 — [[gap-the-pot]] |
| 1033 | Opening price mechanic misunderstood — thought raising price = more money | ✓ | the sentence under the bars says which constraint binds — [[gap-demand-bar-illegible]] |
| 1034 | Likes the skill-based minigame, wants more of that kind | ✗ | [[gap-choice-scarcity]] |
| 1036 | Force manual selling early like Paperclips, then sellers, then shops | ✓ | shipped 2026-08-19 — [[gap-automatic-selling]] |
| 1037 | Nobody knows how taste is earned, PO included | ✓ | explained in the palate panel + 2 tooltips, EN/FR |
| 1038 | Didn't know the next step within minutes — "extremely frustrating" | ✓ | objective strip + the new state line |
| 1039 | "not clicking the x10 because it looked greyed out" | ✓ | secondary buttons use ink; disabled ones dashed and faded |
| 1040 | Wants hover text explaining mechanics | ✓ | 29 tooltips, every act, EN/FR |
| 1041 | Sugar dial with a sweet spot, from a park-tycoon salt mechanic | ✓ | [[sugar-dial]] |
| 1042 | "globally the game needs a lot more polishing" | ⚠ | ongoing |
| 1045 | **"the act 2 is completely broken in term of player experience"** | ⚠ | [[gap-act-ii-illegible]], first pass shipped 56b9a71 |
| 1046 | "are you sure you didn't skip things from what I told you?" | ✓ | this ledger exists so the answer is checkable, not remembered |
| 1047 | Why one index.html instead of separated css/js? | ✓ | split into 5 files |
| 1048, 1051, 1052 | **"don't stop assuming I will unless you're genuinely finished"** | ▲ | [[po-rules]] rule 9 |

### Act III

The PO has **never mentioned Act III** in either transcript. Every claim
about its pacing comes from the previous agent's own simulator. It remains
the only part of the game no human has played.

## The two things the PO has said most often

1. **Translation is still incomplete** — nine separate times, escalating.
   Anything shipped without full FR restarts that.
2. **Fix the root cause, not the instance** — nine separate times.

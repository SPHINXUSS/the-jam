# Log

Append-only, newest at bottom. `## [YYYY-MM-DD] <op> | <summary>`

## [2026-08-19] ingest | Wiki created. Full read of the codebase (index.html, engine.js, ui.js, feel.js, i18n.js, style.css) and both frozen transcripts. 6 modules, 3 features, 3 decisions, 11 gaps, 1 plan, 2 reference pages. No game code changed.

## [2026-08-19] decision | 001 continue the existing build, no third rewrite.

## [2026-08-19] decision | 002 ai/wiki is project memory; ai/source holds frozen transcripts.

## [2026-08-19] decision | 003 fix classes not instances; browser evidence required; one gap page per reported symptom.

## [2026-08-19] finding | servicedPerSec() (engine.js:203) is never called — Act I selling ignores the seller/shop ladder entirely. Confirmed by grep across all four JS files.

## [2026-08-19] finding | set() (ui.js:451) silently no-ops on ids absent from the el cache array (ui.js:441-449). Exactly three orphans: madeRate, sellerCost, shopCost.

## [2026-08-19] finding | swarmBoost() (ui.js:110) is defined and never called — same dead-function class as servicedPerSec.

## [2026-08-19] ingest | Exhaustive re-extraction of both transcripts: 70 distinct PO asks catalogued in requirements-ledger.md. Previous topical summary had lost items; corrected.

## [2026-08-19] fix | Batch A shipped and browser-verified: set() can no longer fail silently (lazy lookup); Act I selling now routes through servicedPerSec() so nothing sells itself before the counter recipe; soldByHand/soldAuto split; exchange stake selector (10/25/50/All % of cash) with resolved amount and win/loss feedback; segmented controls now show what is selected; buyN refuses loudly instead of silently.

## [2026-08-19] fix | i18n audit by script found 40 untranslated strings — all 13 tooltips, all 9 house-style/orchard fork strings, 6 static labels. All translated. Browser sweep of 181 visible strings across every panel in FR mode: 0 English remaining.

## [2026-08-19] fix | Culture button rendered "Read the culture" at runtime — English-only in FR and the exact wording the PO rejected twice. Now "Test the set" / "Tester la prise".

## [2026-08-19] correction | Act II WAS played by the PO and reported as incomprehensible ("just pushing buttons", gpt_transcript p.34). Previous claim that nobody had played it was wrong. New gap: gap-act-ii-illegible.

## [2026-08-19] fix | Act II legibility (56b9a71): "what is happening" state line in every act, orchard pipeline drawn as three stages with the slowest marked, imbalance reported before buffers overflow, spoilage attributed to a stage, jars-as-currency stated in the UI, per-act affordability table, 14 new tooltips. All strings EN+FR. Browser-verified.

## [2026-08-19] note | PO supplied a 1.2MB PDF export of the Claude Desktop transcript; the 16KB .txt previously in the repo was a partial export containing only 5 PO messages. Full extraction dispatched.

## [2026-08-19] ingest | Full 56-page Claude transcript extracted: 53 asks, including a playtester feedback dump never previously surfaced. Folded into requirements-ledger.md. New standing rule recorded (po-rules #9): never self-interrupt mid-task.

## [2026-08-19] fix | The pot (b1d6d06): cauldron replaces the jar and is the click target; jam splash at cursor; stirrer bowl orbits the interior; steam tied to activity; automation idles at a simmer. Closes gap-the-pot and playtest ask #1032. Same commit: secondary buttons no longer look disabled (#1039), and how taste is earned is now explained (#1037).

## [2026-08-19] fix | Market panel (c028fd9): the ambiguous ratio bar replaced by two bars on one scale plus a sentence naming the binding constraint; backlog stated; revenue now nets off sugar cost.

## [2026-08-19] fix | Setting Point: cooldown 3.5s -> 220ms, gains and losses symmetric. Measured: 80 blind reads +475, 40 timed reads +1,547.

## [2026-08-19] fix | Tasting panel (49c6a54): every palate states its rule, grid explained, names translated. Fixed a shipped crash — the panel's first press read .slice() off a null ranking and killed the frame.

## [2026-08-19] fix | Affordability, second half (bb249e3 + this): the ×10 buttons joined the per-act afford table and got tooltips; Act I ×10 refusals now toast and shake instead of failing silently; treatBlight and swSync print their inspiration price, join the table, and no longer toast in English only. Closes gap-affordance-act-ii. Browser-verified headless, 0 console errors.

## [2026-08-19] fix | Automation got a heartbeat: jars made and money taken by machines are collected and released as one floater a second, from the readout the player is already watching (#jars in Act I, a new "Jars in hand" top-bar slot in Acts II/III). Acts II and III previously never displayed the jar stock at all, while spending it on every purchase. Same commit: drawJar no longer poisons its bubbles with NaN when called with no dt (85 console errors in one run).

## [2026-08-19] fix | Round two, batch 1-2 (e122389): sound restored (it existed in the pruned GPT layer and the rewrite dropped it); euros in FR; French long scale for big numbers (English "billion" was being read as French "billion", wrong by 1000x); nine show() reveal messages had never been translated; the whole ending screen was English; ai/tools/i18n.js now audits every reachable string and reports 0 missing.

## [2026-08-19] fix | The pot, attempt two (ec8d862): drawn cauldron with a live sine-wave jam surface. REJECTED by the PO — still shapes assembled in code.

## [2026-08-19] fix | Act I economy (be71002): queue at the door closes the manual-selling exploit (at $12 a jar, 15 presses of Sell earn $0.00; at $1.20, 8 presses earn $3.12). Sugar peak and tolerance now move with price. PRICE_MIN 1.80 -> 1.20. Fifteen Act I recipes gated on ownership.

## [2026-08-19] fix | Juice (1f5a56f): larder stamp, timed visitor (wasp/bee/spore) with boosts, boost countdown line, pot stops simmering when the larder is dry.

## [2026-08-19] decision | 004 art direction, PROVISIONAL: pixel art, top view. Research finding: Cookie Clicker is 300+ PNG sprites, Gnorp Apologue and Mushies are pixel art, Idle Iktah is hand-drawn, Paperclips has no art. None of them build objects from code-drawn vector shapes. The method was wrong, not the shading. PO has NOT closed this.

## [2026-08-19] tool | ai/tools/sim.js + domstub.js: the real game loaded through a stub DOM and played by a policy, so balance can be measured instead of guessed. This is how every number below was found.

## [2026-08-19] finding | Act II was a flat line for 50 minutes then finished in 8. Causes: 5M-jar arrival grant vs a 400-jar first machine; cost growth 1.00015 (flat); multiplier stack of 4.3 million.

## [2026-08-19] correction | The "every machine ran at 8% because the act opened with no power" line was reported as if it described the build the PO played. It did not. It described an intermediate state of THIS session's build, created by cutting the arrival grant, caught by the simulator and fixed before shipping. What the PO played is the opposite and their account is exact: 5,000,000 jars on arrival, 7,040 pickers and 131 sun traps affordable in one go, and the 1000th picker costing $465 against the first at $400. Never repeat a finding from the tuning loop as if it were an observation about a shipped build.

## [2026-08-19] finding | Act III could reach an unwinnable state: spores decayed faster than they replicated and the reseed price only triggered at exactly zero, which never happened. Fixed with a carrying capacity, a discounted price while small, and a free spore when nothing at all is left.

## [2026-08-19] fix | Acts II and III rebuilt (c848c55): six catchments; costs at 1.12/unit; 15 new Act II recipes; vats; base daylight; spore carrying capacity. Measured end to end: 45m / 58m / 48m, 2h34m total, and identical for a player who stops playing after six minutes.

## [2026-08-19] fix | House styles now differ in kind, not degree. Maker's Table: balk 8.90, taste x2, appetite -26%, word of mouth x0.55, sellers +35%. Corner Store: balk 4.20, word of mouth x2, sellers -45%, crates x1.5, taste x0.6. Measured at $8.50/jar: neutral demand 0.069/s, maker 0.244/s, store 0.020/s — the same price is a good business or a dead one depending on the house. Both branches complete the game (2h24 maker, 2h21 store), so neither is a wrong choice. A permanent House badge sits in the top bar. Closes gap-house-styles-inert.

## [2026-08-19] fix | Three mutually exclusive recipe pairs, answering "a choice other players may not have done": The Long Boil XOR The Quick Set (inspiration vs output), Lexical Preserving XOR The Plain Label (word of mouth vs price ceiling), Leave the Hedgerows XOR Clear the Hedgerows (tolerance vs throughput). Taking one closes the other permanently; the card says so before you press it. 70 recipes now, was 66.

## [2026-08-19] fix | Juice, second half: purchases pop on the button that was pressed, recipes light once as they come into reach and keep a marked edge while affordable, buying a recipe flashes the room.


## [2026-08-19] finding | The small arrival grant introduced a soft-lock the PO's pushback exposed: spend all 2,600 jars on pickers and the line makes zero jars a minute, with no way back — pickers make fruit, only bottling lines make jars. Fixed as a class, matching Act I's charity fruit and Act III's free reseed: Act II now opens with one of each stage already standing, and a stage you own none of costs whatever you can actually pay, down to and including zero. Verified: from zero lines and zero jars, one press rebuilds the line and production resumes at 2,700 jars/minute.

## [2026-08-20] tool | A browser playthrough harness (scratch, not committed): the game's own rAF loop is pumped frame by frame from Playwright while a policy presses real buttons in the real DOM. 3h52 of play in ten minutes of wall time, with every tick, render, reveal and save happening exactly as written. This is the first time any part of Act III has been seen running.

## [2026-08-20] finding | Nobody had ever watched Acts II or III run in a browser, and the previous lineage said so. Doing it produced five defects in one sitting, every one of them display, wiring or input — the class a harness structurally cannot see. Simulation measures balance. It cannot tell you a button is dead.

## [2026-08-20] fix | Every press-and-hold dial was dead to the keyboard. holdable() bound mousedown and touchstart only, and these are <button> elements, so Enter and Space fire a click that nothing listened for. Six controls affected: price up/down, sugar up/down, buy autospoon, buy jamworks — including the sugar dial, the one system the wiki records as fully meeting its intent. One class fix in feel.js; held keys now accelerate on the same curve as a held mouse.

## [2026-08-20] fix | The objective line advertised a recipe the player had permanently given up, and went on doing it for the rest of the act. Three places asked "is this recipe on the table" with three copies of the test; only drawRecipes() remembered that a fork you did not take is closed. Because the branch returns early it also suppressed every objective after it. One predicate, recipeOpen(), now used by all four sites including buyRecipe.

## [2026-08-20] fix | Act III's trust "−" buttons threw TypeError on every click: buildAlloc() wrote data-t="'+t[0]+'" — the translation function indexed at zero — instead of tr[0]. The act arrives with all twelve trust points already allocated, so the panel was read-only until a later recipe granted spare points. One character.

## [2026-08-20] fix | Inspiration silently caps at 1000·memMult·notebooks^1.3 and then sits there for hours while the player keeps buying ovens, which are not what raises it. A live sentence under the meter now states both terms while filling and, when full, says what is spilling into creativity and that a notebook is what helps. objective() gained the matching branch. Both bilingual.

## [2026-08-20] fix | The recipe panel's empty state said "Make some jam and see what occurs to you" in every act, including on the ending screen of Act III. Now act-aware, with a fourth line for the end of the game.

## [2026-08-20] finding | The Preserve Exchange is a money printer and cannot lose. $100,000 left alone becomes $715,107 in ten minutes at the LOWEST risk, and $38.6M at the highest; drift is positive at every risk level (0.010/0.018/0.028 per tick) so risk scales speed, never direction. It unlocks mid-Act I, after which price, sweetness, sellers, shops and the house style are all decoration. Not touched: this changes the shape of a run, so it is the PO's call. Three options are written up in gap-exchange-money-printer.

## [2026-08-20] finding | The game runs 232 minutes end to end under the scripted player (75 / 114 / 43) against the simulator's 146 (42 / 56 / 48). Neither plays like a person, and the script never uses the exchange. Both finish; the ending screen renders; zero page errors in either run.

## [2026-08-20] fix | Act III's trust panel given the treatment Act II's pipeline had: each of the eight traits now states what it does in words, its live effect in numbers (×3 to finding space; losing 0.29%/s of the fleet; +0.90%/s up to 7,842 spores), and what one more point would buy. A sentence underneath names what is actually limiting — nothing launched, everything already found, the fleet has filled its space, or which conversion trait is lowest. The numbers come from the same expressions act3Tick uses, so they cannot drift from the simulation. The panel is still a stat spread that arrives fully allocated; gap-choice-scarcity wants something with a name, and that is a design conversation.

## [2026-08-20] fix | set() cached DOM nodes and never checked they were still in the document, so any container rebuilt with innerHTML — the trust rows, the recipe list — silently swallowed every later update. Found when the new Act III effect lines went blank on a language switch. This is the third distinct route to the same silent failure (gap-dead-readouts was the first two); set() now re-resolves a node that is no longer connected.

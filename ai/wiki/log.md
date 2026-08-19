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

## [2026-08-19] finding | Act II was a flat line for 50 minutes then finished in 8. Causes: 5M-jar arrival grant vs a 400-jar first machine; cost growth 1.00015 (flat); multiplier stack of 4.3 million. Also: every machine ran at 8% for the first hour because the act opened with zero power supply and an unaffordable sun trap.

## [2026-08-19] finding | Act III could reach an unwinnable state: spores decayed faster than they replicated and the reseed price only triggered at exactly zero, which never happened. Fixed with a carrying capacity, a discounted price while small, and a free spore when nothing at all is left.

## [2026-08-19] fix | Acts II and III rebuilt (c848c55): six catchments; costs at 1.12/unit; 15 new Act II recipes; vats; base daylight; spore carrying capacity. Measured end to end: 45m / 58m / 48m, 2h34m total, and identical for a player who stops playing after six minutes.

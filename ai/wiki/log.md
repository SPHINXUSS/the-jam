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

# Code review, readability lens: rpe-chart (Hermione)

Verdict: readable. Names are plain, comments say why, and the README is accurate. A new engineer would stumble on the source claim and on a few terse names. 0 must-fix.

Known template leftovers (not repeated): template README, new-tool.sh, tracked screenshots, duplicate legal links, build-date "Last updated", British spelling. I found no placeholder text, no "lorem", no sourdough text and no vendor or AI mention in About, Privacy, Terms, Contact, FAQ or the article.

| Sev | Where | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/rpe.js:1-11 | The comment says "Source of the numbers: the RPE chart of Mike Tuchscherer". It does not say which version, link or date. | A reader assumes one canonical chart. There are at least two (see code-regression.md). | Name the version, the source and the date. |
| should | README.md:6 | "`tests/rpe.test.mjs`: known chart values and logic." | The "known values" are the builder's own list, not an outside source. | Say "regression values" until a source fixture exists. |
| should | rpe.js:25 | The comment on `defaultPercent` says "The published value for reps at an RPE." | Misleading: it is the value this site ships. RPE 6 and 12-rep cells may not be in the source. | "The built-in chart value." |
| should | Tool.astro:177,182,214 | Terse names: `anchor`, `eff`, `step()` (a function that shares its name with the `step` state key), `tp`. | A reader has to scan to learn what they hold. | `typedWeight`, `effortText`, `currentStep()`, `targetPercent`. |
| should | skin-retro.css:38 | `#result-status` points to nothing (real id `e1rm-status`). | A reader trusts a selector that does nothing. | Fix the id or delete. |
| nice | Tool.astro:273-274 | `cls` and `cls2` give no hint of their meaning. | See minimalism lens. | One named helper `cellClass(reps, rpe)`. |
| nice | whole site | The chart is called "RTS chart", "Tuchscherer chart", "Tuchscherer RPE chart" and "the chart". The result is "1RM", "e1RM", "estimated 1RM" and "one-rep max". | Mixed terms for one thing. | Use "RTS chart" and "estimated 1RM" in the UI. Use "e1RM" only in code. |
| nice | Chart.astro:2 | Comment says "RPE 10 down to 6", rpe.js says the chart is "in half steps ... 16" and the article says "7, 9 and 11 reps" are missing from the article table. | Three different ways to describe the same range. | One sentence in rpe.js, link from the others. |
| nice | site.config.ts:18 | Comment lists skins "minimal, swiss, clay or retro" but only retro CSS is loaded (`global.css` imports `skin-retro.css`). | Setting another skin changes nothing. | Say "retro only in this tool". |

Good: the header comment in rpe.js explains the reps plus RIR idea in four lines; `roundTo` says "ties go up"; tests are named by behavior.

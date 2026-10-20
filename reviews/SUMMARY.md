# Fix summary: rpe-chart (Carol, 2026-10-20)

## Fixed
- Chart versions: default is the current RTS table (TRAC, 31-value series from code-regression.md). A "Chart version" switch offers "Current RTS (default)" and "2016 RTS article". Edits are kept per version. The result box names the version in use.
- Sources named on the page (chart section, article, About, FAQ): R package `strength` (data-raw/rpe_tab_rts.csv, pulled from TRAC Dec 2025) and the 2016 RTS article "Customizing Your RPE Chart", read as copied in the RPECalc app. The page says plainly that the versions differ by up to 7.6 points at high reps, and that the 2016 RPE 6 row is extended by the reps plus RIR rule. A small comparison table sits in the article.
- Removed the false "about 0.5 percent" claim in Chart, Article and FAQ. FAQ "Is this the Tuchscherer chart? Yes" is now "Which RPE chart does this use?".
- Tests: KNOWN list deleted. `tests/fixtures/rts-trac-2025-12.csv` (verbatim copy of the package file) and `rts-2016-article.csv` (from RPECalc RpePercentageTable.cs) are compared cell by cell (108 and 96 cells). Also tested: RPE 6 extension rule, 7.6 gap, agreement within 0.1 when reps + RIR <= 10, edits per version, new steps. 19 tests pass.
- High-rep reliability note under the result (above 5 reps, stronger above 10, with the other version's value for that cell). FAQ claim about "most reliable" softened.
- Phones: slim result bar (1RM and next load) at the bottom while the calculator is on screen and the result box is not.
- Rounding steps: 1.25 lb and 0.5 kg added.
- `public/.png` removed. `applicationCategory` set to SportsApplication. RPE 6 text "Four or more reps left". Chart cell edits are no longer lost while typing an unfinished number. README updated. Cell class code simplified.
- Already in place from earlier: GitHub Pages config and workflow, noindex on Pages builds, US spelling, fixed "Last updated", no cookie-banner claim, Tailwind scan limited to src, ignores for screenshots and .playwright-cli, deploy runs tests. Verified: Pages build under /rpe-chart/ serves home, about, privacy, terms, contact, icons and manifest; canonical stays https://rpechart.com/; noindex present. Branch is main. Nothing pushed.

## Rejected or left
- Code-readability renames (anchor, eff, step) and moving the UI state code into tested pure functions: left (nice or larger refactor). Print view, share link, warm-up sets, percent toggle: not built (new features, keep single-purpose).
- Crawlable full chart table and /rir-chart/ pages: Phase 2.
- Lighthouse: not re-run (lighthouse could not be started in this session). The last review scored 100 on all four. CSS grew from 29.4 KB to 34.0 KB (Base 29.8 KB plus index 4.2 KB).

## Phase 2 SEO pages (20 candidates)
/rir-chart/, /rpe-to-percentage/, /rpe-chart-for-powerlifting/, /rpe-8-percentage/, /rpe-9-percentage/, /rpe-7-percentage/, /rpe-chart-kg/, /rpe-chart-printable/, /rpe-vs-rir/, /rir-to-rpe/, /rpe-to-1rm/, /1rm-from-rpe-calculator/, /5-reps-at-rpe-8/, /3-reps-at-rpe-9/, /12-reps-percentage-of-1rm/, /rpe-chart-for-squat/, /rpe-chart-for-bench-press/, /rpe-chart-for-deadlift/, /what-is-rpe-in-lifting/, /autoregulation-training-rpe/.

## For the owner
- Confirm the current table against reactivetrainingsystems.com once if you can. We read it second-hand (package data), and the page says so.
- Confirm the GitHub account name abhimishra01 before the first push.

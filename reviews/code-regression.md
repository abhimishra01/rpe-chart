# Code review, regression lens: rpe-chart (Hermione)

Verdict: the math engine, rounding, unit switch, edits and storage are correct, and the page rules hold. The chart values are a faithful copy of the 2016-era RTS chart for RPE 6.5 to 10, but 44 of 108 cells differ from the current RTS table, and the page never says which version it shows. 3 must-fix (all about the source claim), 1 owner decision (which values).

## How I verified the numbers
Sources, with what I could and could not reach:
- S1. RTS TRAC table, current. File `data-raw/rpe_tab_rts.csv` in the R package `strength` (github.com/alexpaynter/strength). Its documentation says "Pulled from the TRAC system on Reactive Training Systems in Dec 2025". It is second-hand (a package author copied it), but it is the newest RTS data I found. reactivetrainingsystems.com was not reachable for the table. RPE 5 to 10, reps 1 to 15.
- S2. 2016 RTS chart as copied in the open code of github.com/tnapes96/RPECalc (`RpePercentageTable.cs`). Its README says the table comes from the RTS article "Customizing Your RPE Chart" (6 Jan 2016). The article table is an image in the Wayback copy, so I could not read it directly. Reps 1 to 12, RPE 6.5 to 10.
- S3. Web copies: fitnessvolt.com Tuchscherer chart guide (reps 1 to 10, RPE 6.5 to 10), sensai.fit/tools/rpe (reps 1 to 12, RPE 6 to 10), fitnessvolt.com RPE calculator page (a third, different table above 6 reps).
- S4. Helms et al. 2016 (Strength Cond J 38(4):42-49, doi 10.1519/SSC.0000000000000218). I could not open the full text (HTTP 402). I read its table through `data-raw/rpe_tab_helms.csv` in the same R package: rounded values, reps 1 to 10, RPE 6 to 10. It is a different chart (for example 3 reps at RPE 10 is 91, RTS is 92.2). The page uses Helms only for the RPE and RIR scale, which is correct.

Results:
- Builder table vs S2: 0 mismatches in 96 cells (RPE 6.5 to 10, reps 1 to 12). The builder's table is the 2016 RTS chart. Its RPE 6 column is not in S2. It comes from the "reps plus RIR" rule.
- Builder table vs S1: 64 cells match, 44 differ (list below). The "reps plus RIR" rule is exact in S1 too (0 conflicts), so S1 is also one list of 31 numbers.
- Builder vs sensai: all equal except 12 reps at RPE 6 (builder 57.4, sensai 57.2).
- Rows 1 to 6 are the same in every source, except the two 0.1 rounding variants.

## The 44 cells that differ from the current RTS table (S1)
Format: RPE: builder -> S1. Rows 3 and below with no entry match.

| Reps | Cells | RPE: builder -> S1 |
|---|---|---|
| 1 | 1 | 8.5: 93.9 -> 93.8 |
| 2 | 1 | 9.5: 93.9 -> 93.8 |
| 4 | 1 | 6.5: 79.9 -> 79.8 |
| 5 | 1 | 7.5: 79.9 -> 79.8 |
| 6 | 1 | 8.5: 79.9 -> 79.8 |
| 7 | 3 | 9.5: 79.9 -> 79.8; 6.5: 72.3 -> 73.2; 6: 70.7 -> 72.4 |
| 8 | 4 | 7.5: 72.3 -> 73.2; 7: 70.7 -> 72.4; 6.5: 69.4 -> 71.6; 6: 68.0 -> 70.7 |
| 9 | 6 | 8.5: 72.3 -> 73.2; 8: 70.7 -> 72.4; 7.5: 69.4 -> 71.6; 7: 68.0 -> 70.7; 6.5: 66.7 -> 69.9; 6: 65.3 -> 69.1 |
| 10 | 8 | 9.5: 72.3 -> 73.2; 9: 70.7 -> 72.4; 8.5: 69.4 -> 71.6; 8: 68.0 -> 70.7; 7.5: 66.7 -> 69.9; 7: 65.3 -> 69.1; 6.5: 64.0 -> 68.3; 6: 62.6 -> 67.6 |
| 11 | 9 | 10: 70.7 -> 72.4; 9.5: 69.4 -> 71.6; 9: 68.0 -> 70.7; 8.5: 66.7 -> 69.9; 8: 65.3 -> 69.1; 7.5: 64.0 -> 68.3; 7: 62.6 -> 67.6; 6.5: 61.3 -> 66.9; 6: 59.9 -> 66.3 |
| 12 | 9 | 10: 68.0 -> 70.7; 9.5: 66.7 -> 69.9; 9: 65.3 -> 69.1; 8.5: 64.0 -> 68.3; 8: 62.6 -> 67.6; 7.5: 61.3 -> 66.9; 7: 59.9 -> 66.3; 6.5: 58.6 -> 65.7; 6: 57.4 -> 65.0 |

Why the S1 numbers are the better choice (my judgment, not proof): fitnessvolt's rep-max table, credited to Tuchscherer, gives 72 percent for 11 reps and 70 percent for 12 reps. That matches S1 (72.4 and 70.7), not the builder (70.7 and 68.0). A standard 12RM is about 70 percent. The 2016 table also has a kink at 10 reps that S1 does not have.

Corrected list for the fixer (drop-in for `SERIES`, totals 1 to 16 in half steps, copied from S1 with 0 conflicts):
`100, 97.8, 95.5, 93.8, 92.2, 90.7, 89.2, 87.8, 86.3, 85.0, 83.7, 82.4, 81.1, 79.8, 78.6, 77.4, 76.2, 75.1, 73.9, 73.2, 72.4, 71.6, 70.7, 69.9, 69.1, 68.3, 67.6, 66.9, 66.3, 65.7, 65.0`
I ran the existing test file against a copy with this list (in a temp folder, now deleted). Every test passes except `KNOWN`, which encodes the old numbers.

Size of the error (e1RM, builder vs S1): 100 x 12 at RPE 10 is 147.1 vs 141.4; 110 lb x 12 at RPE 9 is 168.5 vs 159.2; 135 lb x 8 at RPE 7 is 190.9 vs 186.5; 100 x 12 at RPE 6 is 174.2 vs 153.8 (13 percent). Not affected: the worked example (5 reps at RPE 8, 3 reps at RPE 8, 3 reps at RPE 9, 1 rep at RPE 8), the FAQ examples and the OG image. Those cells are the same in every version.

## Hand-recomputed results (all correct)
| Case | By hand | Page |
|---|---|---|
| 225 lb x 5 @ 8 | 225 / 0.811 = 277.4 | 277.4 lb, 81.1% |
| Plan 3 @ 8, 5 lb step | 277.435 x 0.863 = 239.4 -> 240 | 240 lb, exact 239.4 |
| 315 x 3 @ 9 | 315 / 0.892 = 353.1; 1 @ 8 = 92.2% -> 325.6 -> 325 | 353.1, 325 |
| 100 kg x 6 @ RIR 2 (RPE 8) | 100 / 0.786 = 127.2; 3 @ RIR 2 = 86.3% -> 109.8 -> 110 (1 kg) | 127.2 kg, 110 kg |
| 225 lb to kg and back | 102.06 kg -> 102.1; back to 225 | 102.1 kg, then 225 lb (anchor works) |
| Edit 5 @ 8 to 80 | 225 / 0.80 = 281.25 | 281.3 lb |
| Edit typed as 80,5 | 225 / 0.805 = 279.5 | 279.5 |
| Weight 99999 | clamps to 5000 | 5000 |
| Weight "abc", "", "0", "-5", "1e3" | no result, red field | no result, aria-invalid set |
| Corrupt localStorage (bad types, script string, out-of-range keys) | ignored | ignored, no error, valid edit kept |
| Half steps on/off | 9 and 5 columns | 9 and 5 (plus the Reps column) |
Rounding ties go up (tests show 257.5 -> 260). Fine.

Template rules: canonical set to https://rpechart.com/; pages.dev noindex in `_headers` (both host rules); privacy, terms, about, contact linked in the footer; custom 404 with noindex; sitemap lists 5 pages; robots points to the sitemap; GA and AdSense scripts, ad slot and ads.txt all off while the IDs are empty. GitHub Pages build checked (PAGES_BASE=/rpe-chart/): `noindex` meta present, canonical still rpechart.com, manifest and links use the base path. Known template leftovers are on the fixer's list and not repeated here.

## Findings
| Sev | Where | Finding | Why | Fix |
|---|---|---|---|---|
| must | Chart.astro:39, Article.astro:58, faq.ts:7 | "Copies of this chart on other sites can differ by about 0.5 percent in some cells." | False. Versions differ by up to 7.6 points (12 reps at RPE 6) and by 3 to 5 points at 10+ reps. | Say that RTS published more than one version, name the one used and its date. Drop the 0.5 figure. |
| must | Chart.astro:36,38 (status line in Tool.astro:229), About, Article "Where the numbers come from", faq.ts:7 "Yes" | "Uses the RTS chart as published" and "Is this the Tuchscherer chart? Yes." The chart is the 2016 version, the RPE 6 column is derived, and the current RTS table differs. | The tool's selling point is accuracy and sources (research file). A coach who checks one 11 or 12 rep cell against the current RTS chart will find it wrong. | Decide the version (see decision below). Then write "RTS chart, version of <date>, as copied in <source>". Note that RPE 6 and 12-rep cells are extended where the source lacks them. |
| must | rpe.test.mjs:5-19 | `KNOWN` is the builder's own memory under the title "chart matches the published RTS values". 10 of its 28 cells (the nine 12-rep cells and 5 reps at RPE 7.5) are not in the current RTS table. | The test cannot fail on a wrong copy. It only guards against typos. | Add a fixture of an independent source (the S1 CSV values, or S2 rows) with the source and the retrieval date in a comment. Assert all cells against it. |
| decision (owner) | rpe.js:15-18 | Keep the 2016 numbers or move to the current RTS numbers (44 cells). | Affects every set above 6 reps at RPE 9 or lower and every 11 or 12 rep set. Recommend S1: current, matches Tuchscherer's rep-max table, a one-line change plus the test fix. | One decision. If the owner keeps the 2016 version, the 3 must items above still apply. |
| should | Tool.astro:259-261 | Status text shows the percent for the chosen cell but not the source version. | A user who compares with a coach cannot tell which chart gave 70.7. | Add a short "RTS chart (2016 version)" label near the result or in the chart footer. |
| should | rpe.js:17-18 and article table | `fmt` prints 85 and 100, the article table prints 85.0 and 100.0. | Two formats for the same cell on one page. | Pick one (the chart in the sources shows one decimal). |
| nice | Article.astro:43-48 | Scale table says RPE 6 is "Four reps left. A light set." Zourdos 2016 lists 5 to 6 as 4 to 6 reps in reserve. | Slight over-precision. | Say "Four or more reps left." |
| nice | faq.ts:8 | "RPE 9 or 10 with 1 to 5 reps gives the most reliable estimate" has no citation. | Plausible (Zourdos 2016: accuracy rises with load) but a flat claim. | Cite Zourdos 2016 or soften. |

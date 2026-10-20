# Design and SEO review: rpe-chart (Hermione)

Verdict: clearly better than the competitor pages in the research (FitnessVolt, Lift Vault, SensAI: static tables or small calculators). Retro print skin is on, edge contrast is fixed, dark mode and phone layout work. The gaps are SEO depth and one phone usability issue. 0 must-fix (the stray `/.png` is counted in the maintainer lens).

Scores (Google Chrome headless, local static build): mobile 100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO); desktop 100 / 100 / 100 / 100. LCP 1.0 s mobile, 0.3 s desktop. CLS 0.039 mobile, 0.001 desktop. TBT 0 ms. Transfer 25 KiB. Opened at 1280 and 390 (and 360, 375, 1024) in light and dark. No horizontal page scroll at any width.

| Sev | Area | Finding | Fix |
|---|---|---|---|
| should | Phone use | At 390x844 the result ("Estimated 1RM") starts at about y=820, under the fold. On a 667 px phone you scroll after every change to see the answer. | On phones show a slim sticky result bar (e1RM and next load) at the bottom, or move the result above the RPE grid. |
| should | SEO, crawlable text | The full chart (half steps, 7, 9, 11 reps) exists only as `<input value>`. Search engines index input values poorly. The article table covers whole RPE only (9 reps rows). | Add a plain read-only `<table>` of the full chart (collapsed in a `<details>`, or in the article), generated from `SERIES`. |
| should | SEO, headings | Two H2 with the same text "RPE chart: percent of 1RM" (chart section and article). The outline also starts with "Plan your next set" and "Your weights..." before the chart. | Rename the article H2 to "RPE chart for whole RPE values" or merge. Make the tool sub-headings H3 or non-heading text. |
| should | SEO, depth | About 1,500 words on the page, but the main query "rpe chart" is also asked as "rpe to percentage", "rir chart", "rpe 8 percentage". Only one URL exists. Missing sections: how to use RPE in a program (top set and back-off sets), RPE vs RIR vs percent training, a printable chart. | After launch, add /rir-chart/ and /rpe-to-percentage/ as short pages that link to the tool. Add a short "use it in a program" section. |
| should | JSON-LD | `applicationCategory: HealthApplication` (config). | `SportsApplication`. A SAFE training tool should not carry health markup. |
| should | Source trust | The page shows the RTS chart but not which version (see code-regression.md). Competitors that name no source are the weak spot we want to beat, and a visible version label is the cheapest way to win trust. | Add "RTS chart, <version>, copied from <source>" under the chart and near the result. |
| nice | Layout shift | CLS 0.039 on mobile: the RPE buttons and step buttons are built by JavaScript after load. | Render them in Astro HTML; let JS only set the checked state. |
| nice | Tap targets | FAQ summaries are 24 px tall (padding is on the `details`, not the `summary`). Footer links are 36 px. | `py-4` on `summary`, `py-3` on footer links. |
| nice | Print | No print style. The research names a print view as an edge. | `@media print`: show only the chart and the weights table. |
| nice | JSON-LD | BreadcrumbList has one item. FAQ rich results are rarely shown for non-government sites. | Remove the breadcrumb. Keep the FAQ (it is also real page content). |
| nice | No-JS | Without JavaScript the RPE and step choices are empty. The noscript note says the chart still reads. It does (inputs hold values). | Fine. Fixed for free if the buttons move to server HTML. |
| nice | Visual | Checked/pressed buttons shift 3 px (retro press effect), so rows look slightly uneven at 390 px. | Optional: use `box-shadow` instead of `transform`. |
| nice | Visual | Chart cells show `85` while sources show `85.0`. | Pick one format for chart, plan table and article table. |

Checked and fine
- Title: "RPE Chart: RPE to % of 1RM Calculator (lb & kg)" (51 characters). Meta description 150 characters, single H1, canonical https://rpechart.com/, OG image 1200x630 (looks good, its numbers are correct), Twitter card, `robots.txt`, sitemap (5 URLs), manifest, favicon SVG plus 32/192/512 PNG.
- JSON-LD parses: WebApplication, BreadcrumbList, FAQPage with 8 questions.
- Headings are in a sensible order after the first block; FAQ answers are real, short and match the page.
- Contrast: body text and muted text pass; focus rings are visible (3 px) in both themes; every chart cell has an `aria-label`; skip link; scroll regions are focusable.
- Dark theme: no flash on load, toggle persists, white text on brand blue passes.
- Tool beats the competitors on: editable chart, RIR switch, plate rounding, lb and kg, half steps, saved settings, no ads in the way (ad slot is off).

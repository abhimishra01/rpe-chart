# RPE chart and calculator

Free browser tool for rpechart.com. Editable RPE/RIR to percent-of-1RM chart (RTS chart, Tuchscherer), estimated 1RM from a set, target weights for other reps and RPE rounded to plates, lb and kg. Settings and chart edits are saved in the browser. No backend.

- `src/lib/rpe.js`: all math (pure). `tests/rpe.test.mjs`: known chart values and logic. Run `npm test`.
- `src/components/Tool.astro` (calculator, shared script), `Chart.astro` (editable chart), `Article.astro`, `src/data/faq.ts`.
- `npm run build` makes `dist/`. GitHub Pages: `.github/workflows/pages.yml` (base `/rpe-chart/`, noindex on that copy, canonical on the real domain).

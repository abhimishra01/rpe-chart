# Code review, minimalism lens: rpe-chart (Hermione)

Verdict: already small (about 1,100 lines of real code, 25 KB over the wire, no extra runtime dependency). A few dead rules and one needless duplicate remain. 0 must-fix.

Known template leftovers (not repeated): template README, new-tool.sh, tracked screenshots, duplicate legal links, build-date "Last updated", British spelling.

| Sev | Where | Finding | Why | Fix |
|---|---|---|---|---|
| should | public/.png | Stray 1280x720 file, never referenced. | Dead weight shipped to production. | Delete. |
| should | src/styles/skin-retro.css:38 | `#result-status` does not exist (the id is `e1rm-status`). | Dead rule, and the style it meant to give is missing. | Rename to `#e1rm-status` or delete. |
| should | skin-retro.css:30,36,44 | `main > section:first-child > p:first-child` (a hero pill that this page does not have), `.tbl thead th` and `#tool thead` match nothing on this site. | Template leftovers in a per-tool file. | Delete the three rules. |
| should | Tool.astro:273-274 | `cls` and `cls2` compute the same cell class in two steps with a repeated condition. | Hard to read for 4 lines of logic. | One line: `const c = [isSet && 'is-set', isAim && 'is-aim'].filter(Boolean).join(' ')`. |
| nice | Article.astro:43-48 and rpe.js:92-100 | The RPE meaning text lives twice (article table and `rpeMeaning`). | Two places to edit, and they already differ in wording ("The bar still moves fast" only in the article). | Build the article table from `rpeMeaning`. |
| nice | rpe.js:12-13,20-21 | `MIN_RPE`, `MAX_RPE`, `LB_PER_KG` are exported but used only inside the file. `rirToRpe` is used only by a test. | Unused public surface. | Drop `export` (and `rirToRpe`, or keep for the test only). |
| nice | skin-retro.css | The prefix `:root[data-skin="retro"][data-theme]` repeats about 45 times. | 2.5 KB of repeated selectors. | Use CSS nesting under one prefix. |
| nice | site.config.ts:11 | `tagline` is only used when `title` is empty, and `title` is set. | Unused field here. | Leave (template field) or remove. |
| nice | index.astro:29 | A BreadcrumbList with a single item. | Adds no value for search. | Remove. |

Checked and fine: no unused npm packages in the app code (only the template's `wrangler` as dev dependency), no jQuery or chart library, one script, no web fonts, no demo code from the template (no sourdough text anywhere).

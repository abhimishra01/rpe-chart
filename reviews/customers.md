# Mock-customer test: rpe-chart (Hermione)

Method: five US personas used the built page in a real browser (playwright-cli, own session) at the right viewport, typing real numbers and clicking. Results are the page's actual output.

## The five users

**Marcus, 28, powerlifter, Austin (desktop, 1280).** Types "rpe chart" and "rpe to percentage". Entered 315 lb x 3 @ RPE 9. Got 353.1 lb e1RM, 89.2 percent. Then planned 1 rep @ RPE 8: 92.2 percent, 325.6, shown as 325 lb. "Under 30 seconds, yes. The numbers match the RTS chart I printed two years ago for these cells. I would click this over FitnessVolt because the calculator is on top and the chart is editable. But I checked 12 reps at RPE 8 against the new RTS app and it said 67.6, you say 62.6. Which one is it? You do not say. I do not trust it for my hypertrophy blocks until you tell me the version. I would bookmark it for meet-week attempts, but I want a copy button for the plan."

**Jess, 24, beginner, Chicago (iPhone, 390x844).** Types "what is rpe in lifting". Entered 135 lb x 8 @ RPE 7. She read "RPE 7: Three reps left" under the buttons. Got 190.9 lb e1RM and 165 lb for 3 reps at RPE 8. "The big blue box is great, but I had to scroll down to find it after tapping my numbers. Done in about 40 seconds, not 30. The RIR text on each button helped me a lot. I do not know if 190 is real, there is no warning that 8 reps is a rough guess. I would come back if it remembered my last set. It does, I checked."

**Coach Mike, 45, high school strength coach, Texas (desktop, 1280, kg).** Switched to kg, 5 kg steps, typed 180 kg. Edited two chart cells (5 @ 8 to 80, 3 @ 9 to 90). The cells turned dashed, the note said "2 values are changed", and after a reload the edits and units were still there. "This is the first one where I can match my own chart. That is why I would bookmark it. Missing: print the weights table for my team, and a link that carries my edits to my assistant coach. And the 'Reset chart to RTS values' button should say which RTS."

**Jordan, 20, college student on a budget, Michigan (Android, 375x812, kg and RIR).** Types "rir to percentage chart". Switched to kg and RIR, typed 100 kg x 6 @ 2 RIR. Got 127.2 kg e1RM, then 110 kg for 3 reps @ 2 RIR with a 1 kg step. "Done in about 25 seconds. The RIR toggle changes everything, even the chart headers, which is what I wanted. The 1 kg step is nice because my gym has 1.25 kg plates. I would like 0.5 kg and 1.25 lb steps too. I trust it because it shows the percent next to the answer."

**Dan, 34, hypertrophy lifter, Denver (iPhone SE size, 375x667).** Types "how much can I lift for 12 reps". Entered 110 lb x 12 @ RPE 9. Got 168.5 lb e1RM, and 125 lb for 8 reps @ RPE 8. "On my phone I could not see the answer without scrolling, every time. And my 12-rep sets: 65.3 percent for 12 reps at 1 left feels low next to what my coach says, about 69 percent. Something is off for high reps. The FAQ says the estimate is better at 1 to 5 reps, but that is far from the result. A warning right under the result would help."

## Would they click it on Google?
Yes, 5 of 5, for the title and the visible calculator. Finished in under 30 seconds: Marcus, Jordan (2 of 5). Jess and Dan lost time scrolling on phones, Mike took longer because he edits cells. Would come back: 5 of 5. Would trust the answer: Jordan, Jess (2 of 5); Marcus, Mike and Dan want the source version first.

## Ranked change list
| Rank | Sev | Change | Personas |
|---|---|---|---|
| 1 | must | Name the chart version and source next to the chart and the result (and fix the "about 0.5 percent" claim). Resolve the high-rep values (see code-regression.md). | 3 (Marcus, Mike, Dan) |
| 2 | should | Keep the result visible on phones: sticky result bar or result above the RPE grid. | 3 (Jess, Jordan, Dan) |
| 3 | should | A note under the result when reps are above 5 or RPE is below 8: "The estimate is less reliable here." | 2 (Jess, Dan) |
| 4 | should | Print view and a share or copy button (plan and chart, with edits in the link). | 2 (Marcus, Mike) |
| 5 | should | More rounding steps: 0.5 kg and 1.25 lb. | 1 (Jordan) |
| 6 | nice | Warm-up and back-off sets from the e1RM (for example a "-10 percent" row). | 1 (Marcus) |
| 7 | nice | Show the percent in the weights table (a toggle). | 1 (Mike) |

Top 5: (1) name the chart version and fix the values and claims, (2) result visible on phones, (3) reliability note for high reps, (4) print and share, (5) 0.5 kg and 1.25 lb steps.

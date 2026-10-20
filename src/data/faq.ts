// FAQ items. Rendered on the home page AND output as FAQPage JSON-LD. Plain text only.
export const faq = [
  { q: 'What does RPE mean in lifting?', a: 'RPE means rate of perceived exertion. It is a score from 1 to 10 for how hard a set felt. RPE 10 means you had no reps left. RPE 8 means you could have done about 2 more reps.' },
  { q: 'What is the difference between RPE and RIR?', a: 'They describe the same thing in two ways. RIR is reps in reserve, the number of reps you had left. RPE is 10 minus RIR. So 2 RIR is RPE 8, and 0 RIR is RPE 10. Use the RIR switch if you think in reps left.' },
  { q: 'How do I convert RPE to a percentage of 1RM?', a: 'Find your reps and your RPE on the chart. The cell shows the share of your 1RM. For example, 5 reps at RPE 8 is 81.1 percent. Divide your weight by 0.811 to estimate your 1RM.' },
  { q: 'How do I find the weight for 3 reps at RPE 8?', a: 'Enter a recent hard set to get your estimated 1RM. Then pick 3 reps and RPE 8 under "Plan your next set". The chart gives 86.3 percent, and the tool multiplies it by your 1RM and rounds to your plates.' },
  { q: 'Is this the Tuchscherer RPE chart?', a: 'Yes. The values are the commonly shared RPE chart of Mike Tuchscherer of Reactive Training Systems. Some copies of the chart differ by about 0.5 percent in a few cells. You can edit any value here to match your coach.' },
  { q: 'How accurate is an RPE-based 1RM?', a: 'It is an estimate. It depends on how well you judge your effort. Ratings tend to be better on heavy sets close to failure and for lifters with more practice. A set at RPE 9 or 10 with 1 to 5 reps gives the most reliable estimate.' },
  { q: 'Why does the weight round up or down?', a: 'The tool rounds to the smallest jump your plates can make. That is two of your smallest plates, one on each side. Pick 2.5, 5 or 10 lb, or 1, 2.5 or 5 kg, under "Round to the nearest".' },
  { q: 'Can I change the chart values?', a: 'Yes. Click any number in the chart and type your own. The calculator uses your value at once. Your changes stay on your device, and one button resets the chart.' },
];

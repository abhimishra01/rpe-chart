// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
const config = {
  name: 'RPE Chart',                 // shown in header, title, footer
  domain: 'rpechart.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'rpe-chart',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'RPE chart',              // main keyword (search phrase)
  keywords: ['RPE chart', 'RPE calculator', 'RPE to percentage', 'RIR chart', 'RPE to 1RM', 'estimated 1RM from RPE'],
  h1: 'RPE chart and calculator',    // visible page heading
  title: 'RPE Chart: RPE to % of 1RM Calculator (lb & kg)', // home page title, under 60 chars
  tagline: 'Free and fast',
  description:
    'Editable RPE chart with RIR. Enter weight, reps and RPE to get your estimated 1RM and the weight for any other reps and RPE, rounded to plates.',
  email: 'hello@rpechart.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#0369a1',                   // brand color (hex)
  skin: 'retro',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',
  category: 'SportsApplication',   // schema.org applicationCategory
  owner: 'RPE Chart',                // name used in legal pages (person or business)
};

// Bingemind build (SITE_MODE=bingemind): the tool lives at https://bingemind.com/<slug>/.
// Canonical URLs point there in every build, including the GitHub Pages preview.
const bingemind = typeof process !== 'undefined' && process.env.SITE_MODE === 'bingemind';
const slug = config.cloudflareProject;
export default {
  ...config,
  bingemind,
  slug,
  canonicalBase: `https://bingemind.com/${slug}`,
  host: bingemind ? `bingemind.com/${slug}/` : config.domain,
  owner: bingemind ? 'Bingemind' : config.owner,
  // No invented mailbox: Bingemind builds link to the Bingemind contact section.
  contactHref: bingemind ? 'https://bingemind.com/#contact' : `mailto:${config.email}`,
  contactLabel: bingemind ? 'bingemind.com/#contact' : config.email,
};

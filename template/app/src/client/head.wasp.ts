import { type App } from "@wasp.sh/spec";

export const head: App["head"] = [
  "<link rel='icon' href='/favicon.ico' />",

  "<meta name='description' content='Cadence turns a messy to-do list into a realistic, prioritized schedule in seconds.' />",
  "<meta name='author' content='Cadence' />",
  "<meta name='keywords' content='ai planner, day planner, scheduling, productivity, saas' />",

  "<meta property='og:type' content='website' />",
  "<meta property='og:title' content='Cadence - The AI day planner' />",
  "<meta property='og:site_name' content='Cadence - The AI day planner' />",
  "<meta property='og:url' content='https://your-saas-app.com' />",
  "<meta property='og:description' content='Cadence turns a messy to-do list into a realistic, prioritized schedule in seconds.' />",
  "<meta property='og:image' content='https://your-saas-app.com/public-banner.webp' />",
  "<meta name='twitter:image' content='https://your-saas-app.com/public-banner.webp' />",
  "<meta name='twitter:image:width' content='800' />",
  "<meta name='twitter:image:height' content='400' />",
  "<meta name='theme-color' content='#09090b' media='(prefers-color-scheme: dark)' />",
  "<meta name='theme-color' content='#ffffff' media='(prefers-color-scheme: light)' />",
  "<meta name='twitter:card' content='summary_large_image' />",
  // TODO: You can put your Plausible analytics scripts below (https://docs.opensaas.sh/guides/analytics/):
  // NOTE: Plausible does not use Cookies, so you can simply add the scripts here.
  // Google, on the other hand, does, so you must instead add the script dynamically
  // via the Cookie Consent component after the user clicks the "Accept" cookies button.
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.js'></script>", // for production
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.local.js'></script>", // for development
];

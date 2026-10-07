import { type App } from "@wasp.sh/spec";

export const head: App["head"] = [
  "<link rel='icon' href='/favicon.ico' />",

  "<meta name='description' content='Supplyr scores your suppliers on price, quality, delivery time and risk, so you can choose with confidence.' />",
  "<meta name='author' content='Supplyr' />",
  "<meta name='keywords' content='supplier analysis, supplier comparison, procurement, supplier scoring, saas' />",

  "<meta property='og:type' content='website' />",
  "<meta property='og:title' content='Supplyr - Supplier decisions, backed by data' />",
  "<meta property='og:site_name' content='Supplyr - Supplier decisions, backed by data' />",
  "<meta property='og:url' content='https://your-saas-app.com' />",
  "<meta property='og:description' content='Supplyr scores your suppliers on price, quality, delivery time and risk, so you can choose with confidence.' />",
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

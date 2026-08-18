import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://themanagedmac.com',
  output: 'static',
  integrations: [sitemap()],
});

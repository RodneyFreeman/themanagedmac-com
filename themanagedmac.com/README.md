# The Managed Mac — themanagedmac.com

A professional blog/site for an Applications & Systems Administrator
(Carmel, IN) focused on Apple device management — MDM, Apple Business
Manager, scripting/automation, and security compliance.

Built with [Astro](https://astro.build) (static output) and designed to
deploy on **Cloudflare Workers** via a **GitHub-connected repo**.

## Design

- **Style:** Apple-inspired — white/light-gray base, system font stack
  (`-apple-system`), restrained Apple-blue accent (`#0071e3`), generous
  whitespace, pill buttons, soft shadows, 12–18px rounded corners.
- **Design tokens** live in `src/styles/global.css` as CSS custom
  properties — colors, spacing scale, radii, shadows, typography. Includes
  an automatic dark mode via `prefers-color-scheme`.
- **Sections:** Home, Blog (with tags + RSS), Resources library
  (categorized guides), About, Contact.

## Project structure

```
src/
  components/     Header, Footer, PostCard, ResourceCard
  layouts/        BaseLayout (SEO/meta), PostLayout (blog post chrome)
  pages/          index, blog/, resources/, about, contact, 404, rss.xml.js
  content/
    blog/         Markdown blog posts (Astro content collection)
    config.ts     Blog collection schema
  styles/
    global.css    Design tokens + base styles
public/           Static assets (favicon, robots.txt, og-default.png)
wrangler.toml     Cloudflare Workers static-assets deploy config
astro.config.mjs  Astro config (site URL, sitemap integration)
```

## Local development

This site was scaffolded and code-reviewed in a network-isolated
environment, so the build has **not yet been run end-to-end**. Do this
first, on a machine with normal internet access:

```bash
npm install
npm run dev       # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Fix anything `npm install`/`npm run build` surface (dependency version
drift is the most likely issue, since this was scaffolded against
Astro 5.2.5, @astrojs/sitemap 3.2.1, and @astrojs/rss 4.0.11 — bump
`package.json` if npm resolves newer versions and something breaks).

## Adding a blog post

Add a new Markdown file to `src/content/blog/`:

```markdown
---
title: "Post title"
description: "One or two sentence summary for cards, RSS, and SEO."
pubDate: 2026-08-18
tags: ["MDM"]
---

Post content in Markdown.
```

It'll automatically appear on `/blog/`, in the RSS feed, and get its own
page at `/blog/<filename-slug>/`.

## Editing content

- **Resources library:** edit the `categories` array in
  `src/pages/resources/index.astro`.
- **Home page featured resources / focus areas:** edit
  `src/pages/index.astro`.
- **About/Contact copy:** `src/pages/about.astro`, `src/pages/contact.astro`
  — update the email address and social links (currently placeholders).
- **Social preview image:** replace `public/og-default.png` (1200×630).

## Deploying to Cloudflare Workers via GitHub

1. **Push this repo to GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/themanagedmac.com.git
   git push -u origin main
   ```

2. **Connect it in Cloudflare.**
   In the Cloudflare dashboard: **Workers & Pages → Create → Import a
   repository (Connect to Git)**. Select the `themanagedmac.com` repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - (Cloudflare auto-detects most of this from `wrangler.toml`.)

3. **Attach the domain.**
   Since `themanagedmac.com` is already on this Cloudflare account:
   Worker → **Settings → Domains & Routes → Add → themanagedmac.com**.
   Cloudflare creates the DNS record automatically.

4. **Every push to `main` redeploys** — Cloudflare's Git integration
   (Workers Builds) runs `npm install`, `npm run build`, and
   `wrangler deploy` on each commit.

### Manual deploy (alternative to Git integration)

```bash
npm install -g wrangler   # or use npx
wrangler login
npm run deploy             # build + wrangler deploy
```

## Notes on `wrangler.toml`

This uses Cloudflare Workers' **static assets** feature (no server-side
Worker script needed) — `[assets] directory = "./dist"` serves the Astro
static build directly, with `not_found_handling = "404-page"` so
`dist/404.html` (generated from `src/pages/404.astro`) is served for
unmatched routes.

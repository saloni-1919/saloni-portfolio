Saloni Portfolio V4.4 build & security fix — 2026-11-19

Fixes:
  1. app/robots.js: force-static so Next.js can export robots.txt
  2. app/sitemap.js: force-static so Next.js can export sitemap.xml
  3. app/globals.css: flex-end instead of end for flexbox alignment
  4. package.json: PostCSS >=8.5.23 via npm overrides (compatible major v8); fixes known advisory versions without forcing an untested Next.js v16 migration

For the small update zip:
  - Stop dev server (Ctrl+C).
  - Extract to the ROOT of your existing V4.4 project, replacing matching files.
  - Make sure package.json is at this root.

On Windows, in that folder:
  npm install
  npm run check
  npm audit
  npm run build

Expected: Next.js should no longer reject /robots.txt static export. If additional errors arise, share the new terminal output. npm audit must be checked again after installation.

The complete ZIP contains the full V4.4 source with the same four fixes. Production build not executed by the authoring environment because npm registry dependencies were unavailable.

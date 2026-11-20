# Saloni Nathani — Cinematic Portfolio V4.4 (GitHub Pages)

A complete Next.js 15 portfolio for Saloni Nathani, using the **original Version 3 black / charcoal / orange cinematic theme**. It is a separate implementation inspired by the reference, not a clone of its copyrighted artwork.

**GitHub Pages is fully static**: no paid hosting, database, API server, secrets, or server-side rendering required. GitHub Actions builds and publishes the website automatically.

## What is included

- Cinematic animated homepage: Three.js wireframe, Lenis smooth scrolling, GSAP scroll-triggered entrances, subtle card expansion and warm hover glows (respects reduced-motion preferences).
- Four individually illustrated featured projects: BioSum Reliable, KPI Decision Agent, Web Trend Intelligence, and NLP Sentiment API; case-study routes work on GitHub Pages.
- **Unified Work + GitHub section**, with four featured case studies and all public GitHub repositories together (including forks and archived projects), retrieved directly from Saloni's public GitHub API at runtime. A build-generated backup (`public/github-feed.json`) is used when the public API is unavailable.
- **Redesigned Tableau spotlight**: a large selected report with elegant thumbnail cards, next/previous controls, search on the Dashboards page, and an interactive full-screen modal. No forced autoplay or horizontal scrolling.
- **Saloni’s original, unmodified photo** in the previously empty About portrait square; stored locally at `public/images/saloni-about-original.jpg` (no face regeneration or background replacement).
- **Interactive Tableau Public Dashboards** section, with SaaS Customer Churn & Revenue Retention as the main display. The Airline Operations and E-Commerce Pricing Strategy dashboards are pinned next. Newly public Tableau workbooks are discovered at build time by `scripts/sync-tableau.mjs` (see automatic updates below).
- Resume-based skills, experience, home-page education, professional development, a single Scholar Award recognition card (with the academic medal noted in its description), and both research publications inside Recognition. A new Certifications section correctly shows that credentials are in progress without inventing any.
- Search and filters, individual project pages, Notes, About, Recognition, and contact email/LinkedIn links.
- GitHub Actions deployment, base-path support, SEO metadata, and a sitemap.

### 1. Run it locally (Windows / PowerShell)

Extract the ZIP. **Open the folder that contains `package.json`**, rather than an extra enclosing folder. From that folder in VS Code Terminal:

```powershell
npm install
npm run check
npm run dev
```

Visit **http://localhost:3000**. All three pinned Tableau dashboards will load even if the automatic discovery endpoint is unavailable during local setup.

Optional, when online, to refresh cached public data locally:

```powershell
npm run sync:tableau
npm run sync:github
```

To check a static production build:

```powershell
npm run build
```

The generated static site goes into `out/`.

### 2. Create your GitHub Pages repository

1. Sign into the GitHub account **where the website should be hosted** (it can be Saloni's account or your own).
2. Create a **new public repository**, for example `saloni-portfolio`. Do **not** add a README/LICENSE/gitignore at creation since the ZIP already contains them.
3. Open the project folder (the one with `package.json`) in VS Code. Run:

```powershell
git init
git add .
git commit -m "Publish Saloni's portfolio V4.4"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/saloni-portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with the GitHub account you used. If you choose a different repository name, replace `saloni-portfolio` in the remote URL too. On Windows, you may need Git for Windows installed and to authenticate with GitHub.

4. In your GitHub repository, open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. Open the **Actions** tab. The workflow **Deploy Saloni portfolio to GitHub Pages** builds the Next.js static export and publishes it. If it didn't start, use its **Run workflow** button.
6. Once the deployment succeeds, open the page at:

```
https://YOUR_USERNAME.github.io/saloni-portfolio/
```

The workflow **automatically detects your repository name** and configures Next.js `basePath`. For a special repository named `YOUR_USERNAME.github.io`, the site lives at `https://YOUR_USERNAME.github.io/` without a subfolder.

**Important:** Never push `node_modules`, `.next`, `.env.local`, or any API keys. `.gitignore` excludes these. Only committed source files are required.

### 3. Automatic new dashboards

When Saloni publishes a **new visible public Tableau workbook**:

- GitHub Actions re-checks her Tableau Public profile at approximately **01:17, 07:17, 13:17, and 19:17 UTC** each day (not guaranteed to run at the exact minute).
- `scripts/sync-tableau.mjs` discovers the visible Tableau Public workbooks and writes `public/tableau-feed.json` into the deployment artifact.
- GitHub Pages publishes the updated dashboard gallery automatically. The three user-selected dashboards remain pinned at the top.
- If Tableau's unofficial public workbook-list endpoint is unavailable or changes, the three pinned reports still appear. The status in the gallery indicates the discovery issue.
- **GitHub scheduled workflows can be delayed or disabled due to inactivity**, especially in public repositories without activity for a long time. You can always open **Actions → Deploy Saloni portfolio to GitHub Pages → Run workflow** to refresh immediately, or push an update.

The public Tableau workbook listing is an unofficial endpoint; new dashboard discovery is best effort, *not* a guaranteed real-time feed. It requires no Tableau login or private credentials.

For **existing dashboards** that get updated on Tableau Public, the embedded Tableau report will show Tableau's currently published version when loaded.

### 4. Automatic new GitHub repositories

On every page visit, the portfolio queries the public GitHub REST API. New public repositories should appear without a deployment. If the API is rate limited, it displays the last snapshot from the latest successful site deployment (plus a direct link to Saloni's GitHub).

### 5. Edit portfolio content

| What to change | File |
| --- | --- |
| Name, about, skills, education, Scholar Award, certifications, jobs, publications, featured projects | `data/site.json` |
| Research paper PDFs | `public/papers/` (see instructions below) |
| Four project illustrations | `public/images/projects/*.webp` |
| Homepage layout | `app/page.jsx` |
| Tableau gallery layout | `components/TableauGallery.jsx` |
| Tableau pinned report URLs / priority | `data/site.json` → `tableau.featured` |
| Colors, typography, image treatment | `app/globals.css` |
| GitHub Pages automation | `.github/workflows/deploy-pages.yml` |

After editing, run `npm run check`, then commit and push:

```powershell
git add .
git commit -m "Update portfolio content"
git push
```

The GitHub Actions workflow will redeploy automatically.

### 6. What GitHub Pages cannot run

GitHub Pages **cannot host Next.js API routes, password-protected admin editing, server-side analytics, or a Resend email backend**. The former `/admin` page and `/api/*` server functions were intentionally removed in this GitHub Pages edition. To edit content, update `data/site.json` and push to GitHub; the Contact page uses a standard `mailto:` link and LinkedIn rather than a nonfunctional form. No visitors' form submissions are collected.

If you later need an admin dashboard or backend email form, use an external service or move this code to a platform that can run server functions.

### 7. Publishing checks

- Confirm Saloni's preferred public title at **Kappium LLC**. Her two supplied resumes use different titles; this edition combines them into **one role**.
- Confirm her exact Pace gold-medal wording and Scholar Award details.
- Confirm that Saloni is comfortable listing her professional contact email publicly. The resume phone number is **not** on the website.
- Verify that all Tableau dashboards contain only nonconfidential data: Tableau Public dashboards are public.
- `npm run check` verifies the source/content; a production deployment must still pass a Next.js build in GitHub Actions.

### 8. Troubleshooting

- **`ENOENT package.json`**: you are in the wrong folder. Run `Get-ChildItem -Recurse -Filter package.json -File` then `cd` to its containing folder.
- **Missing assets/404 on GitHub Pages**: make sure `.github/workflows/deploy-pages.yml` built successfully and Pages **Source = GitHub Actions**. The workflow sets `NEXT_PUBLIC_BASE_PATH` automatically.
- **Local development without internet**: the three featured Tableau links and four locally packaged project images still exist; GitHub live repository listing may be unavailable.
- **Tableau not appearing automatically**: check GitHub Actions **Discover new Tableau Public dashboards** logs and whether the new workbook is publicly visible.
- **Cannot find website**: your site lives under `/<repository-name>/`, unless the repository is named `<username>.github.io`.

## License & credits

This portfolio contains original implementation and custom artwork. See `LICENSE`. Its design direction was inspired by [5araang's open-source portfolio](https://github.com/5araang/Nextjs-cinematic-portfolio), but the creator's assets are not bundled. Respect any third-party image, font and service licenses when extending it.


## Research-paper PDFs (add when available)

Place the actual PDFs under `public/papers/` using **exactly** these filenames:

```text
public/papers/iceri-2025-data-pipelines.pdf
public/papers/ijarsct-2024-sign-language-interpreter.pdf
```

The PDFs are **not** included yet. Recognition cards show “PDF TO BE UPLOADED” until the corresponding PDF is present. Once uploaded, clicking each paper opens it in a new tab. Confirm you have the right to publicly host each PDF before committing it to GitHub.

To publish the PDFs later:

```powershell
git add public/papers
git commit -m "Add research paper PDFs"
git push
```

## V4.4 — Unified Work, editorial dashboards and motion polish (current)

- **Work + GitHub are one section.** The homepage shows four featured projects, followed by a compact preview of the public GitHub archive within the same Work section. The `/projects` page contains the full searchable/filterable gallery, with no duplicate GitHub homepage section.
- **Dashboards are no longer an auto-scrolling carousel.** Choose among reports using a responsive thumbnail grid, or use previous/next arrows. The large spotlight shows the selected report; clicking **Explore Interactive Report** opens Tableau in an accessible modal. SaaS Customer Churn & Revenue Retention remains selected first; new public workbooks are still discovered by the scheduled GitHub Actions build.
- **Cinematic scroll and hover polish.** Existing Framer Motion reveals remain, with GSAP adding lightweight entrance animations to sections, resume rows, education cards and other content. Interactive cards and buttons get a restrained expand/lift and orange border glow. Animation is reduced/disabled for users requesting reduced motion.
- **No changes to personal details, photo, publications, project artwork, GitHub Pages workflow, PDF upload paths, or certifications.**

To update an existing V4.3 install, use the V4.4 update archive (copy and replace matching files). Alternatively, extract the complete V4.4 ZIP into a new folder. Run `npm install` if dependencies are absent, then `npm run check`, `npm run dev` and finally `npm run build` before deploying. The ZIP root contains `package.json` directly.

**Build note:** Source validation is performed here, but a full Next.js production build requires npm packages to be installed on your machine or in GitHub Actions.

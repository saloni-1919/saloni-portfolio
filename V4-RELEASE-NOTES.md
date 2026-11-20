# V4 GitHub Pages release

- Retains V3 charcoal / orange cinematic design and all resume-backed content.
- Unique real project illustration for each of the four featured projects.
- New homepage feature and full `/dashboards` Tableau gallery, with SaaS Retention as the pinned main report.
- Tableau Public discovery at *build time* on GitHub Actions schedule, fallback to the three supplied reports.
- GitHub repository gallery from the browser with API access and a snapshot fallback.
- Next.js `output: 'export'`, automated GitHub Pages `basePath` handling and static case-study routes.
- Removes unsupported server-only admin, contact POST, analytics API, and Supabase/Resend dependencies. Contact remains by email/LinkedIn.

Build caveat: Tested code structure, JSON, JavaScript/JSX syntax and CSS parsing in this authoring environment. Full `npm install && npm run build` requires network-enabled npm installation in the user's machine or GitHub Actions.

# Optional: Build using the *exact* 5araang template

The self-contained project in the parent directory is ready for local development. If you want **precisely the reference site's theme, source components, admin UI and video-scroll framework**, you can instead run:

```bash
node extras/apply-original-template.mjs
```

This creates a sibling folder named `saloni-original-template` by cloning the original MIT-licensed GitHub project at runtime, then makes a **first-pass** update to the Hero, About, Work, Contact, Footer, Navbar, and SEO layout. The original code, framework and features remain intact.

Open `saloni-original-template/SALONI-CUSTOMIZATION.md` and `SALONI-REVIEW-FILES.txt` for review before running. The original code still needs the creator's personal videos/images removed and replaced, admin credentials configured, and all hardcoded content audited. It is **not ready for public deployment without that review**. Follow the upstream `INSTALL.md` to install dependencies and configure Supabase/Resend as needed.

The adapter requires working internet access and Git. It intentionally doesn't bundle third-party video/photo content or claim that Saloni owns it. The upstream repository remains governed by the original MIT license (retained during clone).

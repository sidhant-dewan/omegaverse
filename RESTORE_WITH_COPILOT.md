

## Copilot prompt

```text
You are restoring an existing, complete Next.js application named ShakchiVerse on a new laptop. Work directly in the currently opened project folder and handle the restoration end to end. Do not scaffold a new project, replace the application, simplify it, or remove features. The source archive intentionally excludes dependencies, build output, Git history, and secrets because they are reproducible or machine-specific.

Before making changes:
1. Read AGENTS.md and follow its Next.js instructions. This project uses Next.js 16.3.0, whose APIs may differ from older versions. If you need to change Next.js code, consult the relevant local guide under node_modules/next/dist/docs after dependencies are installed.
2. Inspect package.json, package-lock.json, .env.example, README.md, next.config.ts, data/catalog.generated.json, and the existing app structure.
3. Treat the current source files and generated catalog as authoritative. Do not regenerate the app from a template and do not replace package-lock.json.

Restore the development environment:
1. Check whether Node.js 22 and npm are installed. Report the detected versions. If Node.js 22 is missing, give me the appropriate installation command for this operating system and continue after it is available. Do not use sudo or request a password through chat.
2. Run `npm ci` from the project root. Use the existing package-lock.json for a deterministic installation. Do not use `npm install` unless `npm ci` fails because the lockfile is genuinely inconsistent, and explain before changing it.
3. If `.env.local` does not exist, create it from `.env.example`. The bundled catalog works without an API key. Never print, commit, archive, or ask me to paste a TMDB key into chat. If I want metadata refresh later, tell me to enter `TMDB_API_KEY` directly in `.env.local` myself.
4. Keep these safe defaults unless I provide a deployment URL:
   - `TVMAZE_ENABLED=false`
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Validate the complete application:
1. Run `npm run lint` and fix only restoration-related errors.
2. Run `npm run build`. The expected healthy build generates approximately 457 routes/pages, including 50 title pages and person pages.
3. Do not run `npm run refresh:metadata` during basic restoration. The committed `data/catalog.generated.json` already contains real metadata, images, and regional watch-provider data. Refreshing requires a private TMDB key and can change the cache.
4. Confirm that `data/catalog-curated.json` and `data/catalog.generated.json` are present and valid JSON.
5. Confirm that the ABO Desire record exists and has cached watch providers. This is a quick check that the generated catalog survived transfer.

Start and test the app:
1. Run `npm run dev` as a persistent development server.
2. If port 3000 is occupied, use another available port and clearly give me the URL.
3. Open the app in the browser and verify at minimum:
   - `/` loads the ShakchiVerse home experience.
   - `/explore` shows catalog filters and discovery tools.
   - `/title/abo-desire` shows real metadata, poster/backdrop, Where to Watch providers, the “Want to watch it for free?” banner, and the romantic Sidhant message.
   - `/my-list` loads the browser-local watchlist interface.
4. Check desktop and mobile layouts for obvious overflow or broken images.

Preserve all existing product behavior:
- ShakchiVerse branding and the personalized message for Shakchi.
- BL, GL, and Omegaverse categories and multi-category titles.
- The 50-title real catalog, TMDB images and metadata, cast/person pages, recommendations, search, filters, random picker, airing/upcoming views, charts, taxonomy pages, and suggestions.
- Legitimate region-aware Where to Watch entries sourced through TMDB/JustWatch, including attribution.
- Browser-local watchlist, favorites, status, episode progress, and cross-tab synchronization.
- The funny romantic Sidhant free-watch banner and invitation.
- Discovery and metadata scripts under scripts/ and the GitHub Actions workflow.
- Vercel Hobby-compatible architecture with no database or required always-on backend.

Important constraints:
- Do not expose or commit secrets. `.env.local` must remain ignored.
- Do not invent provider links or add unauthorized streaming sites.
- Do not delete `data/catalog.generated.json`; normal browsing must work without TMDB access.
- Do not upgrade dependencies during restoration. Use the locked versions first.
- Do not delete or rewrite working features merely to make the build pass.
- Do not initialize Git or push to a remote unless I explicitly request it.
- Avoid unrelated refactoring and formatting churn.

Optional metadata refresh, only after the base app works and only if I explicitly request it:
1. Ask me to place `TMDB_API_KEY` directly into `.env.local` without sharing it in chat.
2. Run `npm run refresh:metadata`.
3. Confirm 50 verified records were generated and provider URLs point only to legitimate TMDB watch pages.
4. Rerun lint and build.

When finished, provide a concise restoration report containing:
- Node and npm versions.
- Dependency installation result and vulnerability count.
- Lint and build results.
- Number of generated pages.
- Browser routes checked.
- Local development URL.
- Any action I still need to perform, especially entering the TMDB key for optional refresh or setting the production site URL before Vercel deployment.

Stay with the task until installation, validation, server startup, and browser checks are complete. If a command fails, diagnose the actual error and attempt a focused fix rather than stopping after the first failure.
```

## Manual fallback

If Copilot is unavailable, the minimum restoration commands are:

```bash
npm ci
cp .env.example .env.local
npm run lint
npm run build
npm run dev
```


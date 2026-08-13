# ShakchiVerse

**Made for Shakchi, because every story is better when I’m watching it with you.** ShakchiVerse is a personal discovery and tracking application for BL, GL, and Omegaverse series, films, and web series. It combines catalog browsing, airing and release schedules, rankings, legitimate provider links, deterministic recommendations, and a private browser-based watchlist.

V1 is intentionally designed for a Vercel Hobby account: no database, authentication service, queue, container, or always-on process is required.

> The bundled catalog contains 50 real productions. TMDB supplies descriptive metadata, images, cast, ratings, and release data; categories and tropes are manually curated and should be reviewed periodically.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript
- Tailwind CSS 4 plus a small global design layer
- React Server Components by default
- `localStorage` for watch status, favorites, and episode progress
- TMDB behind a normalized metadata provider; optional TVmaze schedule enrichment
- GitHub Actions for daily candidate discovery and review pull requests

## Local setup

Requirements: Node.js 22 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No API key is required for the bundled catalog.

Validation commands:

```bash
npm run lint
npm run build
```

## Move to another laptop

Create a compact source archive on macOS or Linux:

```bash
npm run archive:portable
```

The archive is written beside the project at `shakchiverse-portable/vercel-source.zip`. It keeps the complete application, current generated catalog, assets, scripts, and lockfile while excluding `node_modules`, `.next`, Git history, caches, and local environment files. Those excluded folders account for nearly all local disk usage and are recreated when needed.

On the other laptop, install Node.js 22, extract the ZIP, open its project folder, and run:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The bundled catalog works immediately without credentials. To refresh TMDB metadata and regional provider availability, add the TMDB key to `.env.local` and run:

```bash
npm run refresh:metadata
```

Never place a real API key in the ZIP. Move it separately with a password manager or enter it again on the destination laptop.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `TMDB_API_KEY` | No for the site; yes for discovery | Server-side TMDB metadata and candidate discovery |
| `TVMAZE_ENABLED` | No | Set to `true` to allow schedule enrichment |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Canonical, Open Graph, robots, and sitemap origin |

Never prefix the TMDB key with `NEXT_PUBLIC_`; it must remain server-side. Add `TMDB_API_KEY` as a GitHub Actions secret and a Vercel environment variable only when external metadata is enabled.

## Routes

- `/`, `/bl`, `/gl`, `/omegaverse`: home and category discovery
- `/explore`: URL-backed category, country, type, status, genre, trope, year, and rating filters plus random picker
- `/title/[slug]`, `/person/[slug]`: title and person details
- `/airing`, `/upcoming`, `/charts`, `/search`: recurring discovery tools
- `/my-list`: private local watchlist and episode progress
- `/country/[slug]`, `/genre/[slug]`, `/trope/[slug]`: taxonomy browsing
- `/suggest`: creates structured suggestion JSON without sending data to a backend

## Category and data model

`ContentCategory` is `"bl" | "gl" | "omegaverse"`, while every title stores `categories: ContentCategory[]`. A title can therefore be both BL and Omegaverse. Categories, genres, and tropes are independent fields and filters.

Internal models live in `types/index.ts`. Human-reviewed title selections live in `data/catalog-curated.json`, the refresh command writes `data/catalog.generated.json`, and `lib/data/catalog.ts` serves that cache. UI code consumes normalized records and does not call metadata APIs directly.

Approved external catalog references belong in `data/catalog.json`:

```json
{
	"tmdbId": 123456,
	"categories": ["bl", "omegaverse"],
	"verified": true
}
```

Keep curation fields such as categories, tropes, and verified provider URLs under editorial control. Refresh external descriptive metadata through the provider layer instead of copying large API payloads into the repository.

## Discovery and classification

Run the complete workflow locally with:

```bash
npm run catalog:daily
```

The steps are:

1. `discover-titles.ts` searches recent metadata using explicit discovery terms and prioritized country codes.
2. `score-candidates.ts` applies explainable BL, GL, and Omegaverse signals.
3. `generate-candidate-report.ts` writes `data/candidate-report.md`.
4. `.github/workflows/discover.yml` opens or updates a review pull request daily.

Classification only prioritizes review. It never publishes a title. Omegaverse requires explicit setting evidence and human verification; gender or romance type alone is never used to infer it.

### Approve a candidate

1. Verify the production against official sources.
2. Add its minimal TMDB reference, one or more categories, and `verified: true` to `data/catalog.json`.
3. Add editorial fields that external providers cannot reliably supply, especially tropes, Omegaverse classification, and authorized provider URLs.
4. Remove the item from `data/candidates.json` and run lint/build before merging.

### Reject a candidate

Add its numeric external ID to `data/rejected.json`, remove it from `data/candidates.json`, and commit both changes. Future discovery runs suppress that ID.

### Add a title manually

Perform the same official-source verification, add the minimal catalog reference, and classify categories/genres/tropes separately. For a record without an external ID, add a normalized `Title` through the local data adapter until database storage is introduced.

### Refresh metadata

```bash
npm run refresh:metadata
```

The current V1 command validates approved references. Runtime provider functions cache public requests and always fall back to local records when credentials or APIs are unavailable.

## GitHub Actions

Add `TMDB_API_KEY` under **Repository Settings → Secrets and variables → Actions**. The workflow uses the built-in `GITHUB_TOKEN`, grants only contents and pull-request write permissions, has a ten-minute timeout, and never prints the key. It creates the `automation/shakchiverse-candidates` branch and a labeled review PR.

## Deploy to Vercel

1. Push the repository to GitHub and import it at `vercel.com/new`.
2. Keep Framework Preset as Next.js and all default build settings.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://…vercel.app` or custom domain.
4. Optionally add `TMDB_API_KEY` and `TVMAZE_ENABLED`; redeploy after changing variables.
5. Confirm `/robots.txt`, `/sitemap.xml`, a title page, and My List in production.

The watchlist is browser- and device-specific. Clearing site data removes it. This is a deliberate V1 tradeoff; the storage module can later be replaced by a Supabase/PostgreSQL repository without changing title components.

## Adding a category

Extend `ContentCategory`, add a label/badge color, include it in navigation and filter options, then update classification signals only if automated candidate prioritization is appropriate. Because titles already use arrays, multi-category records need no migration.

## Current limitations

- TMDB coverage and translations vary by production; category and trope curation remains editorial work.
- There is no cross-device sync or account system.
- Suggestions produce JSON for manual submission and are not transmitted.
- External provider availability and regional rights require ongoing human verification.
- TMDB keyword discovery can miss productions with sparse metadata; Omegaverse remains primarily curated.

The next practical production step is adding verified regional streaming-provider links and periodically reviewing category/trope classifications. Supabase should only be introduced when cross-device watchlists or an editorial dashboard justify it.

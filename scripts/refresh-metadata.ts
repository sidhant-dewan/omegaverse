import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ContentCategory, Title, TitleStatus, WatchProvider } from "../types";

interface CatalogEntry { query: string; tmdbId?: number; type: "tv" | "movie"; year: number; categories: ContentCategory[]; tropes: string[]; }
interface SearchItem { id: number; name?: string; title?: string; first_air_date?: string; release_date?: string; }
interface Details extends SearchItem {
  original_name?: string; original_title?: string; overview?: string; poster_path?: string; backdrop_path?: string;
  genres?: Array<{ name: string }>; production_countries?: Array<{ iso_3166_1: string; name: string }>; origin_country?: string[];
  original_language?: string; status?: string; vote_average?: number; vote_count?: number; popularity?: number;
  number_of_episodes?: number; episode_run_time?: number[]; runtime?: number; next_episode_to_air?: { air_date?: string };
  networks?: Array<{ name: string }>; production_companies?: Array<{ name: string }>;
  credits?: { cast?: Array<{ id: number; name: string; character?: string; profile_path?: string }>; crew?: Array<{ id: number; name: string; job?: string }> };
}
interface ProviderItem { provider_id: number; provider_name: string; logo_path?: string; display_priority: number; }
interface RegionProviders {
  link: string;
  flatrate?: ProviderItem[];
  free?: ProviderItem[];
  ads?: ProviderItem[];
  rent?: ProviderItem[];
  buy?: ProviderItem[];
}
interface WatchProviderResponse { results: Record<string, RegionProviders>; }

const apiKey = process.env.TMDB_API_KEY;
const image = (path: string | undefined, size: string) => path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function tmdb<T>(path: string): Promise<T> {
  if (!apiKey) throw new Error("TMDB_API_KEY is not configured.");
  const response = await fetch(`https://api.themoviedb.org/3${path}${path.includes("?") ? "&" : "?"}api_key=${apiKey}`);
  if (!response.ok) throw new Error(`TMDB ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

function statusOf(details: Details, date?: string): TitleStatus {
  if (details.next_episode_to_air) return "airing";
  if (date && date > new Date().toISOString().slice(0, 10)) return "upcoming";
  if (["Returning Series", "In Production", "Planned", "Pilot"].includes(details.status ?? "")) return "announced";
  return "completed";
}

function normalizeWatchProviders(response: WatchProviderResponse, originRegions: string[]): WatchProvider[] {
  const regionPriority = [...new Set(["IN", ...originRegions, "US", "TH", "JP", "KR", "TW", "PH", "HK", "SG"])]
    .filter((region) => response.results[region])
    .slice(0, 3);
  const selectedRegions = regionPriority.length
    ? regionPriority
    : Object.keys(response.results).sort().slice(0, 3);

  return selectedRegions.flatMap((region) => {
    const availability = response.results[region];
    const groups: Array<{ providers: ProviderItem[]; type: WatchProvider["type"] }> = [
      { providers: [...(availability.flatrate ?? []), ...(availability.free ?? []), ...(availability.ads ?? [])], type: "stream" },
      { providers: availability.rent ?? [], type: "rent" },
      { providers: availability.buy ?? [], type: "buy" },
    ];

    return groups.flatMap(({ providers, type }) => {
      const uniqueProviders = new Map<number, ProviderItem>();
      for (const provider of providers.sort((a, b) => a.display_priority - b.display_priority)) {
        if (!uniqueProviders.has(provider.provider_id)) uniqueProviders.set(provider.provider_id, provider);
      }
      return [...uniqueProviders.values()].map((provider) => ({
        name: provider.provider_name,
        url: availability.link,
        logoUrl: image(provider.logo_path, "w92"),
        region,
        type,
      }));
    });
  });
}

async function resolveEntry(entry: CatalogEntry): Promise<{ tmdbId: number; title: Title }> {
  let tmdbId = entry.tmdbId;
  if (!tmdbId) {
    const search = await tmdb<{ results: SearchItem[] }>(`/search/${entry.type}?query=${encodeURIComponent(entry.query)}&include_adult=false`);
    tmdbId = search.results.find((item) => Number((item.first_air_date ?? item.release_date)?.slice(0, 4)) === entry.year)?.id;
  }
  if (!tmdbId) throw new Error(`No TMDB match: ${entry.query} (${entry.year}, ${entry.type})`);
  const [details, providerResponse] = await Promise.all([
    tmdb<Details>(`/${entry.type}/${tmdbId}?append_to_response=credits`),
    tmdb<WatchProviderResponse>(`/${entry.type}/${tmdbId}/watch/providers`),
  ]);
  const title = details.name ?? details.title ?? entry.query;
  const releaseDate = details.first_air_date ?? details.release_date;
  const synopsis = details.overview?.trim() || "An official synopsis is not currently available from TMDB.";
  const directors = details.credits?.crew?.filter((member) => member.job === "Director").slice(0, 3) ?? [];
  return { tmdbId, title: {
    id: `tmdb-${entry.type}-${tmdbId}`, slug: slugify(title), externalIds: { tmdb: tmdbId }, title,
    originalTitle: details.original_name ?? details.original_title, alternateTitles: [], categories: entry.categories,
    genres: details.genres?.map((genre) => genre.name) ?? [], tropes: entry.tropes,
    shortSynopsis: synopsis.length > 180 ? `${synopsis.slice(0, 177).trimEnd()}...` : synopsis, synopsis,
    posterUrl: image(details.poster_path, "w500"), backdropUrl: image(details.backdrop_path, "w1280"),
    year: releaseDate ? Number(releaseDate.slice(0, 4)) : entry.year,
    country: details.production_countries?.[0]?.name ?? details.origin_country?.[0] ?? "Unknown",
    language: details.original_language, type: entry.type === "movie" ? "movie" : "series",
    status: statusOf(details, releaseDate), rating: details.vote_average, ratingCount: details.vote_count,
    popularity: details.popularity, episodes: details.number_of_episodes,
    runtimeMinutes: details.runtime ?? details.episode_run_time?.[0], releaseDate, releasePrecision: releaseDate ? "day" : undefined,
    airingDay: details.next_episode_to_air?.air_date ? new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(new Date(`${details.next_episode_to_air.air_date}T00:00:00Z`)) : undefined,
    cast: (details.credits?.cast ?? []).slice(0, 12).map((member) => ({ personId: `tmdb-person-${member.id}`, name: member.name, characterName: member.character, imageUrl: image(member.profile_path, "w185") })),
    crew: directors.map((member) => ({ personId: `tmdb-person-${member.id}`, name: member.name, role: "Director" })),
    watchProviders: normalizeWatchProviders(providerResponse, details.origin_country ?? details.production_countries?.map((country) => country.iso_3166_1) ?? []), productionCompanies: details.production_companies?.map((company) => company.name) ?? [],
    networks: details.networks?.map((network) => network.name) ?? [], isVerified: true,
    discoverySource: "TMDB metadata with manually curated categories and tropes", addedAt: new Date().toISOString().slice(0, 10),
  } };
}

async function main() {
  const entries = JSON.parse(await readFile(resolve(process.cwd(), "data/catalog-curated.json"), "utf8")) as CatalogEntry[];
  const titles: Title[] = [];
  const resolvedEntries = [];
  for (const [index, entry] of entries.entries()) {
    const result = await resolveEntry(entry);
    titles.push(result.title);
    resolvedEntries.push({ ...entry, tmdbId: result.tmdbId, verified: true });
    console.log(`[${index + 1}/${entries.length}] ${result.title.title}`);
  }
  await writeFile(resolve(process.cwd(), "data/catalog.generated.json"), `${JSON.stringify(titles, null, 2)}\n`);
  await writeFile(resolve(process.cwd(), "data/catalog.json"), `${JSON.stringify(resolvedEntries, null, 2)}\n`);
  console.log(`Generated ${titles.length} verified real title records.`);
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });

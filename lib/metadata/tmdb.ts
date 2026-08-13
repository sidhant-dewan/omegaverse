import type { MetadataProvider } from "@/lib/metadata/provider";
import { MetadataProviderError } from "@/lib/metadata/provider";
import type { Person, Title } from "@/types";

interface TmdbSearchResult { id: number; name?: string; title?: string; original_name?: string; original_title?: string; overview?: string; poster_path?: string; backdrop_path?: string; first_air_date?: string; release_date?: string; origin_country?: string[]; media_type?: string; popularity?: number; vote_average?: number; vote_count?: number; }
interface TmdbResponse { results: TmdbSearchResult[]; }

export class TmdbProvider implements MetadataProvider {
  private readonly baseUrl = "https://api.themoviedb.org/3";
  constructor(private readonly apiKey = process.env.TMDB_API_KEY) {}
  private async request<T>(path: string): Promise<T> {
    if (!this.apiKey) throw new MetadataProviderError("TMDB", "TMDB_API_KEY is not configured");
    try { const response = await fetch(`${this.baseUrl}${path}${path.includes("?") ? "&" : "?"}api_key=${this.apiKey}`, { next: { revalidate: 86400 } }); if (!response.ok) throw new Error(`HTTP ${response.status}`); return await response.json() as T; }
    catch (error) { throw new MetadataProviderError("TMDB", `Request failed for ${path}`, error); }
  }
  private normalize(item: TmdbSearchResult): Title {
    const name = item.name ?? item.title ?? "Untitled";
    const date = item.first_air_date ?? item.release_date;
    return { id: `tmdb-${item.id}`, slug: name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""), externalIds: { tmdb: item.id }, title: name, originalTitle: item.original_name ?? item.original_title, categories: [], genres: [], tropes: [], shortSynopsis: item.overview?.slice(0,180) ?? "Synopsis unavailable.", synopsis: item.overview ?? "Synopsis unavailable.", posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined, backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : undefined, year: date ? Number(date.slice(0,4)) : undefined, country: item.origin_country?.[0] ?? "Unknown", type: item.media_type === "movie" ? "movie" : "series", status: date && date > new Date().toISOString().slice(0,10) ? "upcoming" : "completed", rating: item.vote_average, ratingCount: item.vote_count, popularity: item.popularity, releaseDate: date, releasePrecision: date ? "day" : undefined, cast: [], watchProviders: [], isVerified: false, discoverySource: "TMDB candidate", addedAt: new Date().toISOString().slice(0,10) };
  }
  async getTitleById(id: string) { const item = await this.request<TmdbSearchResult>(`/tv/${id}?append_to_response=credits`); return this.normalize(item); }
  async searchTitles(query: string) { const data = await this.request<TmdbResponse>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`); return data.results.filter((item) => item.media_type !== "person").map((item) => this.normalize(item)); }
  async getTrendingTitles() { const data = await this.request<TmdbResponse>("/trending/all/week"); return data.results.filter((item) => item.media_type !== "person").map((item) => this.normalize(item)); }
  async getUpcomingTitles() { const data = await this.request<TmdbResponse>("/tv/on_the_air"); return data.results.map((item) => this.normalize(item)); }
  async getAiringTitles() { const data = await this.request<TmdbResponse>("/tv/airing_today"); return data.results.map((item) => this.normalize(item)); }
  async getPerson(id: string): Promise<Person | null> { void id; return null; }
  async refreshTitleMetadata(title: Title) { return title.externalIds?.tmdb ? await this.getTitleById(String(title.externalIds.tmdb)) ?? title : title; }
}

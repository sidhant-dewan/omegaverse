import { getPersonBySlug, getTitleBySlug as getLocalTitleBySlug, titles } from "@/lib/data/catalog";
import { TmdbProvider } from "@/lib/metadata/tmdb";
import type { Person, Title } from "@/types";

const tmdb = new TmdbProvider();
export const getTitleBySlug = async (slug: string): Promise<Title | null> => getLocalTitleBySlug(slug) ?? null;
export const getTitleById = async (id: string): Promise<Title | null> => titles.find((title) => title.id === id) ?? (process.env.TMDB_API_KEY ? tmdb.getTitleById(id).catch(() => null) : null);
export const searchTitles = async (query: string): Promise<Title[]> => { const local = titles.filter((title) => title.title.toLowerCase().includes(query.toLowerCase())); if (local.length || !process.env.TMDB_API_KEY) return local; return tmdb.searchTitles(query).catch(() => []); };
export const getTrendingTitles = async (): Promise<Title[]> => [...titles].sort((a,b) => (b.popularity ?? 0) - (a.popularity ?? 0));
export const getUpcomingTitles = async (): Promise<Title[]> => titles.filter((title) => ["upcoming","announced"].includes(title.status));
export const getAiringTitles = async (): Promise<Title[]> => titles.filter((title) => title.status === "airing");
export const getPerson = async (slug: string): Promise<Person | null> => getPersonBySlug(slug) ?? null;
export const refreshTitleMetadata = async (title: Title): Promise<Title> => process.env.TMDB_API_KEY ? tmdb.refreshTitleMetadata(title).catch(() => title) : title;

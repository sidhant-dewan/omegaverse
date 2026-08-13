export type ContentCategory = "bl" | "gl" | "omegaverse";
export type TitleType = "series" | "movie" | "web-series";
export type TitleStatus = "airing" | "completed" | "upcoming" | "announced";
export type ListStatus = "want-to-watch" | "watching" | "completed" | "dropped" | "on-hold";

export interface CastMember {
  personId: string;
  name: string;
  characterName?: string;
  imageUrl?: string;
}

export interface CrewMember {
  personId: string;
  name: string;
  role: string;
}

export interface WatchProvider {
  name: string;
  url?: string;
  logoUrl?: string;
  region?: string;
  type?: "stream" | "rent" | "buy";
}

export interface Title {
  id: string;
  slug: string;
  externalIds?: { tmdb?: number; tvmaze?: number; imdb?: string };
  title: string;
  originalTitle?: string;
  alternateTitles?: string[];
  categories: ContentCategory[];
  genres: string[];
  tropes: string[];
  shortSynopsis: string;
  synopsis: string;
  posterUrl?: string;
  backdropUrl?: string;
  year?: number;
  country: string;
  language?: string;
  type: TitleType;
  status: TitleStatus;
  rating?: number;
  ratingCount?: number;
  popularity?: number;
  episodes?: number;
  runtimeMinutes?: number;
  releaseDate?: string;
  releasePrecision?: "day" | "month" | "year";
  airingDay?: string;
  cast: CastMember[];
  crew?: CrewMember[];
  watchProviders: WatchProvider[];
  productionCompanies?: string[];
  networks?: string[];
  isVerified: boolean;
  discoverySource?: string;
  addedAt: string;
}

export interface Person {
  id: string;
  slug: string;
  name: string;
  nativeName?: string;
  nationality?: string;
  birthDate?: string;
  biography: string;
  imageUrl?: string;
  socialLinks?: { label: string; url: string }[];
}

export interface ClassificationScore {
  bl: number;
  gl: number;
  omegaverse: number;
}

export interface DiscoveryCandidate {
  externalId: number;
  title: string;
  country?: string;
  year?: number;
  synopsis?: string;
  scores: ClassificationScore;
  suggestedCategories: ContentCategory[];
  reasons: string[];
  status: "pending" | "approved" | "rejected";
}

export interface ListEntry {
  titleId: string;
  status: ListStatus;
  favorite: boolean;
  episode: number;
  updatedAt: string;
}

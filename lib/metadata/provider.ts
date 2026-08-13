import type { Person, Title } from "@/types";

export interface MetadataProvider {
  getTitleById(id: string): Promise<Title | null>;
  searchTitles(query: string): Promise<Title[]>;
  getTrendingTitles(): Promise<Title[]>;
  getUpcomingTitles(): Promise<Title[]>;
  getAiringTitles(): Promise<Title[]>;
  getPerson(id: string): Promise<Person | null>;
  refreshTitleMetadata(title: Title): Promise<Title>;
}

export class MetadataProviderError extends Error {
  constructor(public readonly provider: string, message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "MetadataProviderError";
  }
}

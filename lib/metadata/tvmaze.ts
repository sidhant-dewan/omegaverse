import type { Title } from "@/types";

interface TvmazeEpisode { airdate?: string; airtime?: string; airstamp?: string; number?: number; }

export class TvmazeScheduleProvider {
  readonly enabled = process.env.TVMAZE_ENABLED === "true";
  async getNextEpisode(tvmazeId: number): Promise<TvmazeEpisode | null> {
    if (!this.enabled) return null;
    const response = await fetch(`https://api.tvmaze.com/shows/${tvmazeId}/episodes?specials=0`, { next: { revalidate: 21600 } });
    if (!response.ok) return null;
    const episodes = await response.json() as TvmazeEpisode[];
    const today = new Date().toISOString();
    return episodes.find((episode) => (episode.airstamp ?? `${episode.airdate}T${episode.airtime}`) >= today) ?? null;
  }
  async enrichSchedule(title: Title): Promise<Title> {
    if (!title.externalIds?.tvmaze) return title;
    const episode = await this.getNextEpisode(title.externalIds.tvmaze);
    if (!episode?.airdate) return title;
    return { ...title, status: "airing", airingDay: new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(new Date(`${episode.airdate}T00:00:00Z`)) };
  }
}

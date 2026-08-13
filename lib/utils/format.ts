import type { ContentCategory, Title } from "@/types";

export const categoryLabel: Record<ContentCategory, string> = { bl: "BL", gl: "GL", omegaverse: "Omegaverse" };

export function formatRelease(title: Title): string {
  if (!title.releaseDate) return title.status === "announced" ? "Date to be announced" : "Release date unavailable";
  if (title.releasePrecision === "year") return `Coming ${title.releaseDate}`;
  if (title.releasePrecision === "month") {
    const [year, month] = title.releaseDate.split("-").map(Number);
    return `Expected ${new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)))}`;
  }
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${title.releaseDate}T00:00:00Z`));
}

export const titleTypeLabel = (type: Title["type"]) => type === "web-series" ? "Web Series" : type.charAt(0).toUpperCase() + type.slice(1);

import type { Title } from "@/types";

const sharedCount = (left: string[], right: string[]) => left.filter((value) => right.includes(value)).length;

export function recommendationScore(source: Title, candidate: Title): number {
  if (source.id === candidate.id) return Number.NEGATIVE_INFINITY;
  let score = 0;
  score += sharedCount(source.categories, candidate.categories) * 5;
  score += sharedCount(source.genres, candidate.genres) * 3;
  score += sharedCount(source.tropes, candidate.tropes) * 3;
  if (source.country === candidate.country) score += 3;
  if (source.cast.some((member) => candidate.cast.some((other) => other.personId === member.personId))) score += 2;
  if (source.rating && candidate.rating && Math.abs(source.rating - candidate.rating) <= 0.5) score += 1;
  if (source.year && candidate.year && Math.abs(source.year - candidate.year) <= 1) score += 1;
  return score;
}

export function getRecommendations(source: Title, catalog: Title[], limit = 6): Title[] {
  return catalog
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => ({ candidate, score: recommendationScore(source, candidate) }))
    .sort((a, b) => b.score - a.score || (b.candidate.rating ?? 0) - (a.candidate.rating ?? 0))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

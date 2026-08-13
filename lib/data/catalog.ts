import generatedCatalog from "@/data/catalog.generated.json";
import type { ContentCategory, Person, Title } from "@/types";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const titles = generatedCatalog as unknown as Title[];

export const people: Person[] = [...new Map(
  titles.flatMap((title) => title.cast).map((member) => [member.personId, {
    id: member.personId,
    slug: `${slugify(member.name)}-${member.personId.replace("tmdb-person-", "")}`,
    name: member.name,
    biography: `Known for ${titles.filter((title) => title.cast.some((castMember) => castMember.personId === member.personId)).map((title) => title.title).slice(0, 3).join(", ")}.`,
    imageUrl: member.imageUrl,
  } satisfies Person]),
).values()];

export const getTitleBySlug = (slug: string) => titles.find((title) => title.slug === slug);
export const getPersonBySlug = (slug: string) => people.find((person) => person.slug === slug);
export const getTitlesByCategory = (category: ContentCategory) => titles.filter((title) => title.categories.includes(category));
export const getPersonTitles = (personId: string) => titles.filter((title) => title.cast.some((member) => member.personId === personId));
export const trendingTitles = [...titles].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
export const topRatedTitles = [...titles].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

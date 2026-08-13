import Link from "next/link";
import type { ContentCategory } from "@/types";
import { FeaturedHero } from "@/components/discovery/featured-hero";
import { TitleSection } from "@/components/discovery/title-section";
import { getTitlesByCategory } from "@/lib/data/catalog";
import { categoryLabel } from "@/lib/utils/format";

export function CategoryPage({ category }: { category: ContentCategory }) {
  const catalog = getTitlesByCategory(category);
  const label = categoryLabel[category];
  const byCountry = (country: string) => catalog.filter((title) => title.country === country);
  return (
    <>
      <FeaturedHero title={catalog[0]} />
      <div className="page-shell category-intro">
        <div><p className="eyebrow">Browse by category</p><h1>{label}</h1><p>Stories curated for the {label} catalog, with genres and tropes kept distinct for precise discovery.</p></div>
        <Link href={`/explore?category=${category}`} className="button-primary">Explore all {label}</Link>
      </div>
      <div className="page-shell category-sections">
        <TitleSection title={`Trending ${label}`} titles={catalog.slice(0, 8)} href={`/explore?category=${category}&sort=trending`} />
        <TitleSection title={`Currently Airing ${label}`} titles={catalog.filter((title) => title.status === "airing")} href={`/airing?category=${category}`} />
        <TitleSection title={`Upcoming ${label}`} titles={catalog.filter((title) => ["upcoming", "announced"].includes(title.status))} href={`/upcoming?category=${category}`} />
        <TitleSection title={`Top Rated ${label}`} titles={[...catalog].sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 8)} href={`/charts?category=${category}`} ranked />
        {category !== "omegaverse" ? ["Thailand", "South Korea", "Japan"].map((country) => <TitleSection key={country} title={`${country.replace("South Korea", "Korean").replace("Thailand", "Thai").replace("Japan", "Japanese")} ${label}`} titles={byCountry(country)} href={`/explore?category=${category}&country=${encodeURIComponent(country)}`} />) : null}
        <TitleSection title={`${label} Movies`} titles={catalog.filter((title) => title.type === "movie")} href={`/explore?category=${category}&type=movie`} />
        {category === "omegaverse" ? <TitleSection title="Omegaverse Series" titles={catalog.filter((title) => title.type !== "movie")} href="/explore?category=omegaverse&type=series" /> : null}
      </div>
    </>
  );
}

import { FeaturedHero } from "@/components/discovery/featured-hero";
import { TitleSection } from "@/components/discovery/title-section";
import { titles, topRatedTitles, trendingTitles } from "@/lib/data/catalog";

export default function Home() {
  const byCategory = (category: "bl" | "gl" | "omegaverse") => titles.filter((title) => title.categories.includes(category));
  const byCountry = (country: string) => titles.filter((title) => title.country === country);
  return (
    <>
      <FeaturedHero title={titles[0]} />
      <div className="page-shell home-sections">
        <div className="demo-notice"><strong>Curated catalog</strong><span>Real productions with metadata and images supplied by TMDB; category and trope labels are reviewed separately.</span></div>
        <TitleSection title="Trending Now" eyebrow="What people are finding" titles={trendingTitles.slice(0, 8)} href="/charts" />
        <TitleSection title="BL Spotlight" titles={byCategory("bl").slice(0, 7)} href="/bl" actionLabel="Explore BL" />
        <TitleSection title="GL Spotlight" titles={byCategory("gl").slice(0, 7)} href="/gl" actionLabel="Explore GL" />
        <TitleSection title="Omegaverse Spotlight" titles={byCategory("omegaverse").slice(0, 7)} href="/omegaverse" actionLabel="Explore Omegaverse" />
        <TitleSection title="Currently Airing" titles={titles.filter((title) => title.status === "airing").slice(0, 8)} href="/airing" />
        <TitleSection title="Coming Soon" titles={titles.filter((title) => ["upcoming", "announced"].includes(title.status)).slice(0, 8)} href="/upcoming" />
        <TitleSection title="Top Rated" titles={topRatedTitles.slice(0, 8)} href="/charts" ranked />
        <TitleSection title="Hidden Gems" titles={titles.filter((title) => (title.rating ?? 0) >= 8 && (title.popularity ?? 0) < 800).slice(0, 7)} href="/explore?sort=rating" />
        {[["Thai Series", "Thailand"], ["Korean Series", "South Korea"], ["Japanese Series", "Japan"], ["Taiwanese Series", "Taiwan"]].map(([label, country]) => <TitleSection key={country} title={label} titles={byCountry(country).slice(0, 7)} href={`/country/${country.toLowerCase().replaceAll(" ", "-")}`} />)}
        <TitleSection title="Movies" titles={titles.filter((title) => title.type === "movie").slice(0, 8)} href="/explore?type=movie" />
        <TitleSection title="Recently Added" titles={[...titles].reverse().slice(0, 8)} href="/explore?sort=newest" />
      </div>
    </>
  );
}

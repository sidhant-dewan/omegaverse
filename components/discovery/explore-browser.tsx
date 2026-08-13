"use client";

import { useDeferredValue, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { ContentCategory, Title } from "@/types";
import { TitleCard } from "@/components/title/title-card";

const filterOptions = {
  category: [["BL", "bl"], ["GL", "gl"], ["Omegaverse", "omegaverse"]],
  country: ["Thailand", "South Korea", "Japan", "Taiwan", "China", "Philippines", "Vietnam", "Other"].map((value) => [value, value]),
  type: [["Series", "series"], ["Movie", "movie"], ["Web Series", "web-series"]],
  status: [["Airing", "airing"], ["Completed", "completed"], ["Upcoming", "upcoming"], ["Announced", "announced"]],
  genre: ["Romance", "Comedy", "Drama", "Fantasy", "Historical", "Mystery", "Thriller", "Slice of Life"].map((value) => [value, value]),
  trope: ["Enemies to Lovers", "Friends to Lovers", "Childhood Friends", "Office Romance", "School Romance", "University", "Fake Dating", "Contract Relationship", "Slow Burn", "Second Chance", "Forbidden Romance", "Soulmates", "Marriage of Convenience"].map((value) => [value, value]),
} as const;

type FilterKey = keyof typeof filterOptions;

export function ExploreBrowser({ titles }: { titles: Title[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.toLowerCase());
  const selected = (key: FilterKey) => (searchParams.get(key) ?? "").split(",").filter(Boolean);
  const update = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length) params.set(key, values.join(","));
    else params.delete(key);
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  };
  const toggle = (key: FilterKey, value: string) => {
    const current = selected(key);
    update(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const minimumRating = Number(searchParams.get("rating") ?? 0);
  const year = searchParams.get("year");
  const filtered = titles.filter((title) => {
    const categories = selected("category") as ContentCategory[];
    const countries = selected("country");
    return (!deferredQuery || [title.title, title.originalTitle, ...title.alternateTitles ?? []].filter(Boolean).some((value) => value?.toLowerCase().includes(deferredQuery)))
      && (!categories.length || categories.every((category) => title.categories.includes(category)))
      && (!countries.length || countries.includes(title.country) || (countries.includes("Other") && !filterOptions.country.slice(0,-1).some(([, value]) => value === title.country)))
      && (!selected("type").length || selected("type").includes(title.type))
      && (!selected("status").length || selected("status").includes(title.status))
      && (!selected("genre").length || selected("genre").some((genre) => title.genres.includes(genre)))
      && (!selected("trope").length || selected("trope").some((trope) => title.tropes.includes(trope)))
      && (!year || title.year === Number(year))
      && ((title.rating ?? 0) >= minimumRating);
  });
  const sort = searchParams.get("sort") ?? "trending";
  filtered.sort((a, b) => {
    if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sort === "popular") return (b.popularity ?? 0) - (a.popularity ?? 0);
    if (sort === "newest") return (b.year ?? 0) - (a.year ?? 0);
    if (sort === "upcoming") return (a.releaseDate ?? "9999").localeCompare(b.releaseDate ?? "9999");
    if (sort === "az") return a.title.localeCompare(b.title);
    return (b.popularity ?? 0) - (a.popularity ?? 0);
  });
  const activeCount = [...searchParams.keys()].filter((key) => key !== "sort").length;
  return (
    <div className="explore-layout">
      <button className="mobile-filter-button" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={17} /> Filters {activeCount ? `(${activeCount})` : ""}</button>
      <aside className={`filter-panel ${filtersOpen ? "filter-panel-open" : ""}`}>
        <div className="filter-mobile-head"><strong>Filters</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
        {(Object.keys(filterOptions) as FilterKey[]).map((key) => <fieldset key={key} className="filter-group"><legend>{key === "trope" ? "Tropes" : key.charAt(0).toUpperCase() + key.slice(1)}</legend>{filterOptions[key].map(([label, value]) => <label key={value}><input type="checkbox" checked={selected(key).includes(value)} onChange={() => toggle(key, value)} /><span>{label}</span></label>)}</fieldset>)}
        <div className="filter-group"><label className="select-label">Release year<select value={year ?? ""} onChange={(event) => update("year", event.target.value ? [event.target.value] : [])}><option value="">Any year</option>{[2027,2026,2025,2024,2023].map((value) => <option key={value}>{value}</option>)}</select></label></div>
        <div className="filter-group"><label className="select-label">Minimum rating<select value={minimumRating} onChange={(event) => update("rating", event.target.value === "0" ? [] : [event.target.value])}><option value="0">Any rating</option><option value="7">7+</option><option value="8">8+</option></select></label></div>
        {activeCount ? <button className="clear-filters" onClick={() => router.replace("/explore")}>Clear all filters</button> : null}
      </aside>
      <section className="explore-results">
        <div className="explore-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search this catalog" aria-label="Search catalog" /><select value={sort} onChange={(event) => update("sort", [event.target.value])} aria-label="Sort titles"><option value="trending">Trending</option><option value="popular">Most Popular</option><option value="rating">Highest Rated</option><option value="newest">Newest</option><option value="upcoming">Upcoming</option><option value="az">A-Z</option></select></div>
        <p className="result-count">{filtered.length} {filtered.length === 1 ? "title" : "titles"}</p>
        {filtered.length ? <div className="poster-grid">{filtered.map((title) => <TitleCard key={title.id} title={title} />)}</div> : <div className="empty-state"><h2>No titles matched these filters.</h2><p>Try removing a category, trope, or rating filter.</p><button className="button-primary" onClick={() => router.replace("/explore")}>Reset filters</button></div>}
      </section>
    </div>
  );
}

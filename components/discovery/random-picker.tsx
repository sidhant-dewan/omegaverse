"use client";

import { useState } from "react";
import Link from "next/link";
import { Dices } from "lucide-react";
import type { ContentCategory, Title, TitleType } from "@/types";
import { CategoryBadges } from "@/components/title/category-badges";

export function RandomPicker({ titles }: { titles: Title[] }) {
  const [category, setCategory] = useState<ContentCategory | "any">("any");
  const [country, setCountry] = useState("any");
  const [type, setType] = useState<TitleType | "any">("any");
  const [rating, setRating] = useState(0);
  const [genre, setGenre] = useState("any");
  const [trope, setTrope] = useState("any");
  const [pick, setPick] = useState<Title>();
  const countries = [...new Set(titles.map((title) => title.country))].sort();
  const genres = [...new Set(titles.flatMap((title) => title.genres))].sort();
  const tropes = [...new Set(titles.flatMap((title) => title.tropes))].sort();
  const choose = () => { const matches = titles.filter((title) => (category === "any" || title.categories.includes(category)) && (country === "any" || title.country === country) && (type === "any" || title.type === type) && (title.rating ?? 0) >= rating && (genre === "any" || title.genres.includes(genre)) && (trope === "any" || title.tropes.includes(trope))); setPick(matches.length ? matches[Math.floor(Math.random() * matches.length)] : undefined); };
  return <section className="random-picker"><div><p className="eyebrow">Can’t decide?</p><h2>Pick Something For Me</h2></div><div className="picker-controls"><label>Category<select value={category} onChange={(event) => setCategory(event.target.value as ContentCategory | "any")}><option value="any">Any</option><option value="bl">BL</option><option value="gl">GL</option><option value="omegaverse">Omegaverse</option></select></label><label>Country<select value={country} onChange={(event) => setCountry(event.target.value)}><option value="any">Any</option>{countries.map((value) => <option key={value}>{value}</option>)}</select></label><label>Type<select value={type} onChange={(event) => setType(event.target.value as TitleType | "any")}><option value="any">Any</option><option value="series">Series</option><option value="movie">Movie</option><option value="web-series">Web Series</option></select></label><label>Minimum rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}><option value="0">Any</option><option value="7">7+</option><option value="8">8+</option></select></label><label>Genre<select value={genre} onChange={(event) => setGenre(event.target.value)}><option value="any">Any</option>{genres.map((value) => <option key={value}>{value}</option>)}</select></label><label>Trope<select value={trope} onChange={(event) => setTrope(event.target.value)}><option value="any">Any</option>{tropes.map((value) => <option key={value}>{value}</option>)}</select></label><button className="button-primary" onClick={choose}><Dices /> Pick a title</button></div>{pick ? <div className="random-result"><CategoryBadges categories={pick.categories} /><div><h3>{pick.title}</h3><p>{pick.country} · {pick.year} · {pick.rating?.toFixed(1)} TMDB rating</p></div><Link className="button-secondary" href={`/title/${pick.slug}`}>View title</Link></div> : null}</section>;
}

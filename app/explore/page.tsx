import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreBrowser } from "@/components/discovery/explore-browser";
import { RandomPicker } from "@/components/discovery/random-picker";
import { titles } from "@/lib/data/catalog";
export const metadata: Metadata = { title: "Explore", description: "Filter BL, GL, and Omegaverse titles by country, genre, trope, format, status, year, and rating." };
export default function ExplorePage() {
  return <div className="page-shell standard-page"><header className="page-heading"><p className="eyebrow">Find precisely what fits</p><h1>Explore</h1><p>Categories, genres, and tropes are independent, so every combination stays meaningful.</p></header><RandomPicker titles={titles} /><Suspense fallback={<p>Loading filters…</p>}><ExploreBrowser titles={titles} /></Suspense></div>;
}

import type { Metadata } from "next";
import { CategoryPage } from "@/components/discovery/category-page";
export const metadata: Metadata = { title: "Omegaverse", description: "Explore ShakchiVerse's human-curated Omegaverse catalog." };
export default function OmegaversePage() { return <CategoryPage category="omegaverse" />; }

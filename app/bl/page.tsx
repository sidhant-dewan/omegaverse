import type { Metadata } from "next";
import { CategoryPage } from "@/components/discovery/category-page";
export const metadata: Metadata = { title: "BL", description: "Discover BL series, films, and upcoming productions." };
export default function BlPage() { return <CategoryPage category="bl" />; }

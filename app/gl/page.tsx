import type { Metadata } from "next";
import { CategoryPage } from "@/components/discovery/category-page";
export const metadata: Metadata = { title: "GL", description: "Discover GL series, films, and upcoming productions." };
export default function GlPage() { return <CategoryPage category="gl" />; }

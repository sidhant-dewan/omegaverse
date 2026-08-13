import { notFound } from "next/navigation";
import { TitleCard } from "@/components/title/title-card";
import { titles } from "@/lib/data/catalog";
const countries: Record<string,string> = { thailand: "Thailand", "south-korea": "South Korea", japan: "Japan", taiwan: "Taiwan", china: "China", philippines: "Philippines", vietnam: "Vietnam" };
export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const country = countries[slug]; if (!country) notFound(); const results = titles.filter((title) => title.country === country); return <div className="page-shell standard-page"><header className="page-heading"><p className="eyebrow">Browse by country</p><h1>{country}</h1><p>{results.length} curated titles across BL, GL, and Omegaverse.</p></header><div className="poster-grid">{results.map((title) => <TitleCard key={title.id} title={title} />)}</div></div>; }

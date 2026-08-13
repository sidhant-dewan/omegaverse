import Link from "next/link";
import type { ContentCategory } from "@/types";
export function CategoryTabs({ basePath, active }: { basePath: string; active?: string }) { const tabs: Array<[string, ContentCategory | undefined]> = [["All", undefined],["BL","bl"],["GL","gl"],["Omegaverse","omegaverse"]]; return <nav className="category-tabs" aria-label="Filter by category">{tabs.map(([label,value]) => <Link key={label} className={(active ?? "") === (value ?? "") ? "active" : ""} href={value ? `${basePath}?category=${value}` : basePath}>{label}</Link>)}</nav>; }

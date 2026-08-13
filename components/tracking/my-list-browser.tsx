"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentCategory, ListStatus, Title } from "@/types";
import { useWatchlist } from "@/lib/storage/watchlist";
import { TitleCard } from "@/components/title/title-card";

const sections: Array<[ListStatus | "favorite", string]> = [["watching", "Watching"], ["want-to-watch", "Want to Watch"], ["completed", "Completed"], ["favorite", "Favorites"], ["on-hold", "On Hold"], ["dropped", "Dropped"]];

export function MyListBrowser({ catalog }: { catalog: Title[] }) {
  const entries = useWatchlist();
  const [category, setCategory] = useState<ContentCategory | "all">("all");
  const titleFor = (id: string) => catalog.find((title) => title.id === id);
  const matching = (status: ListStatus | "favorite") => entries.filter((entry) => status === "favorite" ? entry.favorite : entry.status === status).map((entry) => titleFor(entry.titleId)).filter((title): title is Title => Boolean(title)).filter((title) => category === "all" || title.categories.includes(category));
  if (!entries.length) return <div className="empty-state my-list-empty"><h2>Your watchlist is empty.</h2><p>Save a title to start tracking what you want to watch.</p><Link className="button-primary" href="/explore">Explore titles</Link></div>;
  return (
    <div>
      <div className="segmented-control" role="group" aria-label="Filter My List by category">{(["all","bl","gl","omegaverse"] as const).map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value === "all" ? "All" : value.toUpperCase()}</button>)}</div>
      {sections.map(([status,label]) => { const items = matching(status); return <section className="list-section" key={status}><div className="section-heading"><h2>{label}</h2><span>{items.length}</span></div>{items.length ? <div className="poster-grid">{items.map((title) => <TitleCard key={title.id} title={title} />)}</div> : <div className="inline-empty">Your {category === "all" ? "" : category.toUpperCase() + " "}{label.toLowerCase()} list is empty.</div>}</section>; })}
    </div>
  );
}

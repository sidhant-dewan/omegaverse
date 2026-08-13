"use client";

import { Check, Heart, Minus, Plus, Trash2 } from "lucide-react";
import type { ListStatus } from "@/types";
import { removeListEntry, updateListEntry, useWatchlist } from "@/lib/storage/watchlist";

const statuses: Array<[ListStatus, string]> = [["want-to-watch", "Want to Watch"], ["watching", "Watching"], ["completed", "Completed"], ["on-hold", "On Hold"], ["dropped", "Dropped"]];

export function TitleActions({ titleId, episodes }: { titleId: string; episodes?: number }) {
  const entries = useWatchlist();
  const entry = entries.find((item) => item.titleId === titleId);
  const episode = entry?.episode ?? 0;
  const setEpisode = (value: number) => updateListEntry(titleId, { episode: Math.max(0, Math.min(value, episodes ?? value)), status: entry?.status ?? "watching" });
  return (
    <div className="tracking-panel">
      <div className="tracking-main">
        <label><span className="sr-only">Watch status</span><select value={entry?.status ?? ""} onChange={(event) => updateListEntry(titleId, { status: event.target.value as ListStatus })}><option value="" disabled>Add to My List</option>{statuses.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button className={entry?.favorite ? "favorite-active" : ""} onClick={() => updateListEntry(titleId, { favorite: !entry?.favorite })} aria-label={entry?.favorite ? "Remove from favorites" : "Add to favorites"}><Heart fill={entry?.favorite ? "currentColor" : "none"} /> <span>{entry?.favorite ? "Favorited" : "Favorite"}</span></button>
        {entry ? <button onClick={() => removeListEntry(titleId)} aria-label="Remove from My List"><Trash2 /><span>Remove</span></button> : null}
      </div>
      {episodes ? <div className="episode-control"><span>Episode progress</span><div><button onClick={() => setEpisode(episode - 1)} disabled={episode === 0} aria-label="Previous episode"><Minus /></button><strong>{episode} / {episodes}</strong><button onClick={() => setEpisode(episode + 1)} disabled={episode === episodes} aria-label="Next episode"><Plus /></button></div>{episode === episodes && entry?.status !== "completed" ? <button className="complete-prompt" onClick={() => updateListEntry(titleId, { status: "completed" })}><Check /> Mark as Completed</button> : null}</div> : null}
    </div>
  );
}

import Link from "next/link";
import { Star } from "lucide-react";
import type { Title } from "@/types";
import { CategoryBadges } from "@/components/title/category-badges";
import { MediaImage } from "@/components/ui/media-image";

export function TitleCard({ title, rank }: { title: Title; rank?: number }) {
  return (
    <article className="title-card group">
      <Link href={`/title/${title.slug}`} className="block" aria-label={`View ${title.title}`}>
        <div className="title-card-poster">
          <MediaImage src={title.posterUrl} alt={`${title.title} poster`} sizes="(max-width: 640px) 42vw, 190px" />
          <div className="title-card-shade" />
          {rank ? <span className="rank-number">{rank}</span> : null}
          <div className="absolute left-3 top-3 z-10"><CategoryBadges categories={title.categories} compact /></div>
          <div className="title-card-rating"><Star size={13} fill="currentColor" aria-hidden="true" /> {title.rating?.toFixed(1) ?? "NR"}</div>
        </div>
        <div className="pt-3">
          <h3 className="truncate text-[15px] font-semibold text-white transition-colors group-hover:text-amber-300">{title.title}</h3>
          <p className="mt-1 truncate text-xs text-zinc-500">{title.country} · {title.year ?? "TBA"}</p>
        </div>
      </Link>
    </article>
  );
}

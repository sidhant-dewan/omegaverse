import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import type { Title } from "@/types";
import { CategoryBadges } from "@/components/title/category-badges";
import { MediaImage } from "@/components/ui/media-image";

export function FeaturedHero({ title }: { title: Title }) {
  return (
    <section className="featured-hero">
      <MediaImage src={title.backdropUrl} alt={`${title.title} backdrop`} sizes="100vw" priority kind="backdrop" />
      <div className="hero-wash" />
      <div className="hero-content page-shell">
        <p className="eyebrow">Picked for Shakchi</p>
        <CategoryBadges categories={title.categories} />
        <h1>{title.title}</h1>
        <div className="hero-meta"><span>{title.year}</span><span>{title.country}</span><span className="flex items-center gap-1"><Star size={15} fill="currentColor" /> {title.rating?.toFixed(1)} <small>TMDB</small></span></div>
        <p>{title.shortSynopsis}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/title/${title.slug}`} className="button-primary"><Play size={17} fill="currentColor" /> View title</Link>
          <Link href="/explore" className="button-secondary">Explore catalog <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { CategoryBadges } from "@/components/title/category-badges";
import { MediaImage } from "@/components/ui/media-image";
import { TitleActions } from "@/components/tracking/title-actions";
import { TitleSection } from "@/components/discovery/title-section";
import { getRecommendations } from "@/lib/recommendations";
import { getTitleBySlug, people, titles } from "@/lib/data/catalog";
import { formatRelease, titleTypeLabel } from "@/lib/utils/format";

interface SlugPageProps { params: Promise<{ slug: string }>; }

export function generateStaticParams() { return titles.map((title) => ({ slug: title.slug })); }
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> { const { slug } = await params; const title = getTitleBySlug(slug); return title ? { title: title.title, description: title.shortSynopsis, alternates: { canonical: `/title/${slug}` } } : { title: "Title not found" }; }

export default async function TitlePage({ params }: SlugPageProps) {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) notFound();
  const recommendations = getRecommendations(title, titles);
  const schema = { "@context": "https://schema.org", "@type": title.type === "movie" ? "Movie" : "TVSeries", name: title.title, datePublished: title.releaseDate, countryOfOrigin: title.country, genre: title.genres, description: title.shortSynopsis };
  return <>
    <section className="detail-hero"><MediaImage src={title.backdropUrl} alt={`${title.title} backdrop`} sizes="100vw" priority kind="backdrop" /><div className="detail-wash" /></section>
    <article className="page-shell title-detail">
      <div className="detail-poster"><MediaImage src={title.posterUrl} alt={`${title.title} poster`} sizes="(max-width: 760px) 38vw, 280px" /></div>
      <div className="detail-content"><CategoryBadges categories={title.categories} /><h1>{title.title}</h1>{title.originalTitle ? <p className="original-title">{title.originalTitle}</p> : null}<div className="detail-meta"><span>{title.year}</span><span>{title.country}</span><span>{titleTypeLabel(title.type)}</span><span className="rating"><Star size={15} fill="currentColor" /> {title.rating?.toFixed(1)} <small>TMDB rating</small></span></div><p className="synopsis">{title.synopsis}</p><TitleActions titleId={title.id} episodes={title.episodes} /></div>
    </article>
    <div className="page-shell detail-grid">
      <div><section className="detail-section"><h2>Details</h2><dl className="facts"><div><dt>Status</dt><dd>{title.status}</dd></div><div><dt>Release</dt><dd>{formatRelease(title)}</dd></div><div><dt>Episodes</dt><dd>{title.episodes ?? "—"}</dd></div><div><dt>Runtime</dt><dd>{title.runtimeMinutes ? `${title.runtimeMinutes} min` : "—"}</dd></div><div><dt>Network</dt><dd>{title.networks?.join(", ") || "—"}</dd></div><div><dt>Production</dt><dd>{title.productionCompanies?.join(", ") || "—"}</dd></div></dl></section>
      <section className="detail-section"><h2>Genres & tropes</h2><div className="tag-list">{title.genres.map((genre) => <Link key={genre} href={`/genre/${genre.toLowerCase().replaceAll(" ", "-")}`}>{genre}</Link>)}{title.tropes.map((trope) => <Link key={trope} href={`/trope/${trope.toLowerCase().replaceAll(" ", "-")}`}>{trope}</Link>)}</div></section>
      <section className="detail-section"><h2>Cast & crew</h2><div className="cast-list">{title.cast.map((member) => { const person = people.find((item) => item.id === member.personId); return <Link key={member.personId} href={`/person/${person?.slug ?? member.personId}`}><strong>{member.name}</strong><span>{member.characterName}</span></Link>; })}{title.crew?.map((member) => <div key={`${member.personId}-${member.role}`}><strong>{member.name}</strong><span>{member.role}</span></div>)}</div></section></div>
      <aside className="watch-section"><h2>Where to Watch</h2>{title.watchProviders.length ? title.watchProviders.map((provider) => <a key={`${provider.name}-${provider.region}-${provider.type}`} href={provider.url} target="_blank" rel="noopener noreferrer">{provider.logoUrl ? <Image src={provider.logoUrl} alt="" width={38} height={38} /> : null}<span><strong>{provider.name}</strong><small>{provider.region} · {provider.type}</small></span><ExternalLink /></a>) : <div className="inline-empty">No verified provider availability is currently reported.</div>}<p>Availability varies by region. Provider data by JustWatch via TMDB.</p><div className="free-watch-banner">Want to watch it for free?</div><p className="sidhant-invite">Forget the subscription. Call that handsome gentleman Sidhant for the link. Getting to watch your favorite show together is the real mission.</p></aside>
    </div>
    <div className="page-shell recommendations"><TitleSection title="You Might Also Like" titles={recommendations} /></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}

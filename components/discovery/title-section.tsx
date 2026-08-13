import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Title } from "@/types";
import { TitleCard } from "@/components/title/title-card";

interface TitleSectionProps {
  title: string;
  eyebrow?: string;
  titles: Title[];
  href?: string;
  actionLabel?: string;
  ranked?: boolean;
}

export function TitleSection({ title, eyebrow, titles, href, actionLabel = "View all", ranked = false }: TitleSectionProps) {
  if (!titles.length) return null;
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {href ? <Link href={href} className="section-link">{actionLabel}<ArrowRight size={16} aria-hidden="true" /></Link> : null}
      </div>
      <div className="title-rail">
        {titles.map((item, index) => <TitleCard key={item.id} title={item} rank={ranked ? index + 1 : undefined} />)}
      </div>
    </section>
  );
}

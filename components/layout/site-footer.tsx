import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div><Link href="/" className="brand"><span>S</span>ShakchiVerse</Link><p>Made for Shakchi, because every story is better when I’m watching it with you.</p></div>
        <nav aria-label="Footer navigation"><Link href="/explore">Explore</Link><Link href="/airing">Airing</Link><Link href="/charts">Charts</Link><Link href="/suggest">Suggest a title</Link></nav>
        <div className="catalog-note">
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" aria-label="Visit TMDB">
            <Image src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" alt="TMDB" width={92} height={16} unoptimized />
          </a>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <p>Streaming availability data provided by JustWatch.</p>
        </div>
      </div>
    </footer>
  );
}

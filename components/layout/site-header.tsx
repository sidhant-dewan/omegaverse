"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, UserRound } from "lucide-react";

const desktopLinks = [
  ["Home", "/"], ["BL", "/bl"], ["GL", "/gl"], ["Omegaverse", "/omegaverse"], ["Explore", "/explore"],
  ["Airing", "/airing"], ["Upcoming", "/upcoming"], ["Charts", "/charts"], ["My List", "/my-list"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const navLink = (label: string, href: string, className?: string) => (
    <Link key={href} href={href} className={`${isActive(href) ? "nav-active" : ""} ${className ?? ""}`.trim()} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>
  );
  return (
    <>
      <header className="site-header">
        <div className="page-shell header-inner">
          <Link href="/" className="brand" aria-label="ShakchiVerse home"><span>S</span>ShakchiVerse</Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {desktopLinks.map(([label, href]) => navLink(label, href))}
          </nav>
          <form action="/search" className="header-search">
            <Search size={16} aria-hidden="true" />
            <input name="q" type="search" placeholder="Titles, actors..." aria-label="Search ShakchiVerse" />
          </form>
        </div>
        <nav className="mobile-categories" aria-label="Categories">
          {navLink("BL", "/bl", "mobile-category-bl")}{navLink("GL", "/gl", "mobile-category-gl")}{navLink("Omegaverse", "/omegaverse", "mobile-category-omegaverse")}{navLink("Airing", "/airing")}{navLink("Upcoming", "/upcoming")}
        </nav>
      </header>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/" className={isActive("/") ? "nav-active" : undefined} aria-current={isActive("/") ? "page" : undefined}><Home /><span>Home</span></Link>
        <Link href="/explore" className={isActive("/explore") ? "nav-active" : undefined} aria-current={isActive("/explore") ? "page" : undefined}><Search /><span>Explore</span></Link>
        <Link href="/search" className={isActive("/search") ? "nav-active" : undefined} aria-current={isActive("/search") ? "page" : undefined}><UserRound /><span>Search</span></Link>
        <Link href="/my-list" className={isActive("/my-list") ? "nav-active" : undefined} aria-current={isActive("/my-list") ? "page" : undefined}><Heart /><span>My List</span></Link>
      </nav>
    </>
  );
}

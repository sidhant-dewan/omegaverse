import type { Metadata } from "next";
import { MyListBrowser } from "@/components/tracking/my-list-browser";
import { titles } from "@/lib/data/catalog";
export const metadata: Metadata = { title: "My List", description: "Your private, locally stored ShakchiVerse watchlist." };
export default function MyListPage() { return <div className="page-shell standard-page"><header className="page-heading"><p className="eyebrow">Stored on this device</p><h1>My List</h1><p>Track status, favorites, and episode progress without an account.</p></header><MyListBrowser catalog={titles} /></div>; }

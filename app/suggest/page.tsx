import type { Metadata } from "next";
import { SuggestionForm } from "@/components/discovery/suggestion-form";
export const metadata: Metadata = { title: "Suggest a Title", description: "Prepare a structured title suggestion for ShakchiVerse review." };
export default function SuggestPage() { return <div className="page-shell standard-page"><header className="page-heading"><p className="eyebrow">Help shape the catalog</p><h1>Suggest a Title</h1><p>Share an official source when possible. Suggestions require human review before publication.</p></header><SuggestionForm /></div>; }

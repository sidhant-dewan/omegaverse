"use client";
import { RefreshCw } from "lucide-react";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="page-shell error-page"><p className="eyebrow">Something went wrong</p><h1>ShakchiVerse hit a snag.</h1><p>The local catalog is still available. Try loading this page again.</p><button className="button-primary" onClick={reset}><RefreshCw /> Try again</button></div>; }

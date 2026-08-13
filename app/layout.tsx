import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "ShakchiVerse — Stories chosen for you", template: "%s | ShakchiVerse" },
  description: "Made for Shakchi, because every story is better when I'm watching it with you.",
  openGraph: { title: "ShakchiVerse", description: "Made for Shakchi, because every story is better when I'm watching it with you.", siteName: "ShakchiVerse", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></body>
    </html>
  );
}

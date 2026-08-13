import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }, { protocol: "https", hostname: "www.themoviedb.org" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

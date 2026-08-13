"use client";

import Image from "next/image";
import { Film, UserRound } from "lucide-react";
import { useState } from "react";

interface MediaImageProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  kind?: "poster" | "backdrop" | "person";
}

export function MediaImage({ src, alt, sizes, priority, className = "object-cover", kind = "poster" }: MediaImageProps) {
  const [failed, setFailed] = useState(!src);
  if (failed || !src) {
    return (
      <div className="media-fallback" role="img" aria-label={`${alt} image unavailable`}>
        {kind === "person" ? <UserRound aria-hidden="true" /> : <Film aria-hidden="true" />}
        <span>{kind === "backdrop" ? "Backdrop unavailable" : "Image unavailable"}</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} onError={() => setFailed(true)} />;
}

"use client";

import Image from "next/image";
import { useState } from "react";

/** Foto servida localmente desde public/images/demos/*.webp con respaldo de color si faltara. */
export default function Photo({
  id, alt, className = "", priority = false, sizes = "(max-width: 768px) 100vw, 50vw",
}: { id: string; alt: string; className?: string; w?: number; priority?: boolean; sizes?: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!bad && (
        <Image
          src={`/images/demos/${id}.webp`}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized
          priority={priority}
          onError={() => setBad(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}

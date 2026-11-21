"use client";

import Image from "next/image";
import { useState } from "react";

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/** Foto de Unsplash con fondo de respaldo: si fallara, se ve el color del contenedor (nunca imagen rota). */
export default function Photo({
  id, alt, className = "", w = 1200, priority = false, sizes = "(max-width: 768px) 100vw, 50vw",
}: { id: string; alt: string; className?: string; w?: number; priority?: boolean; sizes?: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!bad && (
        <Image src={unsplash(id, w)} alt={alt} fill sizes={sizes} unoptimized priority={priority}
          onError={() => setBad(true)} className="object-cover" />
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function LetterGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  }

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <div
            key={src}
            className="relative aspect-[4/3] w-full flex-shrink-0 snap-center sm:aspect-[16/9]"
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-2.5 py-1">
          {images.map((src, index) => (
            <span
              key={src}
              className={`h-1.5 w-1.5 rounded-full transition ${
                index === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

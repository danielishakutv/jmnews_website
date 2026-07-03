"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { NowContext } from "@/components/NowProvider";
import { timeAgo } from "@/lib/utils";
import CategoryPill from "@/components/ui/CategoryPill";
import LiveBadge from "@/components/ui/LiveBadge";

export default function HeroCarousel({ articles }: { articles: Article[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const now = useContext(NowContext);
  const nowDate = now ? new Date(now) : undefined;

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!articles.length) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-ink shadow-lg">
      <div className="overflow-hidden" ref={emblaRef} style={{ touchAction: "pan-y" }}>
        <div className="flex flex-nowrap">
          {articles.map((a, i) => (
            <div className="relative min-w-full flex-none" key={a.slug}>
              <Link href={`/article/${a.slug}`} className="block">
                <div className="relative aspect-[16/11] w-full sm:aspect-[16/9] lg:aspect-[16/9]">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                  <div className="gradient-overlay absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                    <div className="mb-3 flex items-center gap-2">
                      <CategoryPill slug={a.category} asLink={false} />
                      {a.live && <LiveBadge />}
                      {a.dateline && (
                        <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                          {a.dateline}
                        </span>
                      )}
                    </div>
                    <h2 className="clamp-3 max-w-3xl font-display text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-3xl lg:text-4xl">
                      {a.title}
                    </h2>
                    <p className="clamp-2 mt-3 hidden max-w-2xl text-sm text-white/80 sm:block sm:text-base">
                      {a.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(a.publishedAt, nowDate)} · {a.readTime} min read
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous story"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-black/35 p-2.5 text-white opacity-0 backdrop-blur transition hover:bg-brand-600 group-hover:opacity-100 sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next story"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-black/35 p-2.5 text-white opacity-0 backdrop-blur transition hover:bg-brand-600 group-hover:opacity-100 sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 sm:bottom-6 sm:right-8">
        {articles.map((a, i) => (
          <button
            key={a.slug}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to story ${i + 1}`}
            className={
              i === selected
                ? "h-2 w-7 rounded-full bg-brand-500 transition-all"
                : "h-2 w-2 rounded-full bg-white/50 transition-all hover:bg-white/80"
            }
          />
        ))}
      </div>
    </div>
  );
}

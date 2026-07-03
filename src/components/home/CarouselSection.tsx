"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/article/ArticleCard";
import { NowContext } from "@/components/NowProvider";
import { cn } from "@/lib/utils";

export default function CarouselSection({
  title,
  href,
  articles,
  accent = "orange",
}: {
  title: string;
  href?: string;
  articles: Article[];
  accent?: "orange" | "blue" | "slate";
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const now = useContext(NowContext);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const bar =
    accent === "blue" ? "bg-azure-600" : accent === "slate" ? "bg-ink" : "bg-brand-600";

  if (!articles.length) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
          <span className={cn("inline-block h-6 w-1.5 rounded-full", bar)} />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="group hidden items-center gap-1 text-sm font-semibold text-fg-muted transition-colors hover:text-brand-600 sm:inline-flex"
            >
              See all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Scroll left"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Scroll right"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {articles.map((a) => (
            <div
              key={a.slug}
              className="min-w-0 flex-[0_0_82%] xs:flex-[0_0_70%] sm:flex-[0_0_44%] lg:flex-[0_0_31%] xl:flex-[0_0_24%]"
            >
              <ArticleCard article={a} sizes="(max-width: 640px) 80vw, 25vw" now={now ?? undefined} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { activePopup } from "@/lib/promotions";

/**
 * Site popup — shows the first enabled promo from src/lib/promotions.ts after
 * a short delay, respecting a per-visitor cooldown stored in localStorage so
 * it isn't naggy. Renders nothing when no popup is enabled.
 */
export default function PromoPopup() {
  const popup = activePopup();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    const key = `jm_popup_${popup.id}`;
    try {
      const until = Number(localStorage.getItem(key) || "0");
      if (until && Date.now() < until) return; // still in cooldown
    } catch {
      /* storage blocked — just show it */
    }
    const t = setTimeout(() => setOpen(true), popup.delayMs);
    return () => clearTimeout(t);
  }, [popup]);

  if (!popup || !open) return null;

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(
        `jm_popup_${popup.id}`,
        String(Date.now() + popup.cooldownHours * 3600 * 1000)
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jm-popup-title"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-surface shadow-soft-lg animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-surface/80 text-fg-muted backdrop-blur transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>

        {popup.imageUrl && (
          <div className="relative aspect-[16/9] w-full">
            <Image src={popup.imageUrl} alt="" fill className="object-cover" sizes="384px" />
          </div>
        )}

        <div className="p-6 text-center">
          <h2 id="jm-popup-title" className="font-display text-xl font-black tracking-tight text-fg">
            {popup.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{popup.body}</p>
          <a
            href={popup.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            {popup.ctaLabel}
          </a>
          <button
            type="button"
            onClick={close}
            className="mt-2 block w-full text-xs font-medium text-fg-muted hover:text-fg"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

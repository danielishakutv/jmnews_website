import { getAdSlot, type AdSlot as AdSlotConfig } from "@/lib/promotions";
import { cn } from "@/lib/utils";

/**
 * A placed ad space with distinct desktop + mobile dimensions (standard IAB
 * sizes, configured in src/lib/promotions.ts). When a creative image is set it
 * renders the linked ad; otherwise a sized, labelled placeholder so you can see
 * exactly where/how big the space is. Renders nothing when the slot is disabled.
 */
export default function AdSlot({ id, className }: { id: string; className?: string }) {
  const slot = getAdSlot(id);
  if (!slot || !slot.enabled) return null;

  return (
    <div className={cn("w-full", className)}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-fg-muted/60">
        Advertisement
      </p>
      <div className="flex justify-center">
        {/* Desktop dimensions */}
        <div
          className="hidden sm:block"
          style={{ width: slot.desktop.width, height: slot.desktop.height }}
        >
          <Creative slot={slot} />
        </div>
        {/* Mobile dimensions */}
        <div
          className="block sm:hidden"
          style={{ width: slot.mobile.width, height: slot.mobile.height }}
        >
          <Creative slot={slot} />
        </div>
      </div>
    </div>
  );
}

function Creative({ slot }: { slot: AdSlotConfig }) {
  if (slot.imageUrl) {
    return (
      <a
        href={slot.href || "#"}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block h-full w-full overflow-hidden rounded-md"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slot.imageUrl}
          alt={slot.alt || slot.label}
          className="h-full w-full object-cover"
        />
      </a>
    );
  }
  return (
    <div className="grid h-full w-full place-items-center rounded-md border border-dashed border-line-strong bg-surface-2 text-center">
      <span className="px-2 text-[11px] font-medium text-fg-muted">
        {slot.label}
      </span>
    </div>
  );
}

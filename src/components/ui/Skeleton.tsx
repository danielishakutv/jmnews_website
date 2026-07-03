/** Theme-aware shimmer block used by route-level loading skeletons. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

/** A standard article-card skeleton (image + two text lines). */
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
}

/** A horizontal list-row skeleton (thumb + lines). */
export function RowSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="aspect-[4/3] w-28 shrink-0 rounded-lg sm:w-36" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

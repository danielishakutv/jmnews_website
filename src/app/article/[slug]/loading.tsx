import { Skeleton, RowSkeleton } from "@/components/ui/Skeleton";

/** Instant article skeleton: byline, headline, hero image, body. */
export default function Loading() {
  return (
    <div className="bg-surface pb-10">
      <div className="mx-auto max-w-3xl px-4 pt-8 lg:px-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-9 w-full" />
        <Skeleton className="mt-2 h-9 w-4/5" />
        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={i % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"} />
          ))}
        </div>
        <div className="mt-10 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

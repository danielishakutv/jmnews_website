import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

/** Streamed instantly on navigation so a click feels immediate while the
 *  server renders the real page. Mirrors the homepage's hero + grid shape. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="hidden space-y-4 lg:col-span-3 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="lg:col-span-6">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
        <div className="hidden space-y-4 lg:col-span-3 lg:block">
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

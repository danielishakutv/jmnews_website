import { Skeleton, CardSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

/** Instant category skeleton: section header, lead pair, then a list + sidebar. */
export default function Loading() {
  return (
    <div className="pb-10">
      <div className="border-b border-line bg-surface-2/40">
        <div className="mx-auto max-w-[1400px] px-4 py-7 lg:px-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="my-8 h-px bg-line" />
            <div className="grid gap-8 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          </div>
          <aside className="hidden lg:col-span-4 lg:block">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  );
}

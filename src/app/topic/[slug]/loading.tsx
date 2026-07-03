import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pb-10">
      <div className="border-b border-line bg-surface-2/40">
        <div className="mx-auto max-w-[1400px] px-4 py-7 lg:px-6">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

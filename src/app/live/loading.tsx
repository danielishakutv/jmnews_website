import { Skeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <Skeleton className="h-8 w-52" />
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
        <div className="space-y-5 lg:col-span-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

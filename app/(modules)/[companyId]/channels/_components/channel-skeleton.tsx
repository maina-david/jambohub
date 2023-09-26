import { Skeleton } from "@/components/ui/skeleton";

export default function ChannelSkeleton() {
  return (
    <li className="col-span-1 rounded-lg shadow-2xl">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="mt-1 h-4 w-[400px]" />
          <Skeleton className="mt-1 h-4 w-[150px]" />
        </div>
        <Skeleton className="h-44 w-[44px] shrink-0 rounded-full" />
      </div>
      <div>
        <div className="-mt-px flex">
          <div className="my-1 flex w-0 flex-1">
            <Skeleton className="relative -mr-px inline-flex h-40 w-[120px] flex-1 items-center justify-center gap-x-3 rounded-bl-lg" />
          </div>
          <div className="my-1 flex w-0 flex-1">
            <Skeleton className="w-120 relative inline-flex w-[120px] flex-1 items-center justify-center gap-x-3 rounded-br-lg" />
          </div>
        </div>
      </div>
    </li>
  );
}

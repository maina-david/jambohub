'use client'

import { Skeleton } from "@/components/ui/skeleton";

export default function ChannelSkeleton() {
  return (
    <li className="col-span-1 rounded-lg shadow-2xl">
      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </li>
  );
}

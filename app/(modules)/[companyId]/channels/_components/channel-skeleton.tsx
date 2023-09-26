'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function ChannelSkeleton() {
  return (
    <li className="col-span-1 rounded-lg shadow-2xl">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div>
        <div className="-mt-px flex">
          <div className="my-1 flex w-0 flex-1">
            <Skeleton className="h-4 w-[50px]" />
          </div>
          <div className="my-1 flex w-0 flex-1">
            <Skeleton className="h-4 w-[50px]" />
          </div>
        </div>
      </div>
    </li>
  )
}

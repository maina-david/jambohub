'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function TeamMemberSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-[100px]" />
    </div>
  )
}

'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function TeamMemberSkeleton(className) {
  return (
    <div className={cn("flex items-center justify-between space-x-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-[200px] py-2" />
          <Skeleton className="h-4 w-[250px] py-2" />
        </div>
      </div>
      <Skeleton className="h-4 w-[100px]" />
    </div>
  )
}

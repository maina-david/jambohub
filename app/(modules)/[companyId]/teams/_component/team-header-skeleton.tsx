'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function TeamHeaderSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <Separator />
    </>
  )
}

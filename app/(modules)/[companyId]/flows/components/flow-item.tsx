'use client'

import Link from "next/link"
import { Flow } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { FlowOperations } from "./flow-operations"

interface FlowItemProps {
  flow: Pick<Flow, "id" | "companyId" | "name" | "status" | "updatedAt">
}

export function FlowItem({ flow }: FlowItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/${flow.companyId}/playground/${flow.id}`}
          className="font-semibold hover:underline"
        >
          {flow.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            Last Updated on {new Date(flow.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </p>
        </div>
      </div>
      <FlowOperations flow={{ id: flow.id, companyId: flow.companyId, name: flow.name }} />
    </div>
  )
}

FlowItem.Skeleton = function FlowItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

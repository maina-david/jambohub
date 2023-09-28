import Link from "next/link"
import { Flow } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { FlowOperations } from "./flow-operations"

interface FlowItemProps {
  flow: Pick<Flow, "id" | "name" | "status" | "createdAt">
}

export function FlowItem({ flow }: FlowItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href="#"
          className="font-semibold hover:underline"
        >
          {flow.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date(flow.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <FlowOperations flow={{ id: flow.id, name: flow.name }} />
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

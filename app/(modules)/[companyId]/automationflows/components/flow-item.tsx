import Link from "next/link"
import { AutomationFlow } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AutomationflowOperations } from "./flow-operations"

interface AutomationFlowItemProps {
  automationflow: Pick<AutomationFlow, "id" | "name" | "status" | "createdAt">
}

export function AutomationFlowItem({ automationflow }: AutomationFlowItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${automationflow.id}`}
          className="font-semibold hover:underline"
        >
          {automationflow.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(automationflow.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <AutomationflowOperations automationflow={{ id: automationflow.id, name: automationflow.name }} />
    </div>
  )
}

AutomationFlowItem.Skeleton = function AutomationFlowItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

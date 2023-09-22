import Link from "next/link"
import { Chatflow } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatflowOperations } from "./chatflow-operations"

interface ChatflowItemProps {
  chatflow: Pick<Chatflow, "id" | "name" | "status" | "createdAt">
}

export function ChatflowItem({ chatflow }: ChatflowItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${chatflow.id}`}
          className="font-semibold hover:underline"
        >
          {chatflow.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(chatflow.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <ChatflowOperations chatflow={{ id: chatflow.id, name: chatflow.name }} />
    </div>
  )
}

ChatflowItem.Skeleton = function ChatflowItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

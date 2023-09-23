import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

const SendAttachment = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Send Attachment</Label>
            </div>
            <div className="cursor:grab" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
              Send Attachment Node
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The attachment to be sent when a customer&apos;s message is received by our APIs
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default SendAttachment

'use client'

import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'

const SendAttachmentNode = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'custom')
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <div
        className="grid w-full max-w-sm items-center gap-1.5"
      >
        <p className="text-sm font-medium leading-none">
          Send Attachment
        </p>
        <p className="text-sm text-muted-foreground">
          Drag this node to send an attachment to user.
        </p>
        <Input disabled id="attachment" type="file" />
      </div>
    </div>
  )
}

export default SendAttachmentNode

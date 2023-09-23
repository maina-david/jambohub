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
      className="grid w-full max-w-sm items-center gap-1.5"
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <Label htmlFor="attachment">Send Attachment</Label>
      <Input disabled id="attachment" type="file" />
    </div>
  )
}

export default SendAttachmentNode

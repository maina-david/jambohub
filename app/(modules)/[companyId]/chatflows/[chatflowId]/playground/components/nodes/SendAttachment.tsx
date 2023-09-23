import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'

const SendAttachment = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'custom')
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="grid gap-4"
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="attachment">Send Attachment</Label>
        <Input disabled id="attachment" type="file" />
      </div>
    </div>
  )
}

export default SendAttachment

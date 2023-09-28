'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'

const SendText = () => {
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
        className="grid w-full gap-1.5"
      >
        <p className="text-sm font-medium leading-none">
          Send Text
        </p>
        <p className="text-sm text-muted-foreground">
          Drag this to send text to user.
        </p>
        <Textarea disabled placeholder="Type your message here." id="message-2" />
      </div>
    </div>
  )
}

export default SendText

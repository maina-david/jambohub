'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SendTextNodeWait = () => {
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
          Send Text And Wait
        </p>
        <p className="text-sm text-muted-foreground">
          Drag this to send text to user and await response.
        </p>
        <Textarea disabled placeholder="Type your message here." id="message-2" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>
    </div>
  )
}

export default SendTextNodeWait

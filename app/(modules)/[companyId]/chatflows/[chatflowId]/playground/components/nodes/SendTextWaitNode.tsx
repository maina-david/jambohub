import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SendTextWaitNode = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'custom')
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="flex items-center space-x-4 rounded-md border p-4"
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-2">Send Text And Wait</Label>
        <Textarea disabled placeholder="Type your message here." id="message-2" />
        <Select disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>
    </div>
  )
}

export default SendTextWaitNode

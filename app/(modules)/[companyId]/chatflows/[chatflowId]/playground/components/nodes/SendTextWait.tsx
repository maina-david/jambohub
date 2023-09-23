import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SendTextWait = () => {
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
      <Label>Send Text and Wait</Label>
      <Textarea
        disabled
        placeholder="Type the text to be sent..."
        rows={4}
        className="w-full rounded border p-2"
      />
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a prompt" />
        </SelectTrigger>
      </Select>
    </div>
  )
}

export default SendTextWait

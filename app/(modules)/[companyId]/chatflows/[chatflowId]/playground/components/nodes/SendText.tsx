import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SendText = () => {
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
      <div className="flex items-center justify-between">
        <Label htmlFor="maxlength">Send Text</Label>
      </div>
      <div>
        <Textarea
          disabled
          placeholder="Type the text to be sent..."
          rows={4}
          className="w-full rounded border p-2"
        />
      </div>
    </div>
  )
}

export default SendText

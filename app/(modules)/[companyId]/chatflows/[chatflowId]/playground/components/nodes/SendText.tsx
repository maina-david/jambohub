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
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-2">Send Text</Label>
        <Textarea disabled placeholder="Type your message here." id="message-2" />
        <p className="text-sm text-muted-foreground">
          Your message to the user.
        </p>
      </div>
    </div>
  )
}

export default SendText

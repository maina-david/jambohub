'use client'

import React from 'react'

interface StopNodeProps {
  draggable?: boolean
}

export default function StopNode({ draggable }: StopNodeProps) {
  const handleDragStop = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', 'Some data to drag')
  }

  return (
    <div
      className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
      draggable={draggable}
      onDragStart={handleDragStop}
    >
      <p className="text-sm font-medium leading-none">
        STOP
      </p>
      <p className="text-sm text-muted-foreground">
        Drag this to the playground to signify end of yor flow.
      </p>
    </div>
  )
}

'use client'

import React from 'react'

interface StartNodeProps {
  draggable?: boolean
}

export default function StartNode({ draggable }: StartNodeProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', 'Some data to drag')
  }

  return (
    <div
      className="space-y-1"
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <p className="text-sm font-medium leading-none">
        START
      </p>
      <p className="text-sm text-muted-foreground">
        Drag this to the playground to get started.
      </p>
    </div>
  )
}

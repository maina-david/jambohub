'use client'

import React from 'react'

const SendTextWait = () => {
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
      </div>
    </div>
  )
}

export default SendTextWait

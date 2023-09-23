import React from 'react'

const StartNode = () => {
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
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          START
        </p>
        <p className="text-sm text-muted-foreground">
          Drag this to the playground to start building your flow.
        </p>
      </div>
    </div>
  )
}

export default StartNode

import React from 'react'

const StopNode = () => {
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
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          STOP
        </p>
        <p className="text-sm text-muted-foreground">
          Drag to the play ground to signify the end of your flow
        </p>
      </div>
    </div>
  )
}

export default StopNode

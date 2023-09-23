import React from 'react'

const StopNode = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4">
      <div className="flex-1 space-y-1">
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

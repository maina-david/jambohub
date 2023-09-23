import React from 'react'

const StartNode = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
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

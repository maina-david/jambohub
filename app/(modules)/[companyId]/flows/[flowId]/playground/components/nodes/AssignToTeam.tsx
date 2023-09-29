'use client'

import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AssignToTeam = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'custom')
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <div
        className="grid w-full gap-1.5"
      >
        <p className="text-sm font-medium leading-none">
          Assign To Team
        </p>
        <p className="text-sm text-muted-foreground">
          Drag this to assign team to user.
        </p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Team" />
          </SelectTrigger>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>
    </div>
  )
}

export default AssignToTeam

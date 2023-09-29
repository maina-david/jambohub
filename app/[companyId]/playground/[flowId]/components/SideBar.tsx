'use client'

import React from 'react'

export default function SideBar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div>
      <div
        className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
        draggable
        onDragStart={(event) => onDragStart(event, 'sendText')}
      >
        <div
          className="grid w-full items-center gap-1.5"
        >
          <p className="text-sm font-medium leading-none">
            Send Text
          </p>
          <p className="text-sm text-muted-foreground">
            Drag this to send text to user.
          </p>
        </div>
      </div>
      <div
        className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
        draggable
        onDragStart={(event) => onDragStart(event, 'sendTextWait')}
      >
        <div
          className="grid w-full items-center gap-1.5"
        >
          <p className="text-sm font-medium leading-none">
            Send Text And Wait
          </p>
          <p className="text-sm text-muted-foreground">
            Drag this to send text to user and await response.
          </p>
        </div>
      </div>
      <div
        className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
        draggable
        onDragStart={(event) => onDragStart(event, 'sendAttachment')}
      >
        <div
          className="grid w-full items-center gap-1.5"
        >
          <p className="text-sm font-medium leading-none">
            Send Attachment
          </p>
          <p className="text-sm text-muted-foreground">
            Drag this to send an attachment to user.
          </p>
        </div>
      </div>
      <div
        className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
        draggable
        onDragStart={(event) => onDragStart(event, 'assignToTeam')}
      >
        <div
          className="grid w-full items-center gap-1.5"
        >
          <p className="text-sm font-medium leading-none">
            Assign To Team
          </p>
          <p className="text-sm text-muted-foreground">
            Drag this to assign user to a team.
          </p>
        </div>
      </div>
      <div
        className="dndnode flex cursor-grab items-center space-x-4 rounded-md border p-4"
        draggable
        onDragStart={(event) => onDragStart(event, 'exitUser')}
      >
        <div
          className="grid w-full items-center gap-1.5"
        >
          <p className="text-sm font-medium leading-none">
            Exit
          </p>
          <p className="text-sm text-muted-foreground">
            Drag this to exit user from flow.
          </p>
        </div>
      </div>
    </div>
  )
}


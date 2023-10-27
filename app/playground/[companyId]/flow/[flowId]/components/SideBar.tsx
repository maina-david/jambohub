'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function SideBar() {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className={cn("fixed right-0 top-0 h-full w-0 transition-all duration-300 ease-in-out",
      sidebarVisible && 'w-64')}>
      <div className="h-full p-4">
        <Button onClick={toggleSidebar} variant={'ghost'} size={'icon'}>
          {sidebarVisible ? <MoveLeftIcon className='h-4 w-4' /> : <MoveRightIcon className='h-4 w-4' />}
        </Button>
        <Tabs defaultValue='free' className="flex-1 text-center">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="free">
              Free
            </TabsTrigger>
            <TabsTrigger value="pro">
              Pro
            </TabsTrigger>
          </TabsList>
          <TabsContent value="free" className="mt-0 min-h-full border-0 p-0">
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
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
                  Drag this to send text to the user.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
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
                  Drag this to send text and wait for a response.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'sendTextResponse')}
            >
              <div
                className="grid w-full items-center gap-1.5"
              >
                <p className="text-sm font-medium leading-none">
                  Send Text Response
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to send text response to the user.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'sendTextResponseWait')}
            >
              <div
                className="grid w-full items-center gap-1.5"
              >
                <p className="text-sm font-medium leading-none">
                  Send Response And Wait
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to send response and wait.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
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
                  Drag this to assign the user to a team.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pro" className="mt-0 min-h-full border-0 p-0">
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'sendAttachment')}
            >
              <div className="grid w-full items-center gap-1.5">
                <p className="text-sm font-medium leading-none">
                  Send Attachment
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to send a file attachment response.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'initiatePayment')}
            >
              <div className="grid w-full items-center gap-1.5">
                <p className="text-sm font-medium leading-none">
                  Initiate Payment
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to send a payment request.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'performDisbursement')}
            >
              <div className="grid w-full items-center gap-1.5">
                <p className="text-sm font-medium leading-none">
                  Perform Disbursement
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to perform a disbursement transaction.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'authenticateUser')}
            >
              <div className="grid w-full items-center gap-1.5">
                <p className="text-sm font-medium leading-none">
                  Authenticate User
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to authenticate the user.
                </p>
              </div>
            </div>
            <div
              className="flex cursor-grab items-center space-x-4 rounded-md border p-4"
              draggable
              onDragStart={(event) => onDragStart(event, 'customAction')}
            >
              <div className="grid w-full items-center gap-1.5">
                <p className="text-sm font-medium leading-none">
                  Custom Action
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag this to perform a custom action.
                </p>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}


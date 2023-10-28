'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

import React from 'react'

export default function SideBar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Send Text</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This sends a text message to the user and proceeds to the next node in the flow. It does not wait for response from the user
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Send Text And Wait</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This sends a text message to the user and waits for a response from the user. The flow does not proceed without a response being received from user.
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Send Text Response</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This processes the response sent by user and returns a text response to the user.
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Send Response And Wait</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This handles a response from the user and responds to the user then wait for a response back from user. The flow will not proceed without a response from user.
              </HoverCardContent>
            </HoverCard>
            <p className="text-sm text-muted-foreground">
              Drag this to send response and wait for a response from user.
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Assign To Team</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This assigns user to a team for interactive conversation. It will use round-robin method to allocate conversation to team member
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Send Attachment</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This sends a pre-uploaded file attachment in the current company
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Perform Disbursment</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This disburses funds to the user
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Authenticate User</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                This authenticates user requesting password or pin then proceeds with flow
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="node">Custom Action</Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                {/* To update later */}
              </HoverCardContent>
            </HoverCard>
            <p className="text-sm text-muted-foreground">
              Drag this to perform a custom action.
            </p>
          </div>
        </div>
      </TabsContent>

    </Tabs>
  )
}


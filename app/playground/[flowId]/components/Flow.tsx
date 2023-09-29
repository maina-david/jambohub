'use client'

import Link from "next/link"
import axios from 'axios'
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useCallback, useState } from 'react'

import { Separator } from "@/components/ui/separator"

import { Actions } from "../components/actions"
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Controls,
  ReactFlowProvider,
  DefaultEdgeOptions,
  Background,
} from 'reactflow'

import 'reactflow/dist/base.css'

import CustomNode from './CustomNode'
import SendText from './nodes/SendText'
import SendTextWait from './nodes/SendTextWait'
import SendAttachment from './nodes/SendAttachment'
import AssignToTeam from './nodes/AssignToTeam'

import SendTextNode from './flowNodes/sendTextNode'
import SendTextWaitNode from './flowNodes/sendTextWaitNode'
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Flow } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import Exit from "./nodes/Exit"

const nodeTypes = {
  custom: CustomNode,
  sendText: SendTextNode,
  sendTextWait: SendTextWaitNode
}

const initialNodes = [
  {
    id: '1',
    type: 'sendText',
    data: { name: 'Jane Doe', job: 'CEO', emoji: '😎' },
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    type: 'sendTextWait',
    data: { name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
    position: { x: 200, y: 200 },
  },
  {
    id: '3',
    type: 'sendTextWait',
    data: { name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
    position: { x: 75, y: 130 },
  },
]

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
]

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
}

export default function Flow() {
  const params = useParams()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.flowId as string)
  })
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  if (isLoading) {
    return (
      <p>loading....</p>
    )
  }

  if (isError) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="warning" />
        <EmptyPlaceholder.Title>Flow Error</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          There was an error fetching the flow details. Please try again.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    )
  }
  return (
    <ReactFlowProvider>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Link
            href={`/${flow.companyId}/flows`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              'mr-4'
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
          <h2 className="font-semibold tracking-tight transition-colors">{flow.name}</h2>
          <div className="ml-auto flex space-x-2 sm:justify-end">
            <Button variant="secondary">Save</Button>
            <Actions />
          </div>
        </div>
        <Separator />
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="hidden flex-col space-y-4 sm:flex md:order-2">
              <SendText />
              <SendTextWait />
              <SendAttachment />
              <AssignToTeam />
              <Exit/>
            </div>
            <div className="md:order-1">
              <div className="flex h-full flex-col space-y-4">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  fitViewOptions={fitViewOptions}
                  defaultEdgeOptions={defaultEdgeOptions}
                  nodeTypes={nodeTypes}
                >
                  <Background/>
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

const fetchFlowDetails = (flowId: string): Promise<Flow> =>
  axios.get(`/api/flows/${flowId}`).then((response) => response.data)


'use client'

import Link from "next/link"
import axios from 'axios'
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useCallback, useRef, useState } from 'react'

import { Separator } from "@/components/ui/separator"

import { Actions } from "./actions"
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

import SendTextNode from './flowNodes/sendTextNode'
import SendTextWaitNode from './flowNodes/sendTextWaitNode'
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Flow } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import SideBar from "./SideBar"

const nodeTypes = {
  custom: CustomNode,
  sendText: SendTextNode,
  sendTextWait: SendTextWaitNode
}

const initialNodes = [
  {
    id: '1',
    type: 'sendText',
    data: { type: "sendText", name: 'Jane Doe', job: 'CEO', emoji: '😎' },
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    type: 'sendTextWait',
    data: { type: "sendTextWait", name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
    position: { x: 200, y: 200 },
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

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function Flow() {
  const params = useParams()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [elements, setElements] = useState(initialNodes)
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

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

  const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // const onDrop = (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any }; clientX: number; clientY: number }) => {
  //   event.preventDefault()

  //   const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

  //   const type = event.dataTransfer.getData('application/reactflow')

  //   const position = reactFlowInstance.project({
  //     x: event.clientX - reactFlowBounds.left,
  //     y: event.clientY - reactFlowBounds.top,
  //   })

  //   const newNode = {
  //     id: getId(),
  //     type,
  //     position,
  //     data: { type: type, name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
  //   }

  //   setElements((es) => es.concat(newNode))
  // }

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
              <SideBar />
            </div>
            <div className="md:order-1">
              <div className=" reactflow-wrapper flex h-full flex-col space-y-4" ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onLoad={onLoad}
                  onConnect={onConnect}
                  onDragOver={onDragOver}
                  // onDrop={onDrop}
                  fitView
                  fitViewOptions={fitViewOptions}
                  defaultEdgeOptions={defaultEdgeOptions}
                  nodeTypes={nodeTypes}
                >
                  <Background />
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

const fetchFlowDetails = (companyId: string, flowId: string): Promise<Flow> =>
  axios.get(`/api/companies/${companyId}/flows/${flowId}`).then((response) => response.data)


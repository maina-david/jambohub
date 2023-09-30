'use client'

import Link from "next/link"
import axios from 'axios'
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow';
import { Separator } from "@/components/ui/separator"

import { Actions } from "./actions"
import ReactFlow, {
  FitViewOptions,
  Controls,
  ReactFlowProvider,
  DefaultEdgeOptions,
  Background,
  useReactFlow,
  useStoreApi,
  ReactFlowInstance,
  Panel,
} from 'reactflow'

import 'reactflow/dist/base.css'

import SendTextNode from './flowNodes/sendTextNode'
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Flow } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import SideBar from "./SideBar"
import useStore, { RFState } from "./store"

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addDraggedNode: state.addDraggedNode,
})

const nodeTypes = {
  sendText: SendTextNode
}

const fitViewOptions: FitViewOptions = {
  maxZoom: 1.2
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  deletable:true,
  animated: true,
}


function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addDraggedNode } = useStore(selector, shallow)
  const store = useStoreApi()
  const reactFlowInstance = useReactFlow()

  const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any }; clientX: number; clientY: number }) => {
    event.preventDefault()
    const { domNode } = store.getState()

    if (!domNode) {
      return
    }

    const reactFlowBounds = domNode.getBoundingClientRect()

    const type = event.dataTransfer.getData('application/reactflow')

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })

    addDraggedNode(type, position)
  }

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('FlowObject', JSON.stringify(flow));
    }
  }, [reactFlowInstance])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
    >
      <Panel position="top-right">
        <Button
          variant="secondary"
          onClick={onSave}
        >
          Save
        </Button>
      </Panel>
      <Background />
      <Controls />
    </ReactFlow>
  )
}

export default function AutomationFlow() {
  const params = useParams()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

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
          <Actions />
        </div>
      </div>
      <Separator />
      <div className="container h-full py-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="hidden h-full flex-col space-y-4 sm:flex md:order-2">
            <SideBar />
          </div>
          <div className="md:order-1">
            <div className="flex h-full flex-col space-y-4">
              <ReactFlowProvider>
                <Flow />
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const fetchFlowDetails = (companyId: string, flowId: string): Promise<Flow> =>
  axios.get(`/api/companies/${companyId}/flows/${flowId}`).then((response) => response.data)


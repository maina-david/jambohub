'use client'

import Link from "next/link"
import axios from 'axios'
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useCallback, useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
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
  Panel,
} from 'reactflow'

import 'reactflow/dist/base.css'

import SendTextNode from './flowNodes/sendTextNode'
import SendTextWaitNode from "./flowNodes/sendTextWaitNode"
import { useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Flow } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import SideBar from "./SideBar"
import useStore, { RFState } from "./store"
import SendAttachmentNode from "./flowNodes/sendAttachmentNode"
import AssignToTeamNode from "./flowNodes/assignToTeam"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onEdgesDelete: state.onEdgesDelete,
  addDraggedNode: state.addDraggedNode,
})

const nodeTypes = {
  sendText: SendTextNode,
  sendTextWait: SendTextWaitNode,
  sendAttachment: SendAttachmentNode,
  assignToTeam: AssignToTeamNode
}

const fitViewOptions: FitViewOptions = {
  maxZoom: 1.2
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  deletable: true,
  animated: true,
}

const proOptions = { hideAttribution: true }

function Flow({ flowData }) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgesDelete,
    addDraggedNode
  } = useStore(selector, shallow)
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

  useEffect(() => {
    if (flowData && reactFlowInstance) {
      const { x = 0, y = 0, zoom = 1 } = flowData.viewport || {}
      setNodes(flowData.nodes || [])
      setEdges(flowData.edges || [])
      reactFlowInstance.setViewport({ x, y, zoom })
    }
  }, [flowData, reactFlowInstance, setEdges, setNodes])

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      localStorage.setItem('savedFlow', JSON.stringify(flow))
      toast({
        title: "Current Flow Instance:",
        description: (
          <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(flow, null, 2)}
              </code>
            </pre>
          </ScrollArea>
        ),
      })
    }
  }, [reactFlowInstance])

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      onSave()
    }, 2000)

    return () => clearTimeout(saveTimeout);
  }, [
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgesDelete,
    addDraggedNode,
    onSave,
  ])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
      proOptions={proOptions}
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}

export default function AutomationFlow() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

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

  const saveFlow = async () => {
    const savedFlowString = localStorage.getItem('savedFlow')

    if (savedFlowString !== null) {
      setIsSaving(true)
      const savedFlow = JSON.parse(savedFlowString)

      try {
        const response = await axios.patch(
          `/api/companies/${params?.companyId}/flows/${params?.flowId}/save-flow`,
          { flow: savedFlow },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        queryClient.invalidateQueries({ queryKey: ['flowDetails'] })
        toast({
          title: 'Success',
          description: 'Flow saved successfully',
        })
      } catch (error) {
        console.error('Error saving flow:', error);
        toast({
          title: 'Error',
          description: 'Failed to save flow',
          variant: 'destructive'
        })
      } finally {
        setIsSaving(false)
      }
    } else {
      console.warn('No flow data available to save.');
      toast({
        title: 'Error',
        description: 'No flow data available to save',
        variant: 'destructive'
      })
    }
  }

  const onPublish = async () => {
    try {
      setIsPublishing(true)

      const flowId = params?.flowId

      // Determine whether to publish or unpublish based on the current state
      const isCurrentlyPublished = flow?.published || false // Default to false if not available
      const newState = !isCurrentlyPublished

      // Create the payload to send in the PATCH request
      const payload = {
        published: newState,
      }

      // Perform the PATCH request
      const response = await axios.patch(`/api/companies/${flow.companyId}/flows/${flowId}/publish`, payload)

      toast({
        title: "Success",
        description: `Flow ${newState ? 'published' : 'unpublished'} successfully`,
      })

      queryClient.invalidateQueries({ queryKey: ['flowDetails'] })

    } catch (error) {
      console.error('Error toggling flow publication:', error)
      toast({
        title: 'Error',
        description: 'Failed to toggle flow publication. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPublishing(false)
    }
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
          <Button
            variant="default"
            disabled={isSaving}
            onClick={saveFlow}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}{isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant={flow.published ? 'destructive' : 'default'}
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}{flow.published ? 'Unpublish Flow' : 'Publish Flow'}
          </Button>
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
                <Flow flowData={flow.nodes} />
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


'use client'

import Link from "next/link"
import axios from 'axios'
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import React, { useCallback, useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"

import { Actions } from "./actions"
import ReactFlow, {
  Node,
  Controls,
  ReactFlowProvider,
  DefaultEdgeOptions,
  Background,
  useReactFlow,
  useStoreApi,
  Viewport,
} from 'reactflow'

import 'reactflow/dist/base.css'

import SendTextNode from './flowNodes/sendTextNode'
import SendTextWaitNode from "./flowNodes/sendTextWaitNode"
import { useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Flow } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import SideBar from "./SideBar"
import useFlowStore, { RFState } from "@/store/flowStore"
import SendAttachmentNode from "./flowNodes/sendAttachmentNode"
import AssignToTeamNode from "./flowNodes/assignToTeam"
import { toast } from "@/components/ui/use-toast"
import SendTextResponseNode from "./flowNodes/sendTextResponseNode"
import SendTextResponseWaitNode from "./flowNodes/sendTextResponseWaitNode"
import { fetchFlowDetails } from "@/actions/flow-actions"

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  resetStore: state.resetStore,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onEdgesDelete: state.onEdgesDelete,
  addDraggedNode: state.addDraggedNode,
  updateNodeColor: state.updateNodeColor
})

const nodeTypes = {
  sendText: SendTextNode,
  sendTextWait: SendTextWaitNode,
  sendTextResponse: SendTextResponseNode,
  sendTextResponseWait: SendTextResponseWaitNode,
  sendAttachment: SendAttachmentNode,
  assignToTeam: AssignToTeamNode
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  deletable: true,
  animated: false,
}

const defaultViewport: Viewport = { x: 0, y: 0, zoom: 0.75 }

const proOptions = { hideAttribution: true }

function FlowArea({ flowData, flowErrors }) {
  const {
    nodes,
    edges,
    resetStore,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgesDelete,
    addDraggedNode,
    updateNodeColor
  } = useFlowStore(selector)
  const store = useStoreApi()
  const reactFlowInstance = useReactFlow()
  const onDragOver = (event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (event: {
    preventDefault: () => void
    dataTransfer: { getData: (arg0: string) => any }
    clientX: number
    clientY: number
  }) => {
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
      const { x = 0, y = 0, zoom = 0.5 } = flowData.viewport || {}
      setNodes(flowData.nodes || [])
      setEdges(flowData.edges || [])
      reactFlowInstance.setViewport({ x, y, zoom })
      if(flowErrors){
        for(const flowError of flowErrors){
          updateNodeColor(flowError.id, '#FF0000')
        }
      }
    } else {
      resetStore
    }
  }, [flowData, flowErrors, reactFlowInstance, resetStore, setEdges, setNodes, updateNodeColor])

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      localStorage.setItem('savedFlow', JSON.stringify(flow))
    }
  }, [reactFlowInstance])

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      onSave()
    }, 2000)

    return () => clearTimeout(saveTimeout)
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
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
      proOptions={proOptions}
      defaultViewport={defaultViewport}
      zoomOnScroll={false}
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}

export default function AutomationFlow() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { isError, data: flow, isLoading, error } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isPublishing, setIsPublishing] = useState<boolean>(false)
  const [flowErrors, setFlowErrors] = useState([])

  if (isLoading) {
    return (
      <div className="items-center justify-center">
        <Icons.spinner className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  if (isError) {
    console.log("Error fetching flow data:", error)
    if (error instanceof Error) {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {error.message}
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    } else {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            An error occurred while fetching flow details.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

  const saveFlow = async () => {
    const savedFlowString = localStorage.getItem('savedFlow')

    if (savedFlowString !== null) {
      setIsSaving(true)
      const savedFlow = JSON.parse(savedFlowString)

      try {
        await axios.patch(
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
        console.error('Error saving flow:', error)
        toast({
          title: 'Error',
          description: 'Failed to save flow',
          variant: 'destructive'
        })
      } finally {
        setIsSaving(false)
      }
    } else {
      console.warn('No flow data available to save.')
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

      // Perform the POST request
      await axios.patch(`/api/companies/${flow.companyId}/flows/${flowId}/publish`)

      toast({
        title: "Success",
        description: "Flow published successfully",
      })

      queryClient.invalidateQueries({ queryKey: ["flowDetails"] })
    } catch (error) {
      console.error("Error toggling flow publication:", error)
      if (error.response) {
        if (error.response.status === 422) {
          const flowErrors = error.response.data
          setFlowErrors(flowErrors)
          toast({
            title: "Flow Error",
            description: "Please correct the flow errors",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to publish flow. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsPublishing(false)
    }
  }


  return (
    <div className="hidden h-full flex-col md:flex">
      <div className="container sticky top-0 z-40 flex flex-col items-start justify-between space-y-2 border-b bg-background py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
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
          <Actions flow={flow} />
        </div>
      </div>
      <Separator />
      <div className="container py-4">
        <div className="grid items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="flex-col space-y-4 sm:flex md:order-2">
            <SideBar />
          </div>
          <div className="md:order-1">
            <div className="flex h-[85vh] min-h-[85vh] flex-col space-y-4">
              <ReactFlowProvider>
                <FlowArea flowData={flow.flowData} flowErrors={flowErrors} />
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


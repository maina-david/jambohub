'use client'

import React, { useCallback, useRef } from 'react'
import ReactFlow, {
  Controls,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  useStoreApi,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeOrigin,
  ConnectionLineType,
} from 'reactflow'

import { shallow } from 'zustand/shallow'

import useStore, { RFState } from '../store/store'

import 'reactflow/dist/base.css'
import axios from 'axios'
import CustomNode from './CustomNode'
import SendText from './nodes/SendText'
import SendTextWait from './nodes/SendTextWait'
import SendAttachment from './nodes/SendAttachment'
import AssignToTeam from './nodes/AssignToTeam'
import { Separator } from '@/components/ui/separator'
import { PresetSave } from './preset-save'
import { PresetActions } from './preset-actions'
import { useParams } from 'next/navigation'
import { Flow } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import MindMapNode from './nodes/MindMapNode'
import MindMapEdge from './edges/MindMapEdge'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
})

const nodeTypes = {
  mindmap: MindMapNode,
}

const edgeTypes = {
  mindmap: MindMapEdge,
}

const nodeOrigin: NodeOrigin = [0.5, 0.5]
const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 }
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' }

export default function Flow() {
  const params = useParams()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

  // whenever you use multiple values, you should use shallow for making sure that the component only re-renders when one of the values change
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(selector, shallow)
  const connectingNodeId = useRef<string | null>(null)
  const store = useStoreApi()
  const { project } = useReactFlow()

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = store.getState()

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return
    }

    const { top, left } = domNode.getBoundingClientRect()

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX - left,
      y: event.clientY - top,
    })

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    }
  }

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState()
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane')

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const childNodePosition = getChildNodePosition(event, parentNode)

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition)
        }
      }
    },
    [getChildNodePosition]
  )

  if (isLoading) {
    return (
      <p>loading....</p>
    )
  }

  if (isError) {
    return (
      <p>Error fetching flow details</p>
    )
  }
  return (
    <ReactFlowProvider>
      <div className="hidden h-full flex-col md:flex">
        <div className="flex items-center justify-between pb-2">
          <div className="grid gap-1">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors">
              {flow.name}
            </h2>
          </div>
          <div className="ml-auto flex space-x-2 sm:justify-end">
            <PresetSave />
            <PresetActions />
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
            </div>
            <div className="md:order-1">
              <div className="flex h-full flex-col space-y-4">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  nodeOrigin={nodeOrigin}
                  connectionLineStyle={connectionLineStyle}
                  defaultEdgeOptions={defaultEdgeOptions}
                  connectionLineType={ConnectionLineType.Straight}
                  fitView
                  className="bg-teal-50"
                >
                  <Controls showInteractive={false} />
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

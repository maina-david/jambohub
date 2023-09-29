'use client'

import { useState, useCallback, useRef } from 'react'
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
  DefaultEdgeOptions,
  Controls, Panel, NodeOrigin, ReactFlowProvider
} from 'reactflow'
import { shallow } from 'zustand/shallow';

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

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
});

// this places the node origin in the center of a node
const nodeOrigin: NodeOrigin = [0.5, 0.5];

export default function Flow() {
  const params = useParams()
  const { isError, isSuccess, data: flow, isLoading } = useQuery({
    queryKey: ['flowDetails'],
    queryFn: () => fetchFlowDetails(params?.companyId as string, params?.flowId as string)
  })

  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(selector, shallow);

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
                  nodeOrigin={nodeOrigin}
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

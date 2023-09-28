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
  Controls,
  ReactFlowProvider,
  DefaultEdgeOptions,
} from 'reactflow'

import 'reactflow/dist/base.css'

import CustomNode from './CustomNode'
import SendText from './nodes/SendText'
import SendTextWait from './nodes/SendTextWait'
import SendAttachment from './nodes/SendAttachment'
import AssignToTeam from './nodes/AssignToTeam'

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { name: 'Jane Doe', job: 'CEO', emoji: '😎' },
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: { name: 'Tyler Weary', job: 'Designer', emoji: '🤓' },

    position: { x: -200, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    data: { name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
    position: { x: 200, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    data: { name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
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

const ChatFlow = () => {
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

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div className="container h-full py-6">
      <ReactFlowProvider>
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
                onConnect={onConnect}
                fitView
                fitViewOptions={fitViewOptions}
                defaultEdgeOptions={defaultEdgeOptions}
                nodeTypes={nodeTypes}
                className="bg-teal-50"
              >
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  )
}

export default ChatFlow

import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  addEdge,
  Connection,
  OnConnect,
  OnEdgesDelete,
} from 'reactflow'
import { create } from 'zustand'
import { nanoid } from 'nanoid/non-secure'

export type NodeData = {
  value?: string
  replyOption?: string
  teamOption?: string
  fileOption?: string
}

export type NodeType = 'sendText' | 'sendTextWait' | 'sendTextResponse' | 'assignToTeam' | 'sendAttachment'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  resetStore: () => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onEdgesDelete: OnEdgesDelete
  addDraggedNode: (type: string, position: XYPosition, data?: NodeData) => void
  updateSendTextValue: (nodeId: string, value: string) => void
  updateReplyOption: (nodeId: string, option: string, optionType: 'replyOption' | 'teamOption' | 'fileOption') => void
}

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  resetStore: () => {
    set({
      nodes: [],
      edges: [],
    })
  },
  setNodes: (nodes: Node[]) => {
    set({
      nodes: nodes,
    })
  },
  setEdges: (edges: Edge[]) => {
    set({
      edges: edges,
    })
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
  onConnect: (connection: Connection) => {
    const { source, target } = connection
    const sourceNode = get().nodes.find((node) => node.id === source)
    const targetNode = get().nodes.find((node) => node.id === target)

    if (sourceNode && targetNode) {
      const newEdge: Edge = {
        id: `edge-${nanoid()}`,
        source: source as string,
        target: target as string,
      };

      set({
        edges: [...get().edges, newEdge],
        nodes: [
          ...get().nodes,
          {
            ...targetNode,
            parentNode: sourceNode.id,
          },
        ],
      })
    }
  },
  onEdgesDelete: (edges: Edge[]) => {
    set({
      nodes: get().nodes.map((node) => {
        const updatedNode = { ...node }

        edges.forEach((edge) => {
          if (updatedNode.id === edge.target) {
            updatedNode.parentNode = undefined
          }
        })

        return updatedNode
      }),
    })
  },
  addDraggedNode: (type: NodeType, position: XYPosition, data?: NodeData) => {
    const newNode = {
      id: nanoid(),
      type,
      position: {...position},
      data: data || {}
    }
    set({
      nodes: [...get().nodes, newNode],
    })
  },
  updateSendTextValue: (nodeId: string, value: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, value }
        }
        return node
      }),
    })
  },
  updateReplyOption: (nodeId: string, option: string, optionType: 'replyOption' | 'teamOption' | 'fileOption') => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [optionType]: option } } : node
      ),
    })
  },
}))

export default useStore



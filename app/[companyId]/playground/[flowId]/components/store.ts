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

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onEdgesDelete: OnEdgesDelete
  addDraggedNode: (type: string, position: XYPosition) => void
  updateSendTextValue: (nodeId: string, value: string) => void
  updateSendTextWaitValue: (nodeId: string, value: string) => void
  updateSendAttachmentReplyOption: (nodeId: string, option: string) => void
  updateAssignToTeamReplyOption: (nodeId: string, option: string) => void
}

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
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
      set({
        edges: addEdge(connection, get().edges),
        nodes: [
          ...get().nodes,
          {
            ...targetNode,
            parentNode: sourceNode.id
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
  addDraggedNode: (type: string, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type,
      position,
      data: { value: '' }, // use case for different node types
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
  updateSendTextWaitValue: (nodeId: string, value: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, value }
        }
        return node
      }),
    })
  },
  updateSendAttachmentReplyOption: (nodeId: string, replyOption: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, replyOption }
        }
        return node
      }),
    })
  },
  updateAssignToTeamReplyOption: (nodeId: string, replyOption: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, replyOption }
        }
        return node
      }),
    })
  },
}))

export default useStore



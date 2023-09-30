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
} from 'reactflow'
import { create } from 'zustand'
import { nanoid } from 'nanoid/non-secure'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addDraggedNode: (type: string, position: XYPosition) => void
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
    set({
      edges: addEdge(connection, get().edges),
    })
  },
  addDraggedNode: (type: string, position: XYPosition) => {
      const newNode = {
        id: nanoid(),
        type,
        position,
        data : {},
      }
    set({
      nodes: [...get().nodes, newNode],
    })
  }
}))

export default useStore



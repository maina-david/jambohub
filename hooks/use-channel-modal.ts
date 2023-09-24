import { create } from 'zustand'

interface useChannelModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useChannelModal = create<useChannelModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

import { Channel } from '@prisma/client'
import { create } from 'zustand'

interface useChannelModalStore {
  isOpen: boolean
  channel: Channel | null
  onOpen: () => void
  onClose: () => void
  setChannel: (channel: Channel | null) => void
}

export const useChannelModal = create<useChannelModalStore>((set) => ({
  isOpen: false,
  channel: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setChannel: (channel) => {
    set((state) => ({
      ...state,
      channel: channel,
      isOpen: true,
    }));
  },
}))


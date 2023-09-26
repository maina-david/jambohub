import { Team } from '@prisma/client'
import { create } from 'zustand'

interface useTeamModalStore {
  isOpen: boolean
  team: Team | null
  onOpen: () => void
  onClose: () => void
  setTeam: (team: Team | null) => void
}

export const useTeamModal = create<useTeamModalStore>((set) => ({
  isOpen: false,
  team: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, team: null }),
  setTeam: (team) => {
    set((state) => ({
      ...state,
      team: team,
      isOpen: true,
    }))
  },
}))

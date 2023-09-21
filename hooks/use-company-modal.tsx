import { create } from 'zustand'

interface useCompanyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCompanyModal = create<useCompanyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

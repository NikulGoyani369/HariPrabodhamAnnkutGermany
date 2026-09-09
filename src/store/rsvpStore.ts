import { create } from 'zustand'

interface RsvpState {
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useRsvpStore = create<RsvpState>((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}))

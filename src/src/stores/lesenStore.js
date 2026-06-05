import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLesenStore = create(
  persist(
    (set, get) => ({
      seenIds: [],          // id บทอ่านที่เคยอ่านแล้ว — persist

      addSeenId: (id) => {
        const { seenIds } = get()
        if (!seenIds.includes(id)) set({ seenIds: [...seenIds, id] })
      },

      clearSeen: () => set({ seenIds: [] }),
    }),
    {
      name: 'deutsch-lesen',
      partialize: (state) => ({ seenIds: state.seenIds }),
    }
  )
)

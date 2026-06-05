import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDiaryStore = create(
  persist(
    (set, get) => ({
      entries: [],      // [{ id, date, text, corrections, words }]
      streak: 0,
      lastEntryDate: null,

      addEntry: (entry) => {
        const today = new Date().toISOString().split('T')[0]
        const { entries, lastEntryDate, streak } = get()

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const newStreak = lastEntryDate === yesterday ? streak + 1
                        : lastEntryDate === today    ? streak
                        : 1

        set({
          entries: [entry, ...entries],
          streak: newStreak,
          lastEntryDate: today,
        })
      },
    }),
    { name: 'deutsch-diary' }
  )
)

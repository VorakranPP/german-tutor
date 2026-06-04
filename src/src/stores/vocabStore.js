import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// สุ่มเรียงคำโดยให้ level ต่ำ (ยังไม่รู้) ขึ้นก่อน
function buildQueue(words, levels) {
  return [...words].sort((a, b) => {
    const la = levels[a.id] ?? 1
    const lb = levels[b.id] ?? 1
    return la - lb
  })
}

export const useVocabStore = create(
  persist(
    (set, get) => ({
      words: [],
      queue: [],       // คำที่เรียงแล้วพร้อมทบทวน
      currentIndex: 0,
      levels: {},      // { [id]: 1-5 }
      isLoaded: false,

      loadWords: async () => {
        if (get().isLoaded) return
        const res = await fetch('/vocab.json')
        const words = await res.json()
        const levels = get().levels
        set({ words, queue: buildQueue(words, levels), isLoaded: true })
      },

      markCorrect: () => {
        const { queue, currentIndex, levels } = get()
        const word = queue[currentIndex]
        const newLevel = Math.min((levels[word.id] ?? 1) + 1, 5)
        const newLevels = { ...levels, [word.id]: newLevel }
        set({
          levels: newLevels,
          currentIndex: currentIndex + 1,
        })
      },

      markWrong: () => {
        const { queue, currentIndex, levels } = get()
        const word = queue[currentIndex]
        const newLevels = { ...levels, [word.id]: 1 }
        set({
          levels: newLevels,
          currentIndex: currentIndex + 1,
        })
      },

      restart: () => {
        const { words, levels } = get()
        set({ queue: buildQueue(words, levels), currentIndex: 0 })
      },
    }),
    {
      name: 'deutsch-vocab',
      partialize: (state) => ({ levels: state.levels }), // persist เฉพาะ levels
    }
  )
)

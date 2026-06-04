import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// จัดกลุ่มตาม level แล้วสุ่มภายในกลุ่ม — level ต่ำขึ้นก่อน แต่ไม่เรียงตาม ID
function buildQueue(words, levels) {
  const groups = {}
  for (const w of words) {
    const lv = levels[w.id] ?? 1
    if (!groups[lv]) groups[lv] = []
    groups[lv].push(w)
  }
  const result = []
  for (let lv = 1; lv <= 5; lv++) {
    if (!groups[lv]) continue
    // Fisher-Yates shuffle ภายใน level เดียวกัน
    const g = [...groups[lv]]
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]]
    }
    result.push(...g)
  }
  return result
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

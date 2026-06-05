import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      queue: [],
      currentIndex: 0,
      levels: {},           // { [id]: 1-5 } — persist
      sessionCorrect: 0,    // นับรอบนี้
      sessionWrong: 0,
      isLoaded: false,

      loadWords: async () => {
        if (get().isLoaded) return
        const res = await fetch('/vocab.json')
        const words = await res.json()
        const levels = get().levels
        set({ words, queue: buildQueue(words, levels), isLoaded: true })
      },

      // รับ word ที่แสดงอยู่จริง แล้วหา index ที่แม่นยำ
      markCorrect: (word) => {
        const { queue, levels, sessionCorrect } = get()
        const wordIdx = queue.findIndex(w => w.id === word.id)
        const newLevel = Math.min((levels[word.id] ?? 1) + 1, 5)
        set({
          levels: { ...levels, [word.id]: newLevel },
          currentIndex: wordIdx + 1,
          sessionCorrect: sessionCorrect + 1,
        })
      },

      markWrong: (word) => {
        const { queue, levels, sessionWrong } = get()
        const wordIdx = queue.findIndex(w => w.id === word.id)
        set({
          levels: { ...levels, [word.id]: 1 },
          currentIndex: wordIdx + 1,
          sessionWrong: sessionWrong + 1,
        })
      },

      restart: () => {
        const { words, levels } = get()
        set({
          queue: buildQueue(words, levels),
          currentIndex: 0,
          sessionCorrect: 0,
          sessionWrong: 0,
        })
      },
    }),
    {
      name: 'deutsch-vocab',
      partialize: (state) => ({ levels: state.levels }),
    }
  )
)

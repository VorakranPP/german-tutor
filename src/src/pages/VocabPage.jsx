import { useEffect } from 'react'
import { useVocabStore } from '../stores/vocabStore'
import Flashcard from '../components/Flashcard'

export default function VocabPage() {
  const { queue, currentIndex, isLoaded, loadWords, markCorrect, markWrong, restart, levels } = useVocabStore()

  useEffect(() => { loadWords() }, [loadWords])

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64 text-gray-400">กำลังโหลด...</div>
  }

  const total = queue.length
  const done = currentIndex
  const pct = total ? Math.round((done / total) * 100) : 0
  const learned = Object.values(levels).filter(l => l >= 4).length

  // เรียนจบรอบแล้ว
  if (currentIndex >= total) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center" style={{ minHeight: 400 }}>
        <p className="text-5xl">🎉</p>
        <h2 className="text-xl font-bold text-gray-800">ครบรอบแล้ว!</h2>
        <p className="text-gray-500 text-sm">ทบทวนแล้ว {total} คำ · จำได้แล้ว {learned} คำ</p>
        <button
          onClick={restart}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm"
        >
          เริ่มรอบใหม่
        </button>
      </div>
    )
  }

  const word = queue[currentIndex]

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{done}/{total} คำ</span>
        <span className="text-green-600 font-medium">จำได้แล้ว {learned} คำ</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Flashcard */}
      <Flashcard
        key={word.id}
        word={word}
        onCorrect={markCorrect}
        onWrong={markWrong}
      />
    </div>
  )
}

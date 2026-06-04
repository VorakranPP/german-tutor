import { useEffect, useState } from 'react'
import { useVocabStore } from '../stores/vocabStore'
import Flashcard from '../components/Flashcard'

const TYPE_FILTERS = [
  { value: 'all',   label: 'ทั้งหมด' },
  { value: 'noun',  label: 'คำนาม' },
  { value: 'verb',  label: 'กริยา' },
  { value: 'other', label: 'อื่นๆ' },
]

const LEVEL_FILTERS = [
  { value: 'all', label: 'ทุกระดับ' },
  { value: 'A1',  label: 'A1', desc: 'พื้นฐาน' },
  { value: 'A2',  label: 'A2', desc: 'กลาง' },
  { value: 'B1',  label: 'B1', desc: 'เป้าหมาย' },
]

export default function VocabPage() {
  const { queue, currentIndex, isLoaded, loadWords, markCorrect, markWrong, restart, levels } = useVocabStore()
  const [typeFilter, setTypeFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  useEffect(() => { loadWords() }, [loadWords])

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64 text-gray-400">กำลังโหลด...</div>
  }

  const filtered = queue.filter(w =>
    (typeFilter === 'all' || w.type === typeFilter) &&
    (levelFilter === 'all' || w.cerf === levelFilter)
  )

  const currentWord = filtered.find(w => queue.indexOf(w) >= currentIndex)
  const done = filtered.filter(w => queue.indexOf(w) < currentIndex).length
  const total = filtered.length
  const donePct = total ? Math.round((done / total) * 100) : 0
  const learned = Object.values(levels).filter(l => l >= 4).length

  if (!currentWord) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <LevelBar levelFilter={levelFilter} onChange={setLevelFilter} queue={queue} />
        <TypeBar typeFilter={typeFilter} onChange={setTypeFilter} queue={queue} levelFilter={levelFilter} />
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center" style={{ minHeight: 300 }}>
          <p className="text-5xl">🎉</p>
          <h2 className="text-xl font-bold text-gray-800">ครบรอบแล้ว!</h2>
          <p className="text-gray-500 text-sm">ทบทวนแล้ว {total} คำ · จำได้แล้ว {learned} คำ</p>
          <button onClick={restart} className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm">
            เริ่มรอบใหม่
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <LevelBar levelFilter={levelFilter} onChange={setLevelFilter} queue={queue} />
      <TypeBar typeFilter={typeFilter} onChange={setTypeFilter} queue={queue} levelFilter={levelFilter} />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{done}/{total} คำ</span>
        <span className="text-green-600 font-medium">จำได้แล้ว {learned} คำ</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${donePct}%` }} />
      </div>

      <Flashcard key={currentWord.id} word={currentWord} onCorrect={markCorrect} onWrong={markWrong} />
    </div>
  )
}

function LevelBar({ levelFilter, onChange, queue }) {
  const counts = { all: queue.length }
  queue.forEach(w => { counts[w.cerf] = (counts[w.cerf] ?? 0) + 1 })

  const LEVEL_COLOR = {
    A1: { active: 'bg-emerald-500 border-emerald-500 text-white', inactive: 'text-emerald-600 border-emerald-200' },
    A2: { active: 'bg-amber-500 border-amber-500 text-white', inactive: 'text-amber-600 border-amber-200' },
    B1: { active: 'bg-blue-600 border-blue-600 text-white', inactive: 'text-blue-600 border-blue-200' },
    all: { active: 'bg-gray-700 border-gray-700 text-white', inactive: 'text-gray-500 border-gray-200' },
  }

  return (
    <div className="flex gap-2">
      {LEVEL_FILTERS.map(({ value, label, desc }) => {
        const color = LEVEL_COLOR[value]
        const isActive = levelFilter === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${isActive ? color.active : `bg-white ${color.inactive}`}`}
          >
            {label}
            <span className={`block text-xs font-normal ${isActive ? 'opacity-80' : 'text-gray-300'}`}>
              {counts[value] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function TypeBar({ typeFilter, onChange, queue, levelFilter }) {
  const subset = levelFilter === 'all' ? queue : queue.filter(w => w.cerf === levelFilter)
  const counts = { all: subset.length }
  subset.forEach(w => { counts[w.type] = (counts[w.type] ?? 0) + 1 })

  return (
    <div className="flex gap-2">
      {TYPE_FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors
            ${typeFilter === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          {label}
          <span className={`block text-xs ${typeFilter === value ? 'text-blue-100' : 'text-gray-300'}`}>
            {counts[value] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}

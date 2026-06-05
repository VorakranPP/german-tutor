import { useEffect, useState } from 'react'
import { useVocabStore } from '../stores/vocabStore'
import Flashcard from '../components/Flashcard'

const CATEGORY_FILTERS = [
  { value: 'all',           label: '🗂 Alle' },
  { value: 'Alltag',        label: '☀️ Alltag' },
  { value: 'Arbeit',        label: '💼 Arbeit' },
  { value: 'Familie',       label: '👨‍👩‍👧 Familie' },
  { value: 'Gesundheit',    label: '🏥 Gesundheit' },
  { value: 'Reisen',        label: '✈️ Reisen' },
  { value: 'Wohnen',        label: '🏠 Wohnen' },
  { value: 'Bildung',       label: '📚 Bildung' },
  { value: 'Einkaufen',     label: '🛒 Einkaufen' },
  { value: 'Freizeit',      label: '🎯 Freizeit' },
  { value: 'Natur',         label: '🌿 Natur' },
  { value: 'Kommunikation', label: '💬 Kommunikation' },
  { value: 'Gesellschaft',  label: '🏛 Gesellschaft' },
  { value: 'Sprache',       label: '🔤 Sprache' },
  { value: 'Sonstige',      label: '📌 Sonstige' },
]

const TYPE_FILTERS = [
  { value: 'all',   label: 'Alle' },
  { value: 'noun',  label: 'Nomen' },
  { value: 'verb',  label: 'Verben' },
  { value: 'other', label: 'Andere' },
]

const LEVEL_FILTERS = [
  { value: 'all', label: 'Alle' },
  { value: 'A1',  label: 'A1', desc: 'Anfänger' },
  { value: 'A2',  label: 'A2', desc: 'Grundlagen' },
  { value: 'B1',  label: 'B1', desc: 'Ziel' },
]

export default function VocabPage() {
  const {
    queue, currentIndex, isLoaded, loadWords,
    markCorrect, markWrong, restart,
    levels, sessionCorrect, sessionWrong,
  } = useVocabStore()

  const [typeFilter, setTypeFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => { loadWords() }, [loadWords])

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64 text-gray-400">กำลังโหลด...</div>
  }

  const filtered = queue.filter(w =>
    (typeFilter === 'all' || w.type === typeFilter) &&
    (levelFilter === 'all' || w.cerf === levelFilter) &&
    (categoryFilter === 'all' || w.category === categoryFilter)
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
        <CategoryBar categoryFilter={categoryFilter} onChange={setCategoryFilter} />
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
    <div className="p-4 flex flex-col gap-3">
      <LevelBar levelFilter={levelFilter} onChange={setLevelFilter} queue={queue} />
      <CategoryBar categoryFilter={categoryFilter} onChange={setCategoryFilter} />
      <TypeBar typeFilter={typeFilter} onChange={setTypeFilter} queue={queue} levelFilter={levelFilter} />

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{done}/{total} คำ</span>
        <span className="text-green-600">จำได้แล้ว {learned} คำ</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${donePct}%` }} />
      </div>

      {/* Flashcard + Stats side by side */}
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <Flashcard
            key={currentWord.id}
            word={currentWord}
            onCorrect={() => markCorrect(currentWord)}
            onWrong={() => markWrong(currentWord)}
          />
        </div>

        {/* Stats panel */}
        <div className="flex flex-col gap-2 w-20 pt-1">
          <div className="rounded-xl bg-green-50 border border-green-100 px-2 py-3 flex flex-col items-center">
            <span className="text-lg font-bold text-green-600">{sessionCorrect}</span>
            <span className="text-xs text-green-400 text-center leading-tight">รู้<br/>แล้ว</span>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-100 px-2 py-3 flex flex-col items-center">
            <span className="text-lg font-bold text-red-500">{sessionWrong}</span>
            <span className="text-xs text-red-400 text-center leading-tight">ยัง<br/>ไม่รู้</span>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-2 py-3 flex flex-col items-center">
            <span className="text-lg font-bold text-gray-500">{sessionCorrect + sessionWrong}</span>
            <span className="text-xs text-gray-400 text-center leading-tight">ทั้ง<br/>หมด</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryBar({ categoryFilter, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORY_FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
            ${categoryFilter === value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white/70 text-gray-500 border-gray-200'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function LevelBar({ levelFilter, onChange, queue }) {
  const counts = { all: queue.length }
  queue.forEach(w => { counts[w.cerf] = (counts[w.cerf] ?? 0) + 1 })

  const LEVEL_COLOR = {
    A1:  { active: 'bg-emerald-500 border-emerald-500 text-white', inactive: 'text-emerald-600 border-emerald-200' },
    A2:  { active: 'bg-amber-500 border-amber-500 text-white',     inactive: 'text-amber-600 border-amber-200' },
    B1:  { active: 'bg-blue-600 border-blue-600 text-white',       inactive: 'text-blue-600 border-blue-200' },
    all: { active: 'bg-gray-700 border-gray-700 text-white',       inactive: 'text-gray-500 border-gray-200' },
  }

  return (
    <div className="flex gap-2">
      {LEVEL_FILTERS.map(({ value, label }) => {
        const color = LEVEL_COLOR[value]
        const isActive = levelFilter === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${isActive ? color.active : `bg-white/70 ${color.inactive}`}`}
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
            ${typeFilter === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/70 text-gray-500 border-gray-200'}`}
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

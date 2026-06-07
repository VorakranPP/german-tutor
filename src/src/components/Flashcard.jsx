import { useState } from 'react'
import { useVocabStore } from '../stores/vocabStore'

const TYPE_LABEL = { noun: 'Nomen', verb: 'Verb', other: 'Andere' }

function getFullPlural(de, plural) {
  if (!plural || plural === '') return null
  // ดึง base word ออกจาก article
  let base = de
  for (const art of ['der ', 'die ', 'das ']) {
    if (de.toLowerCase().startsWith(art)) { base = de.slice(art.length); break }
  }
  if (plural === '-') return `die ${base}`
  // ตัด - นำหน้าออก แล้วต่อท้าย base
  const suffix = plural.replace(/^-/, '')
  return `die ${base}${suffix}`
}
const TYPE_COLOR = { noun: 'bg-blue-100 text-blue-700', verb: 'bg-green-100 text-green-700', other: 'bg-gray-100 text-gray-600' }

export default function Flashcard({ word, onCorrect, onWrong }) {
  const [flipped, setFlipped] = useState(false)
  const { levels } = useVocabStore()
  const isMemorized = (levels[word.id] ?? 1) >= 4

  function handleFlip() {
    setFlipped(true)
  }

  function handleAnswer(correct) {
    setFlipped(false)
    if (correct) onCorrect()
    else onWrong()
  }

  const extra = word.type === 'noun'
    ? word.plural ? `Plural: ${getFullPlural(word.de, word.plural)}` : ''
    : word.conjugation ?? ''

  const handleMarkMemorized = () => {
    const { markCorrect } = useVocabStore()
    const currentLevel = levels[word.id] ?? 1
    if (currentLevel < 4) {
      const increments = 4 - currentLevel
      for (let i = 0; i < increments; i++) {
        markCorrect(word)
      }
    }
  }

  const handleResetWord = () => {
    const { markWrong } = useVocabStore()
    if (isMemorized) markWrong(word)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">

      {/* Memorized badge + actions */}
      <div className="w-full flex items-center justify-between">
        {isMemorized && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✅ จำได้แล้ว</span>}
        {!isMemorized && <div />}
        <div className="flex gap-1">
          {!isMemorized && (
            <button
              onClick={handleMarkMemorized}
              className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
              title="บันทึกว่าจำคำนี้แล้ว"
            >
              💾 บันทึก
            </button>
          )}
          {isMemorized && (
            <button
              onClick={handleResetWord}
              className="text-sm px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors"
              title="รีเซ็ต เพื่อฝึกคำนี้อีก"
            >
              🔄 รีเซ็ท
            </button>
          )}
        </div>
      </div>

      {/* Card */}
      <div
        onClick={!flipped ? handleFlip : undefined}
        className={`w-full rounded-2xl shadow-lg border transition-all duration-200 cursor-pointer select-none
          ${flipped ? 'bg-white border-blue-200 cursor-default' : 'bg-white border-gray-200 active:scale-95'}`}
        style={{ minHeight: 380 }}
      >
        {!flipped ? (
          // หน้าหน้า — คำภาษาเยอรมัน
          <div className="flex flex-col items-center justify-center h-full p-8 gap-4" style={{ minHeight: 380 }}>
            <span className={`text-base font-medium px-4 py-1 rounded-full ${TYPE_COLOR[word.type] ?? TYPE_COLOR.other}`}>
              {TYPE_LABEL[word.type] ?? word.type}
            </span>
            <p className="text-6xl font-bold text-gray-800 text-center">{word.de}</p>
            {word.pronunciation && (
              <p className="text-lg text-blue-400 font-medium">[{word.pronunciation}]</p>
            )}
            {extra && <p className="text-lg text-gray-400">{extra}</p>}
            <p className="text-sm text-gray-300 mt-3">👆 แตะเพื่อดูคำแปล</p>
          </div>
        ) : (
          // หลังการ์ด — คำแปล + ตัวอย่าง
          <div className="flex flex-col p-8 gap-4" style={{ minHeight: 380 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${TYPE_COLOR[word.type] ?? TYPE_COLOR.other}`}>
                  {TYPE_LABEL[word.type] ?? word.type}
                </span>
                <span className="text-base text-gray-400">{word.de}</span>
                {word.pronunciation && (
                  <span className="text-sm text-blue-400">[{word.pronunciation}]</span>
                )}
              </div>
              {word.cerf && (
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                  {word.cerf}
                </span>
              )}
            </div>
            <p className="text-5xl font-bold text-blue-700">{word.th}</p>
            {extra && <p className="text-base text-gray-400">{extra}</p>}
            {word.example && (
              <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-base text-gray-700 italic">{word.example}</p>
                {word.example_th && (
                  <p className="text-sm text-gray-400 mt-2">{word.example_th}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ปุ่มตอบ — แสดงหลัง flip */}
      {flipped && (
        <div className="flex gap-3 w-full">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm border border-red-100 active:scale-95 transition-transform"
          >
            ❌ ไม่รู้
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 rounded-xl bg-green-50 text-green-600 font-semibold text-sm border border-green-100 active:scale-95 transition-transform"
          >
            ✅ รู้แล้ว
          </button>
        </div>
      )}
    </div>
  )
}

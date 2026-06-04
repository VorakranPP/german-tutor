import { useState } from 'react'

const TYPE_LABEL = { noun: 'คำนาม', verb: 'กริยา', other: 'อื่นๆ' }

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

  function handleFlip() {
    setFlipped(true)
  }

  function handleAnswer(correct) {
    setFlipped(false)
    if (correct) onCorrect()
    else onWrong()
  }

  const extra = word.type === 'noun'
    ? word.plural ? `พหูพจน์: ${getFullPlural(word.de, word.plural)}` : ''
    : word.conjugation ?? ''

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">

      {/* Card */}
      <div
        onClick={!flipped ? handleFlip : undefined}
        className={`w-full rounded-2xl shadow-lg border transition-all duration-200 cursor-pointer select-none
          ${flipped ? 'bg-white border-blue-200 cursor-default' : 'bg-white border-gray-200 active:scale-95'}`}
        style={{ minHeight: 260 }}
      >
        {!flipped ? (
          // หน้าหน้า — คำภาษาเยอรมัน
          <div className="flex flex-col items-center justify-center h-full p-8 gap-3" style={{ minHeight: 260 }}>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[word.type] ?? TYPE_COLOR.other}`}>
              {TYPE_LABEL[word.type] ?? word.type}
            </span>
            <p className="text-3xl font-bold text-gray-800 text-center">{word.de}</p>
            {extra && <p className="text-sm text-gray-400">{extra}</p>}
            <p className="text-xs text-gray-300 mt-4">👆 แตะเพื่อดูคำแปล</p>
          </div>
        ) : (
          // หลังการ์ด — คำแปล + ตัวอย่าง
          <div className="flex flex-col p-6 gap-3" style={{ minHeight: 260 }}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[word.type] ?? TYPE_COLOR.other}`}>
                {TYPE_LABEL[word.type] ?? word.type}
              </span>
              <span className="text-sm text-gray-400">{word.de}</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{word.th}</p>
            {extra && <p className="text-sm text-gray-400">{extra}</p>}
            {word.example && (
              <div className="mt-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-sm text-gray-700 italic">{word.example}</p>
                {word.example_th && (
                  <p className="text-xs text-gray-400 mt-1">{word.example_th}</p>
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

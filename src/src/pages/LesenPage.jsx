import { useState, useEffect, useRef } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { useVocabStore } from '../stores/vocabStore'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SEEN_KEY = 'lesen-seen-ids'

function getSeenIds() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]') } catch { return [] }
}
function addSeenId(id) {
  const seen = getSeenIds()
  if (!seen.includes(id)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]))
}
function clearSeen() { localStorage.removeItem(SEEN_KEY) }

export default function LesenPage() {
  const [passages, setPassages] = useState([])
  const [current, setCurrent] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [popup, setPopup] = useState(null) // { word, match, x, y }
  const [generating, setGenerating] = useState(false)
  const { words: vocabWords, penalizeWords } = useVocabStore()
  const passageRef = useRef()

  useEffect(() => {
    fetch('/reading_passages.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setPassages(data))
      .catch(() => setPassages([]))
  }, [])

  function pickRandom() {
    if (!passages.length) { generateNew(); return }
    const seen = getSeenIds()
    const unseen = passages.filter(p => !seen.includes(p.id))
    const pool = unseen.length > 0 ? unseen : passages // ถ้าอ่านหมดแล้วสุ่มใหม่
    if (unseen.length === 0) clearSeen()
    const pick = pool[Math.floor(Math.random() * pool.length)]
    addSeenId(pick.id)
    setCurrent(pick)
    setAnswers({})
    setSubmitted(false)
    setPopup(null)
  }

  async function generateNew() {
    setGenerating(true)
    const topics = ['ชีวิตในเมือง', 'การท่องเที่ยว', 'สุขภาพ', 'การทำงาน', 'ครอบครัว']
    const topic = topics[Math.floor(Math.random() * topics.length)]
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: `สร้างบทอ่านภาษาเยอรมันระดับ B1 พร้อมคำถาม 5 ข้อ ตอบ JSON เท่านั้น:
{"title":"...","topic_th":"${topic}","passage":"130-160 คำ B1","questions":[{"q":"คำถามไทย","options":["ก)...","ข)...","ค)..."],"answer":0}]}` }],
      })
      const data = JSON.parse(msg.content[0].text.trim().replace(/```json|```/g, '').trim())
      data.id = `gen-${Date.now()}`
      setCurrent(data)
      setAnswers({})
      setSubmitted(false)
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  function handleWordClick(word, e) {
    const clean = word.replace(/[.,!?;:"()]/g, '').toLowerCase()
    if (clean.length < 2) return
    const match = vocabWords.find(v => {
      const de = v.de.toLowerCase().replace(/^(der|die|das|sich)\s+/i, '')
      return de === clean || de.startsWith(clean) || clean.startsWith(de.slice(0, 4))
    })
    const rect = passageRef.current?.getBoundingClientRect()
    const btnRect = e.target.getBoundingClientRect()
    setPopup({
      word: word.replace(/[.,!?;:"()]/g, ''),
      match,
      x: btnRect.left - (rect?.left ?? 0),
      y: btnRect.bottom - (rect?.top ?? 0) + 4,
    })
  }

  function handleAddToVocab() {
    if (popup?.match) penalizeWords([popup.match.de])
    setPopup(null)
  }

  function handleAnswer(qi, ans) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qi]: ans }))
  }

  const score = submitted
    ? current?.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0)
    : null

  if (!current && !generating) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-gray-800">📖 Lesen</h2>
          <p className="text-xs text-gray-400">ฝึกอ่านภาษาเยอรมัน + ทดสอบความเข้าใจ</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-5xl">📖</p>
          <p className="text-gray-500 text-sm">
            {passages.length > 0 ? `มี ${passages.length} บทอ่านในคลัง` : 'กำลังโหลด...'}
          </p>
          <button
            onClick={pickRandom}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            เริ่มอ่าน →
          </button>
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Claude กำลังสร้างบทอ่าน...
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-sm">{current.title}</h2>
          <p className="text-xs text-gray-400">{current.topic_th}</p>
        </div>
        <button
          onClick={pickRandom}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium"
        >
          บทอ่านใหม่
        </button>
      </div>

      {/* Passage — คลิกคำเพื่อดูความหมาย */}
      <div
        ref={passageRef}
        className="relative bg-white/80 border border-gray-200 rounded-xl p-4"
        onClick={() => setPopup(null)}
      >
        <p className="text-xs text-gray-400 mb-2">👆 แตะคำที่ไม่รู้จักเพื่อดูความหมาย</p>
        <p className="text-sm text-gray-800 leading-7">
          {current.passage.split(/(\s+)/).map((token, i) =>
            token.trim() ? (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); handleWordClick(token, e) }}
                className="hover:bg-blue-50 hover:text-blue-700 rounded px-0.5 transition-colors"
              >
                {token}
              </button>
            ) : token
          )}
        </p>

        {/* Word popup */}
        {popup && (
          <div
            className="absolute z-20 bg-white border border-blue-200 rounded-xl shadow-lg p-3 min-w-48 max-w-64"
            style={{ left: Math.min(popup.x, 200), top: popup.y }}
            onClick={e => e.stopPropagation()}
          >
            <p className="font-bold text-gray-800">{popup.match?.de ?? popup.word}</p>
            {popup.match ? (
              <>
                <p className="text-blue-600 font-medium">{popup.match.th}</p>
                {popup.match.pronunciation && (
                  <p className="text-xs text-gray-400">[{popup.match.pronunciation}]</p>
                )}
                <button
                  onClick={handleAddToVocab}
                  className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                >
                  + เพิ่มเข้า Vokabeln
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-400">ไม่พบในคลัง</p>
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-700">คำถาม</p>
        {current.questions.map((q, qi) => (
          <div key={qi} className="bg-white/80 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-sm text-gray-800">{qi + 1}. {q.q}</p>
            {q.options.map((opt, oi) => {
              let cls = 'w-full text-left py-2 px-3 rounded-lg text-sm border transition-colors '
              if (!submitted) {
                cls += answers[qi] === oi
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              } else {
                if (oi === q.answer) cls += 'bg-green-100 text-green-700 border-green-300 font-semibold'
                else if (answers[qi] === oi) cls += 'bg-red-100 text-red-600 border-red-200 line-through'
                else cls += 'bg-gray-50 text-gray-400 border-gray-100'
              }
              return (
                <button key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>
                  {opt}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Submit / Score */}
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < current.questions.length}
          className="py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40"
        >
          ส่งคำตอบ
        </button>
      ) : (
        <div className={`rounded-xl p-4 text-center border ${
          score >= 4 ? 'bg-green-50 border-green-200' :
          score >= 3 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'}`}
        >
          <p className="text-3xl font-bold mb-1">
            {score >= 4 ? '🎉' : score >= 3 ? '👍' : '📚'}
          </p>
          <p className="font-bold text-lg">{score} / {current.questions.length} คะแนน</p>
          <p className="text-sm text-gray-500 mt-1">
            {score === 5 ? 'ยอดเยี่ยม!' : score >= 3 ? 'ดี ลองบทต่อไป' : 'อ่านอีกครั้งแล้วลองใหม่'}
          </p>
          <button onClick={pickRandom} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
            บทอ่านถัดไป →
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { client } from '../lib/client.js'
import { useVocabStore } from '../stores/vocabStore'
import { useLesenStore } from '../stores/lesenStore'

export default function LesenPage() {
  const [passages, setPassages] = useState([])
  const [current, setCurrent] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [popup, setPopup] = useState(null) // { word, match, x, y }
  const [generating, setGenerating] = useState(false)
  const [showThai, setShowThai] = useState({}) // { [qi]: bool }
  const [wordCache, setWordCache] = useState({})
  const { words: vocabWords, penalizeWords } = useVocabStore()
  const { seenIds, addSeenId, clearSeen } = useLesenStore()
  const passageRef = useRef()

  useEffect(() => {
    fetch('/reading_passages.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setPassages(data))
      .catch(() => setPassages([]))

    fetch('/word_cache.json')
      .then(r => r.ok ? r.json() : {})
      .then(data => setWordCache(data))
      .catch(() => setWordCache({}))
  }, [])

  function pickRandom() {
    if (!passages.length) { generateNew(); return }
    const unseen = passages.filter(p => !seenIds.includes(p.id))
    const pool = unseen.length > 0 ? unseen : passages
    if (unseen.length === 0) clearSeen()
    const pick = pool[Math.floor(Math.random() * pool.length)]
    addSeenId(pick.id)
    setCurrent(pick)
    setAnswers({})
    setSubmitted(false)
    setPopup(null)
    setShowThai({})
  }

  async function generateNew() {
    setGenerating(true)
    const topics = ['ชีวิตในเมือง', 'การท่องเที่ยว', 'สุขภาพ', 'การทำงาน', 'ครอบครัว']
    const topic = topics[Math.floor(Math.random() * topics.length)]
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: [{ type: 'text', text: 'คุณคือครูสอนภาษาเยอรมัน สร้างสื่อการเรียนระดับ B1 ตอบเป็น JSON เท่านั้น', cache_control: { type: 'ephemeral' } }],
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

  async function handleWordClick(word, e) {
    const clean = word.replace(/[.,!?;:"()]/g, '').toLowerCase()
    if (clean.length < 2) return
    const match = vocabWords.find(v => {
      const de = v.de.toLowerCase().replace(/^(der|die|das|sich)\s+/i, '')
      return de === clean || de.startsWith(clean) || clean.startsWith(de.slice(0, 4))
    })
    const rect = passageRef.current?.getBoundingClientRect()
    const btnRect = e.target.getBoundingClientRect()
    const x = Math.min(btnRect.left - (rect?.left ?? 0), 180)
    const y = btnRect.bottom - (rect?.top ?? 0) + 4

    if (match) {
      setPopup({ word: word.replace(/[.,!?;:"()]/g, ''), match, x, y })
      return
    }

    // Check cache first (free lookup)
    if (wordCache[clean]) {
      setPopup({ word: word.replace(/[.,!?;:"()]/g, ''), match: null, x, y, translated: wordCache[clean] })
      return
    }

    // ไม่มีในคลัง → แปลด้วย Claude
    setPopup({ word: word.replace(/[.,!?;:"()]/g, ''), match: null, x, y, loading: true })
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 128,
        messages: [{ role: 'user', content: `แปลคำเยอรมันนี้เป็นภาษาไทยสั้นๆ ตอบ JSON: {"th":"คำแปล","type":"noun/verb/other"}
คำ: ${clean}` }],
      })
      const data = JSON.parse(msg.content[0].text.trim().replace(/```json|```/g, '').trim())
      setPopup(p => ({ ...p, loading: false, translated: data.th }))
    } catch {
      setPopup(p => ({ ...p, loading: false, translated: '(แปลไม่ได้)' }))
    }
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
          <p className="text-xs text-gray-400">Deutsch lesen und Verständnis testen</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-5xl">📖</p>
          <p className="text-gray-500 text-sm">
            {passages.length > 0 ? `${passages.length} Lesestücke im Archiv` : 'Lädt...'}
          </p>
          <button
            onClick={pickRandom}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Jetzt lesen →
          </button>
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Claude erstellt ein Lesestück...
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
          Neues Lesestück
        </button>
      </div>

      {/* Passage — คลิกคำเพื่อดูความหมาย */}
      <div
        ref={passageRef}
        className="relative bg-white/80 border border-gray-200 rounded-xl p-4"
        onClick={() => setPopup(null)}
      >
        <p className="text-xs text-gray-400 mb-2">👆 Tippe auf ein Wort, um die Bedeutung zu sehen</p>
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
                <button onClick={handleAddToVocab}
                  className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">
                  + Zu Vokabeln hinzufügen
                </button>
              </>
            ) : popup.loading ? (
              <p className="text-xs text-gray-400 animate-pulse">Wird übersetzt...</p>
            ) : popup.translated ? (
              <>
                <p className="text-blue-600 font-medium">{popup.translated}</p>
                <p className="text-xs text-gray-400 mt-0.5">Übersetzt von Claude · nicht im Archiv</p>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-700">Fragen</p>
        {current.questions.map((q, qi) => (
          <div key={qi} className="bg-white/80 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-800 flex-1">{qi + 1}. {q.q}</p>
              {q.q_th && (
                <button
                  onClick={() => setShowThai(prev => ({ ...prev, [qi]: !prev[qi] }))}
                  className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title={showThai[qi] ? 'Thai verbergen' : 'Thai zeigen'}
                >
                  {showThai[qi] ? '🙈 Ausblenden' : '👁 Thai'}
                </button>
              )}
            </div>
            {showThai[qi] && q.q_th && (
              <p className="text-xs text-gray-500 pl-4 border-l-2 border-gray-300">{q.q_th}</p>
            )}
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
                <div key={oi} className="flex flex-col gap-1">
                  <button className={cls} onClick={() => handleAnswer(qi, oi)}>
                    {opt}
                  </button>
                  {showThai[qi] && q.options_th?.[oi] && (
                    <p className="text-xs text-gray-400 pl-3">{q.options_th[oi]}</p>
                  )}
                </div>
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
          Antworten abgeben
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
          <p className="font-bold text-lg">{score} / {current.questions.length} Punkte</p>
          <p className="text-sm text-gray-500 mt-1">
            {score === 5 ? 'Perfekt!' : score >= 3 ? 'Gut! Nächstes Lesestück.' : 'Lies nochmal und versuche es erneut.'}
          </p>
          <button onClick={pickRandom} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
            Nächstes Lesestück →
          </button>
        </div>
      )}
    </div>
  )
}

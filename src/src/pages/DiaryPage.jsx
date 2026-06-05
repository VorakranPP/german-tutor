import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { useDiaryStore } from '../stores/diaryStore'
import { useVocabStore } from '../stores/vocabStore'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

export default function DiaryPage() {
  const { entries, streak, addEntry } = useDiaryStore()
  const [view, setView] = useState('write') // 'write' | 'history'

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800">📝 Tagebuch</h2>
          <p className="text-xs text-gray-400">เขียนภาษาเยอรมัน Claude แก้ให้</p>
        </div>
        <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-orange-500 text-sm">{streak}</span>
          <span className="text-xs text-orange-400">วัน</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
            ${view === 'write' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          เขียนวันนี้
        </button>
        <button
          onClick={() => setView('history')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
            ${view === 'history' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          ประวัติ ({entries.length})
        </button>
      </div>

      {view === 'write' ? (
        <WriteEntry onSave={addEntry} />
      ) : (
        <HistoryView entries={entries} />
      )}
    </div>
  )
}

function WriteEntry({ onSave }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { words: vocabWords } = useVocabStore()

  async function handleSubmit() {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)

    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `แก้ไขไดอารี่ภาษาเยอรมันนี้และอธิบายเป็นภาษาไทย

ข้อความ:
${text}

ตอบ JSON:
{
  "corrected": "ข้อความที่แก้ไขแล้ว",
  "corrections": [
    { "original": "คำ/ประโยคที่ผิด", "fixed": "ที่ถูกต้อง", "explanation": "อธิบายภาษาไทย" }
  ],
  "wrong_words": ["คำที่สะกดหรือใช้ผิด"],
  "overall": "ข้อคิดเห็นโดยรวมภาษาไทย (1-2 ประโยค)"
}`,
        }],
      })

      const parsed = JSON.parse(
        msg.content[0].text.trim().replace(/```json|```/g, '').trim()
      )

      // auto-add wrong words to vocab bank ถ้าพบในรายการ
      const addedWords = []
      if (parsed.wrong_words?.length && vocabWords.length) {
        parsed.wrong_words.forEach(w => {
          const found = vocabWords.find(v =>
            v.de.toLowerCase().includes(w.toLowerCase())
          )
          if (found) addedWords.push(found.de)
        })
      }

      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        text,
        corrected: parsed.corrected,
        corrections: parsed.corrections ?? [],
        wrong_words: parsed.wrong_words ?? [],
        overall: parsed.overall ?? '',
        added_to_vocab: addedWords,
      }

      setResult(entry)
      onSave(entry)
    } catch (e) {
      setResult({ error: 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' })
    }
    setLoading(false)
  }

  if (result?.error) {
    return (
      <div className="bg-red-50 rounded-xl p-4 text-red-600 text-sm">
        {result.error}
        <button onClick={() => setResult(null)} className="block mt-2 underline">ลองใหม่</button>
      </div>
    )
  }

  if (result) return <CorrectionResult result={result} onNew={() => { setResult(null); setText('') }} />

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Heute war ein schöner Tag..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm min-h-36 outline-none focus:border-blue-400 bg-white/80 resize-none"
      />
      <p className="text-xs text-gray-400">{text.length} ตัวอักษร</p>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        className="py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40"
      >
        {loading ? 'Claude กำลังแก้ไข...' : 'ส่งให้ Claude แก้ไข →'}
      </button>
    </div>
  )
}

function CorrectionResult({ result, onNew }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Overall feedback */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
        <p className="text-xs text-blue-500 font-semibold mb-1">ข้อคิดเห็น</p>
        <p className="text-sm text-blue-800">{result.overall}</p>
      </div>

      {/* Corrected text */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-3">
        <p className="text-xs text-green-600 font-semibold mb-1">ข้อความที่ถูกต้อง</p>
        <p className="text-sm text-gray-700 italic">{result.corrected}</p>
      </div>

      {/* Corrections */}
      {result.corrections.length > 0 && (
        <div className="bg-white/80 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-semibold">การแก้ไข ({result.corrections.length} จุด)</p>
          {result.corrections.map((c, i) => (
            <div key={i} className="border-l-2 border-red-300 pl-2">
              <p className="text-sm">
                <span className="line-through text-red-400">{c.original}</span>
                {' → '}
                <span className="text-green-600 font-medium">{c.fixed}</span>
              </p>
              <p className="text-xs text-gray-400">{c.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Added to vocab */}
      {result.added_to_vocab?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs text-amber-600 font-semibold mb-1">📚 เพิ่มเข้า Vokabeln แล้ว</p>
          <p className="text-sm text-amber-700">{result.added_to_vocab.join(', ')}</p>
        </div>
      )}

      <button onClick={onNew} className="py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm">
        เขียนใหม่ →
      </button>
    </div>
  )
}

function HistoryView({ entries }) {
  if (!entries.length) {
    return (
      <div className="text-center text-gray-400 text-sm py-12">
        ยังไม่มีบันทึก — เริ่มเขียนวันนี้เลย!
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map(e => (
        <div key={e.id} className="bg-white/80 border border-gray-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">{e.date}</span>
            <span className="text-xs text-gray-400">{e.corrections?.length ?? 0} การแก้ไข</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{e.text}</p>
          {e.overall && <p className="text-xs text-blue-500 mt-1">{e.overall}</p>}
        </div>
      ))}
    </div>
  )
}

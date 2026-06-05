import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const TOPICS = {
  B1: [
    { title: 'Mein Alltag', prompt: 'Beschreibe deinen typischen Tagesablauf. Was machst du morgens, mittags und abends? (150–200 Wörter)' },
    { title: 'Meine Stadt', prompt: 'Beschreibe die Stadt oder den Ort, in dem du lebst. Was gefällt dir dort, was nicht? (150–200 Wörter)' },
    { title: 'Ein unvergessliches Erlebnis', prompt: 'Erzähle von einem Erlebnis, das du nie vergessen wirst. Was ist passiert? Wie hast du dich gefühlt? (150–200 Wörter)' },
    { title: 'Mein Lieblingsessen', prompt: 'Was ist dein Lieblingsessen? Beschreibe es und erkläre, warum du es magst. Kannst du es kochen? (150–200 Wörter)' },
    { title: 'Meine Hobbys', prompt: 'Was machst du in deiner Freizeit? Beschreibe deine Hobbys und warum sie dir wichtig sind. (150–200 Wörter)' },
    { title: 'Eine Reise', prompt: 'Beschreibe eine Reise, die du gemacht hast oder machen möchtest. Wohin? Was hast du/möchtest du dort erleben? (150–200 Wörter)' },
    { title: 'Meine Familie', prompt: 'Erzähle von deiner Familie. Wie viele Personen gehören dazu? Was machen sie? (150–200 Wörter)' },
    { title: 'Lernen und Schule', prompt: 'Wie lernst du am besten? Beschreibe deine Lernmethoden und deine Erfahrungen mit dem Sprachenlernen. (150–200 Wörter)' },
  ],
  B2: [
    { title: 'Soziale Medien und Gesellschaft', prompt: 'Welchen Einfluss haben soziale Medien auf die Gesellschaft? Diskutiere Vor- und Nachteile. (200–250 Wörter)' },
    { title: 'Klimawandel und Verantwortung', prompt: 'Wer trägt die Verantwortung für den Klimawandel — Einzelpersonen oder Regierungen? Begründe deine Meinung. (200–250 Wörter)' },
    { title: 'Homeoffice vs. Büroarbeit', prompt: 'Was sind die Vor- und Nachteile von Homeoffice im Vergleich zur Büroarbeit? Welche Form bevorzugst du und warum? (200–250 Wörter)' },
    { title: 'Künstliche Intelligenz', prompt: 'Wird KI (Künstliche Intelligenz) die Arbeitswelt zum Besseren oder Schlechteren verändern? Argumentiere mit Beispielen. (200–250 Wörter)' },
    { title: 'Stadtleben vs. Landleben', prompt: 'Welche Lebensweise ist besser — in der Stadt oder auf dem Land? Vergleiche und begründe deine Präferenz. (200–250 Wörter)' },
    { title: 'Globalisierung', prompt: 'Welche Auswirkungen hat die Globalisierung auf Kultur und Identität? Ist sie eher positiv oder negativ? (200–250 Wörter)' },
  ],
}

export default function SpeakingPage() {
  const [level, setLevel] = useState('B1')
  const [topic, setTopic] = useState(null)
  const [essay, setEssay] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function pickRandom() {
    const list = TOPICS[level]
    setTopic(list[Math.floor(Math.random() * list.length)])
    setEssay('')
    setResult(null)
  }

  async function handleSubmit() {
    if (!essay.trim() || !topic || loading) return
    setLoading(true)
    setResult(null)
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `ประเมินเรียงความภาษาเยอรมันระดับ ${level} นี้ ให้ feedback เป็นภาษาไทย อย่าแก้ grammar ให้ใหม่ — แค่ชี้จุดที่ควรปรับ

หัวข้อ: ${topic.title}
โจทย์: ${topic.prompt}

เรียงความ:
${essay}

ตอบ JSON:
{
  "scores": {
    "content": { "score": 0-5, "label": "เนื้อหา" },
    "vocabulary": { "score": 0-5, "label": "คำศัพท์" },
    "structure": { "score": 0-5, "label": "โครงสร้าง" },
    "fluency": { "score": 0-5, "label": "ความลื่นไหล" }
  },
  "total": 0-20,
  "strengths": ["จุดเด่น 1", "จุดเด่น 2"],
  "improve": ["ควรพัฒนา 1", "ควรพัฒนา 2"],
  "tips": "เคล็ดลับสั้นๆ สำหรับระดับ ${level}"
}`,
        }],
      })
      const parsed = JSON.parse(
        msg.content[0].text.trim().replace(/```json|```/g, '').trim()
      )
      setResult(parsed)
    } catch (e) {
      setResult({ error: e.message })
    }
    setLoading(false)
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-gray-800">✍️ Writing Practice</h2>
        <p className="text-xs text-gray-400">ฝึกเขียน essay รับ feedback จาก Claude</p>
      </div>

      {/* Level selector */}
      <div className="flex gap-2">
        {['B1', 'B2'].map(l => (
          <button key={l} onClick={() => { setLevel(l); setTopic(null); setResult(null) }}
            className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors
              ${level === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}>
            {l}
            <span className={`block text-xs font-normal ${level === l ? 'text-blue-100' : 'text-gray-300'}`}>
              {l === 'B1' ? 'สอบ Goethe' : 'ท้าทายกว่า'}
            </span>
          </button>
        ))}
      </div>

      {/* Topic */}
      <button onClick={pickRandom}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium bg-blue-50/50">
        🎲 สุ่มหัวข้อ {level}
      </button>

      {topic && (
        <div className="bg-white/80 border border-gray-200 rounded-xl p-3 flex flex-col gap-1">
          <p className="font-semibold text-gray-800 text-sm">{topic.title}</p>
          <p className="text-xs text-gray-500">{topic.prompt}</p>
        </div>
      )}

      {/* Essay input */}
      {topic && !result && (
        <>
          <textarea
            value={essay}
            onChange={e => setEssay(e.target.value)}
            placeholder="Schreibe hier deinen Text..."
            className="w-full border border-gray-200 rounded-xl p-3 text-sm min-h-40 outline-none focus:border-blue-400 bg-white/80 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{essay.trim().split(/\s+/).filter(Boolean).length} คำ</span>
            <button onClick={handleSubmit} disabled={!essay.trim() || loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40">
              {loading ? 'กำลังประเมิน...' : 'ส่งให้ Claude ประเมิน →'}
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {result?.error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm">
          ❌ {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="flex flex-col gap-3">
          {/* Score summary */}
          <div className="bg-white/80 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-800">คะแนนรวม</p>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-blue-600">{result.total}</span>
                <span className="text-gray-400 text-sm">/20</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(result.scores).map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <span className="text-xs font-bold text-gray-700">{s.score}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(s.score/5)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-green-700 mb-2">✅ จุดเด่น</p>
            {result.strengths.map((s, i) => <p key={i} className="text-sm text-green-800">• {s}</p>)}
          </div>

          {/* Improve */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-2">📈 ควรพัฒนา</p>
            {result.improve.map((s, i) => <p key={i} className="text-sm text-amber-800">• {s}</p>)}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">💡 เคล็ดลับ</p>
            <p className="text-sm text-blue-800">{result.tips}</p>
          </div>

          <button onClick={() => { setResult(null); setEssay('') }}
            className="py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">
            ลองหัวข้อใหม่ →
          </button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { grammarTopics } from '../data/grammarTopics'
import { generateExercise, checkAnswer } from '../lib/claude'

export default function GrammarPage() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return (
      <TopicDetail
        topic={selected}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-1">ไวยากรณ์ภาษาเยอรมัน</h2>
      <p className="text-xs text-gray-400 mb-4">เลือกหัวข้อที่อยากเรียน — อธิบายเป็นภาษาไทย</p>

      <div className="flex flex-col gap-3">
        {grammarTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => setSelected(topic)}
            className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-left flex items-center gap-3 active:scale-95 transition-transform"
          >
            <span className="text-2xl">{topic.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{topic.title}</p>
              <p className="text-xs text-gray-400">{topic.subtitle}</p>
            </div>
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function TopicDetail({ topic, onBack }) {
  const [tab, setTab] = useState('rule') // 'rule' | 'exercise'
  const [exercise, setExercise] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerateExercise() {
    setTab('exercise')
    setExercise(null)
    setUserAnswer('')
    setResult(null)
    setLoading(true)
    try {
      const ex = await generateExercise(topic.title)
      setExercise(ex)
    } catch (e) {
      setExercise({ error: 'โหลดไม่ได้ ลองใหม่อีกครั้ง' })
    }
    setLoading(false)
  }

  async function handleCheck() {
    if (!userAnswer.trim() || !exercise) return
    setLoading(true)
    try {
      const res = await checkAnswer(exercise.sentence, userAnswer, exercise.answer, topic.title)
      setResult(res)
    } catch (e) {
      setResult({ correct: false, explanation: 'ตรวจไม่ได้ ลองใหม่อีกครั้ง' })
    }
    setLoading(false)
  }

  function handleNext() {
    setExercise(null)
    setUserAnswer('')
    setResult(null)
    handleGenerateExercise()
  }

  // แปลง markdown-like explanation เป็น JSX อย่างง่าย
  function renderExplanation(text) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-gray-800 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('→')) {
        return <p key={i} className="text-sm text-blue-700 font-mono bg-blue-50 rounded px-2 py-0.5 my-0.5">{line}</p>
      }
      if (line.startsWith('|')) {
        return <p key={i} className="text-xs font-mono text-gray-600">{line}</p>
      }
      if (line.trim() === '') return <div key={i} className="h-1" />
      return <p key={i} className="text-sm text-gray-700">{line.replace(/\*\*/g, '')}</p>
    })
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-blue-600 text-sm font-medium">← กลับ</button>
        <div>
          <h2 className="font-bold text-gray-800">{topic.icon} {topic.title}</h2>
          <p className="text-xs text-gray-400">{topic.subtitle}</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('rule')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
            ${tab === 'rule' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          กฎและอธิบาย
        </button>
        <button
          onClick={tab === 'exercise' ? undefined : handleGenerateExercise}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
            ${tab === 'exercise' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          แบบฝึกหัด
        </button>
      </div>

      {/* Rule tab */}
      {tab === 'rule' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          {renderExplanation(topic.explanation)}
          <button
            onClick={handleGenerateExercise}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm"
          >
            ทำแบบฝึกหัด →
          </button>
        </div>
      )}

      {/* Exercise tab */}
      {tab === 'exercise' && (
        <div className="flex flex-col gap-3">
          {loading && !exercise && (
            <div className="bg-white/80 rounded-xl p-6 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              กำลังสร้างแบบฝึกหัด...
            </div>
          )}

          {exercise?.error && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-red-600 text-sm">
              {exercise.error}
            </div>
          )}

          {exercise && !exercise.error && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex flex-col gap-3">
              <p className="text-xs text-gray-400">เติมคำในช่องว่าง</p>
              <p className="text-lg font-mono text-gray-800">{exercise.sentence}</p>
              <p className="text-sm text-gray-500">{exercise.sentence_th}</p>
              <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">💡 {exercise.hint}</p>

              <input
                type="text"
                value={userAnswer}
                onChange={e => { setUserAnswer(e.target.value); setResult(null) }}
                onKeyDown={e => e.key === 'Enter' && !result && handleCheck()}
                placeholder="พิมพ์คำตอบ..."
                disabled={!!result}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50"
              />

              {!result && (
                <button
                  onClick={handleCheck}
                  disabled={!userAnswer.trim() || loading}
                  className="py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40"
                >
                  {loading ? 'กำลังตรวจ...' : 'ตรวจคำตอบ'}
                </button>
              )}

              {result && (
                <div className={`rounded-xl p-3 border ${result.correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <p className={`font-semibold text-sm mb-1 ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
                    {result.correct ? '✅ ถูกต้อง!' : `❌ ไม่ถูก — คำตอบที่ถูกคือ "${exercise.answer}"`}
                  </p>
                  <p className="text-xs text-gray-600">{result.explanation}</p>
                </div>
              )}

              {result && (
                <button onClick={handleNext} className="py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                  ข้อต่อไป →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

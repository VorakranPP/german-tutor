import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function generateExercise(topic) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `สร้างแบบฝึกหัด fill-in-the-blank ภาษาเยอรมันเรื่อง "${topic}" 1 ข้อ สำหรับผู้เรียนระดับ B1 ที่เป็นคนไทย
ตอบเป็น JSON เท่านั้น:
{
  "sentence": "ประโยคภาษาเยอรมันที่มี ___ แทนคำที่ต้องเติม",
  "sentence_th": "คำแปลภาษาไทยของประโยค (ใส่ ___ ตรงช่องว่างด้วย)",
  "answer": "คำตอบที่ถูกต้อง",
  "hint": "คำใบ้สั้นๆ เป็นภาษาไทย"
}`,
    }],
  })
  const text = msg.content[0].text.trim().replace(/```json|```/g, '').trim()
  return JSON.parse(text)
}

export async function checkAnswer(sentence, userAnswer, correctAnswer, topic) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `ตรวจคำตอบแบบฝึกหัดภาษาเยอรมัน อธิบายเป็นภาษาไทย

ประโยค: ${sentence}
คำตอบที่ถูก: ${correctAnswer}
คำตอบของผู้เรียน: ${userAnswer}
หัวข้อ: ${topic}

ตอบเป็น JSON:
{
  "correct": true หรือ false,
  "explanation": "อธิบายสั้นๆ ว่าทำไมถึงถูก/ผิด และกฎที่เกี่ยวข้อง (ภาษาไทย)"
}`,
    }],
  })
  const text = msg.content[0].text.trim().replace(/```json|```/g, '').trim()
  return JSON.parse(text)
}

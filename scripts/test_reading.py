import anthropic, json
client = anthropic.Anthropic()

msg = client.messages.create(
    model='claude-haiku-4-5-20251001',
    max_tokens=1024,
    messages=[{'role':'user','content':'''สร้างบทอ่านภาษาเยอรมันระดับ B1 พร้อมคำถาม ตอบ JSON เท่านั้น:
{
  "title": "ชื่อเรื่อง",
  "passage": "บทอ่านภาษาเยอรมัน 120-150 คำ",
  "questions": [
    {"q": "คำถามภาษาไทย", "options": ["ก) ...", "ข) ...", "ค) ..."], "answer": 0}
  ]
}
หัวข้อ: ชีวิตในเมืองใหญ่ของเยอรมัน'''}]
)

raw = msg.content[0].text.strip().replace('```json','').replace('```','').strip()
data = json.loads(raw)

print('TITLE:', data['title'])
print()
print('PASSAGE:')
print(data['passage'])
print()
print('QUESTIONS:')
for i, q in enumerate(data['questions']):
    print(f"{i+1}. {q['q']}")
    for o in q['options']:
        print(f'   {o}')
    print(f'   → ตอบ: ข้อ {q["answer"]+1}')
    print()
print(f'Tokens: input={msg.usage.input_tokens} output={msg.usage.output_tokens}')
cost = (msg.usage.input_tokens * 0.80 + msg.usage.output_tokens * 4.00) / 1_000_000 * 33
print(f'Cost: ~{cost:.4f} บาท')

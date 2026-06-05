import anthropic, json, time, os

client = anthropic.Anthropic()
OUTPUT = "../data/reading_passages.json"

TOPICS = [
    # Alltag
    "ชีวิตประจำวันในเบอร์ลิน", "การซื้อของที่ตลาด", "การทำอาหารเยอรมัน",
    "การออกกำลังกายและสุขภาพ", "การใช้ขนส่งสาธารณะในเมือง",
    # Arbeit
    "การทำงานในออฟฟิศ", "การสัมภาษณ์งาน", "การทำงานจากที่บ้าน (Homeoffice)",
    "งานช่างและอาชีพ", "การประชุมออนไลน์",
    # Familie
    "ชีวิตครอบครัวในเยอรมัน", "การเลี้ยงลูกแบบเยอรมัน", "วันหยุดกับครอบครัว",
    "บ้านและเพื่อนบ้าน", "การดูแลผู้สูงอายุ",
    # Gesundheit
    "การไปพบแพทย์", "การกินอาหารเพื่อสุขภาพ", "การออกกำลังกายในฤดูหนาว",
    "ระบบประกันสุขภาพในเยอรมัน", "การนอนหลับและความเครียด",
    # Reisen
    "การท่องเที่ยวในมิวนิก", "การเดินทางด้วยรถไฟ ICE", "การจองที่พัก",
    "วันหยุดฤดูร้อนที่ทะเลบอลติก", "การท่องเที่ยวแบบประหยัด",
    # Wohnen
    "การหาอพาร์ตเมนต์ในเมืองใหญ่", "การย้ายบ้าน", "การตกแต่งห้อง",
    "ค่าเช่าที่พักในเยอรมัน", "ชีวิตในหมู่บ้านเล็กๆ",
    # Bildung
    "ระบบการศึกษาในเยอรมัน", "การเรียนภาษาเยอรมัน", "มหาวิทยาลัยและทุนการศึกษา",
    "การฝึกงาน (Praktikum)", "หลักสูตรออนไลน์",
    # Natur & Umwelt
    "การปกป้องสิ่งแวดล้อม", "การแยกขยะในเยอรมัน", "ฤดูกาลและสภาพอากาศ",
    "การปั่นจักรยานและพลังงานสีเขียว", "อุทยานแห่งชาติในเยอรมัน",
    # Gesellschaft
    "เทศกาล Oktoberfest", "ตลาดคริสต์มาส (Weihnachtsmarkt)", "วันหยุดและประเพณีเยอรมัน",
    "การอาสาสมัครในชุมชน", "สังคมพหุวัฒนธรรมในเยอรมัน",
    # Technologie & Medien
    "สมาร์ทโฟนในชีวิตประจำวัน", "โซเชียลมีเดียและความเป็นส่วนตัว",
    "การช้อปปิ้งออนไลน์", "ปัญญาประดิษฐ์ในที่ทำงาน",
    "การอ่านข่าวและสื่อดิจิทัล",
    # เมืองเยอรมัน
    "ฮัมบูร์กและท่าเรือ", "ดรสเดนและประวัติศาสตร์", "แฟรงก์เฟิร์ตและธุรกิจ",
]

def generate_passage(topic, retries=3):
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=1024,
                messages=[{'role':'user','content':f'''สร้างบทอ่านภาษาเยอรมันระดับ B1 พร้อมคำถาม 5 ข้อ ตอบ JSON เท่านั้น:
{{
  "title": "ชื่อเรื่องภาษาเยอรมัน",
  "topic_th": "{topic}",
  "passage": "บทอ่านภาษาเยอรมัน 130-160 คำ ระดับ B1",
  "questions": [
    {{"q": "คำถามภาษาไทย", "options": ["ก) ...", "ข) ...", "ค) ..."], "answer": 0}}
  ]
}}
หัวข้อ: {topic}'''}]
            )
            raw = msg.content[0].text.strip().replace('```json','').replace('```','').strip()
            result = json.loads(raw)
            if len(result.get('questions', [])) == 5:
                return result
            raise ValueError(f"Expected 5 questions, got {len(result.get('questions',[]))}")
        except Exception as e:
            print(f"  ↩ {attempt+1}/3: {e}")
            if attempt < retries - 1: time.sleep(2)
    return None

def main():
    passages = []
    if os.path.exists(OUTPUT):
        with open(OUTPUT) as f:
            passages = json.load(f)
        print(f"▶ Resuming — {len(passages)} already done")

    done_topics = {p['topic_th'] for p in passages}
    remaining = [t for t in TOPICS if t not in done_topics]
    print(f"Generating {len(remaining)} passages...")

    for i, topic in enumerate(remaining):
        print(f"[{i+1}/{len(remaining)}] {topic}...")
        result = generate_passage(topic)
        if result:
            result['id'] = f"p{len(passages)+1:03d}"
            passages.append(result)
            with open(OUTPUT, 'w') as f:
                json.dump(passages, f, ensure_ascii=False, indent=2)
        else:
            print(f"  ⚠️ Skipped")
        time.sleep(0.5)

    print(f"\n✅ Done! {len(passages)} passages saved to {OUTPUT}")

if __name__ == '__main__':
    main()

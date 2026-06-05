import json, anthropic, time

client = anthropic.Anthropic()
DATA_FILE = "../data/vocab_translated.json"

CATEGORIES = [
    "Alltag",           # ชีวิตประจำวัน
    "Arbeit",           # งานและอาชีพ
    "Bildung",          # การศึกษา
    "Einkaufen",        # การช้อปปิ้ง
    "Familie",          # ครอบครัวและเพื่อน
    "Freizeit",         # เวลาว่างและงานอดิเรก
    "Gesundheit",       # สุขภาพ
    "Kommunikation",    # การสื่อสาร
    "Natur",            # ธรรมชาติและสิ่งแวดล้อม
    "Reisen",           # การเดินทาง
    "Wohnen",           # ที่อยู่อาศัย
    "Gesellschaft",     # สังคมและชีวิตสาธารณะ
    "Sprache",          # ภาษาและไวยากรณ์
    "Sonstige",         # อื่นๆ
]

def tag_batch(words_batch, retries=3):
    cats = ", ".join(CATEGORIES)
    word_list = "\n".join([f"{i+1}. {w['de']} = {w['th']}" for i, w in enumerate(words_batch)])
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                messages=[{"role": "user", "content": f"""จัดหมวดหมู่คำศัพท์เยอรมันต่อไปนี้ เลือก 1 หมวดที่เหมาะสมที่สุดจาก:
{cats}

ตอบ JSON array {len(words_batch)} elements เท่านั้น:
[{{"category": "ชื่อหมวด"}}]

คำศัพท์:
{word_list}"""}]
            )
            text = msg.content[0].text.strip().replace("```json","").replace("```","").strip()
            result = json.loads(text)
            if len(result) != len(words_batch):
                raise ValueError(f"Expected {len(words_batch)}, got {len(result)}")
            # validate categories
            for r in result:
                if r['category'] not in CATEGORIES:
                    r['category'] = 'Sonstige'
            return result
        except Exception as e:
            print(f"  ↩ {attempt+1}: {e}")
            if attempt < retries - 1: time.sleep(2)
    raise RuntimeError("failed")

def save(words):
    with open(DATA_FILE, 'w') as f: json.dump(words, f, ensure_ascii=False, indent=2)

def main():
    with open(DATA_FILE) as f: data = json.load(f)
    already = sum(1 for w in data if w.get('category'))
    if already: print(f"▶ Resuming — {already} already tagged")

    batch_size = 30
    total = len(data)
    for i in range(0, total, batch_size):
        batch = data[i:i+batch_size]
        if all(w.get('category') for w in batch): continue
        print(f"Tagging {i+1}–{min(i+batch_size, total)} / {total}...")
        try:
            results = tag_batch(batch)
            for j, r in enumerate(results):
                data[i+j]['category'] = r['category']
            save(data)
        except Exception as e:
            print(f"  ⚠️ skip: {e}")
            save(data)
        time.sleep(0.5)

    counts = {}
    for w in data: counts[w.get('category','?')] = counts.get(w.get('category','?'),0)+1
    print(f"\n✅ Done! Categories: {counts}")

if __name__ == "__main__":
    main()

import json, anthropic, re, time

client = anthropic.Anthropic()
DATA_FILE = "../data/vocab_translated.json"

def has_cjk(text):
    return bool(re.search(r'[一-鿿぀-ヿ㐀-䶿]', text or ''))

def fix_cjk(words):
    bad = [w for w in words if has_cjk(w.get('th', ''))]
    if not bad:
        print("No CJK issues found.")
        return

    print(f"Fixing {len(bad)} CJK translations...")
    word_list = "\n".join([f"{i+1}. {w['de']}" for i, w in enumerate(bad)])

    for attempt in range(3):
        try:
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                messages=[{"role": "user", "content": f"""แปลคำเยอรมันเป็นภาษาไทยล้วนๆ ห้ามมีอักษรญี่ปุ่น จีน หรืออักษรอื่นที่ไม่ใช่ไทย
ตอบเป็น JSON array {len(bad)} elements เท่านั้น
format: [{{"th": "คำแปลภาษาไทย"}}]

{word_list}"""}]
            )
            text = msg.content[0].text.strip().replace("```json","").replace("```","").strip()
            results = json.loads(text)
            if len(results) != len(bad):
                raise ValueError(f"Expected {len(bad)}, got {len(results)}")

            idx = {w['id']: i for i, w in enumerate(words)}
            for j, r in enumerate(results):
                old = bad[j]['th']
                words[idx[bad[j]['id']]]['th'] = r['th']
                print(f"  {bad[j]['de']}: '{old}' → '{r['th']}'")
            return
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            time.sleep(2)

def add_levels(words):
    for w in words:
        n = int(w['id'])
        if n <= 500:    w['cerf'] = 'A1'
        elif n <= 1500: w['cerf'] = 'A2'
        else:           w['cerf'] = 'B1'
    counts = {}
    for w in words: counts[w['cerf']] = counts.get(w['cerf'], 0) + 1
    print(f"Levels assigned: {counts}")

def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        words = json.load(f)

    fix_cjk(words)
    add_levels(words)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print("\n✅ Done")

if __name__ == "__main__":
    main()

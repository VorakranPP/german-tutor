import json
import anthropic
import time

client = anthropic.Anthropic()
DATA_FILE = "../data/vocab_translated.json"

def word_in_example(de, example):
    if not example: return False
    base = de.lower()
    for prefix in ['der ', 'die ', 'das ', 'sich ']:
        base = base.replace(prefix, '')
    return base[:4] in example.lower()

def fix_batch(words_batch, retries=3):
    # prompt บังคับให้ใส่คำนั้นในประโยค
    items = "\n".join([
        f"{i+1}. ใช้คำว่า \"{w['de']}\" ({w['th']}) ในประโยค"
        for i, w in enumerate(words_batch)
    ])
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                messages=[{"role": "user", "content": f"""สร้างประโยคภาษาเยอรมันระดับ B1 — ต้องมีคำที่กำหนดในประโยคทุกครั้ง
ตอบเป็น JSON array {len(words_batch)} elements เท่านั้น ไม่ต้องมีคำอธิบาย
format: [{{"example": "ประโยคที่มีคำนั้น", "example_th": "คำแปลภาษาไทย"}}]

{items}"""}]
            )
            text = msg.content[0].text.strip().replace("```json","").replace("```","").strip()
            result = json.loads(text)
            if len(result) != len(words_batch):
                raise ValueError(f"Expected {len(words_batch)}, got {len(result)}")
            return result
        except Exception as e:
            print(f"  ↩ Attempt {attempt+1}/{retries}: {e}")
            if attempt < retries - 1: time.sleep(2)
    raise RuntimeError("All attempts failed")

def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        words = json.load(f)

    bad = [w for w in words if not word_in_example(w['de'], w.get('example',''))]
    print(f"Found {len(bad)} bad examples — regenerating...")

    # index lookup
    idx = {w['id']: i for i, w in enumerate(words)}

    batch_size = 20
    fixed = 0
    for i in range(0, len(bad), batch_size):
        batch = bad[i:i+batch_size]
        print(f"Fixing {i+1}–{min(i+batch_size, len(bad))} / {len(bad)}...")
        try:
            results = fix_batch(batch)
            for j, r in enumerate(results):
                wi = idx[batch[j]['id']]
                words[wi]['example'] = r.get('example', '')
                words[wi]['example_th'] = r.get('example_th', '')
            fixed += len(batch)
        except Exception as e:
            print(f"  ⚠️ Skip batch: {e}")
        time.sleep(0.5)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Fixed {fixed}/{len(bad)} bad examples")

if __name__ == "__main__":
    main()

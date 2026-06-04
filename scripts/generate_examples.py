import json
import anthropic
import time
import os

client = anthropic.Anthropic()

DATA_FILE = "../data/vocab_translated.json"

def generate_batch(words_batch, retries=3):
    word_list = "\n".join([
        f"{i+1}. {w['de']} = {w['th']}" for i, w in enumerate(words_batch)
    ])

    for attempt in range(retries):
        try:
            message = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                messages=[{
                    "role": "user",
                    "content": f"""สร้างประโยคตัวอย่างภาษาเยอรมันระดับ B1 — **1 ประโยคต่อ 1 คำเท่านั้น**
ตอบเป็น JSON array ที่มี {len(words_batch)} elements พอดี ไม่ต้องมีคำอธิบาย
format: [{{"example": "ประโยคภาษาเยอรมัน", "example_th": "คำแปลประโยคภาษาไทย"}}]

คำศัพท์:
{word_list}"""
                }]
            )

            text = message.content[0].text.strip()
            text = text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)

            if len(result) != len(words_batch):
                raise ValueError(f"Expected {len(words_batch)} items, got {len(result)}")

            return result
        except Exception as e:
            print(f"  ↩ Attempt {attempt+1}/{retries} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2)

    raise RuntimeError(f"All {retries} attempts failed for this batch")

def save_progress(words):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

def main():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        words = json.load(f)

    already_done = sum(1 for w in words if w.get("example") and w["example"].strip())
    if already_done > 0:
        print(f"▶ Resuming — {already_done} examples already done, skipping...")

    batch_size = 30
    total = len(words)

    for i in range(0, total, batch_size):
        batch = words[i:i+batch_size]

        if all(w.get("example") and w["example"].strip() for w in batch):
            continue

        print(f"Generating {i+1}–{min(i+batch_size, total)} / {total}...")

        try:
            results = generate_batch(batch)
            for j, r in enumerate(results):
                words[i+j]["example"] = r.get("example", "")
                words[i+j]["example_th"] = r.get("example_th", "")
            save_progress(words)
        except Exception as e:
            print(f"  ⚠️ Skipping batch {i}: {e}")
            save_progress(words)

        time.sleep(0.5)

    filled = sum(1 for w in words if w.get("example") and w["example"].strip())
    print(f"\n✅ Done! Generated {filled}/{total} example sentences")
    print(f"   Output: {DATA_FILE}")

if __name__ == "__main__":
    main()

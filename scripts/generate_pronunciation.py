import json
import anthropic
import time
from utils import load_protected, safe_set

client = anthropic.Anthropic()
DATA_FILE = "../data/vocab_translated.json"

def generate_batch(words_batch, retries=3):
    word_list = "\n".join([f"{i+1}. {w['de']}" for i, w in enumerate(words_batch)])

    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                messages=[{"role": "user", "content": f"""เขียนคำอ่านภาษาไทยสำหรับคำเยอรมันต่อไปนี้ — ออกเสียงตามภาษาเยอรมันจริง เขียนแบบสัทอักษรไทยที่อ่านง่าย เช่น "ฮาวส์", "ฟา-เรน", "ชไรบ-เบน"
ตอบเป็น JSON array {len(words_batch)} elements เท่านั้น ไม่ต้องมีคำอธิบาย
format: [{{"pronunciation": "คำอ่านภาษาไทย"}}]

คำศัพท์:
{word_list}"""}]
            )
            text = msg.content[0].text.strip().replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
            if len(result) != len(words_batch):
                raise ValueError(f"Expected {len(words_batch)}, got {len(result)}")
            return result
        except Exception as e:
            print(f"  ↩ Attempt {attempt+1}/{retries}: {e}")
            if attempt < retries - 1:
                time.sleep(2)
    raise RuntimeError("All attempts failed")

def save(words):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        words = json.load(f)

    already = sum(1 for w in words if w.get("pronunciation") and w["pronunciation"].strip())
    if already:
        print(f"▶ Resuming — {already} already done")

    batch_size = 30
    total = len(words)

    for i in range(0, total, batch_size):
        batch = words[i:i+batch_size]
        if all(w.get("pronunciation") and w["pronunciation"].strip() for w in batch):
            continue

        print(f"Generating {i+1}–{min(i+batch_size, total)} / {total}...")
        try:
            results = generate_batch(batch)
            protected = load_protected()
            for j, r in enumerate(results):
                safe_set(words[i+j], "pronunciation", r.get("pronunciation", ""), protected)
            save(words)
        except Exception as e:
            print(f"  ⚠️ Skip: {e}")
            save(words)
        time.sleep(0.5)

    done = sum(1 for w in words if w.get("pronunciation") and w["pronunciation"].strip())
    print(f"\n✅ Done! {done}/{total} pronunciations")

if __name__ == "__main__":
    main()

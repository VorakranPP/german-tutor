import json
import anthropic
import time
import os

client = anthropic.Anthropic()

OUTPUT_FILE = "../data/vocab_translated.json"

def translate_batch(words_batch, retries=3):
    word_list = "\n".join([f"{i+1}. {w['de']}" for i, w in enumerate(words_batch)])

    for attempt in range(retries):
        try:
            message = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                messages=[{
                    "role": "user",
                    "content": f"""แปลคำเยอรมันต่อไปนี้เป็นภาษาไทย ตอบเป็น JSON array เท่านั้น ไม่ต้องมีคำอธิบาย
format: [{{"th": "คำแปลภาษาไทย"}}]

คำที่ต้องแปล:
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
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

def main():
    # Resume from output file if it exists and has partial translations
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            words = json.load(f)
        already_done = sum(1 for w in words if w.get("th"))
        if already_done > 0:
            print(f"▶ Resuming — {already_done} words already translated, skipping...")
    else:
        with open("../data/vocab_raw.json", "r", encoding="utf-8") as f:
            words = json.load(f)

    batch_size = 30
    total = len(words)

    for i in range(0, total, batch_size):
        batch = words[i:i+batch_size]

        # Skip batch if all words already translated
        if all(w.get("th") for w in batch):
            continue

        print(f"Translating {i+1}–{min(i+batch_size, total)} / {total}...")

        try:
            translations = translate_batch(batch)
            for j, t in enumerate(translations):
                words[i+j]["th"] = t["th"]
            save_progress(words)  # save after every batch
        except Exception as e:
            print(f"  ⚠️ Error at batch {i}: {e}")
            save_progress(words)  # save progress before continuing

        time.sleep(0.5)

    filled = sum(1 for w in words if w.get("th"))
    print(f"\n✅ Done! Translated {filled}/{total} words")
    print(f"   Output: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

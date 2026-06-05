import json, re, anthropic, time

client = anthropic.Anthropic()
DATA_FILE = "../data/vocab_translated.json"

def has_bad(text):
    return bool(re.search(r'[ऀ-ॿ一-鿿぀-ヿა-ჿ]', text or ''))

def fix_batch(words_batch, retries=3):
    word_list = "\n".join([f"{i+1}. {w['de']}" for i, w in enumerate(words_batch)])
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                messages=[{"role": "user", "content": f"""เขียนคำอ่านภาษาไทยสำหรับคำเยอรมัน — ใช้ตัวอักษรไทยล้วนๆ เท่านั้น ห้ามมีอักษรอื่น
ตอบ JSON array {len(words_batch)} elements:
[{{"pronunciation": "คำอ่านภาษาไทยล้วนๆ"}}]

{word_list}"""}]
            )
            text = msg.content[0].text.strip().replace("```json","").replace("```","").strip()
            result = json.loads(text)
            if len(result) != len(words_batch):
                raise ValueError(f"Expected {len(words_batch)}, got {len(result)}")
            return result
        except Exception as e:
            print(f"  ↩ {attempt+1}: {e}")
            if attempt < retries - 1: time.sleep(2)
    raise RuntimeError("failed")

def main():
    with open(DATA_FILE) as f: data = json.load(f)
    bad = [w for w in data if has_bad(w.get('pronunciation', ''))]
    print(f"Fixing {len(bad)} bad pronunciations...")
    idx = {w['id']: i for i, w in enumerate(data)}
    batch_size = 20
    for i in range(0, len(bad), batch_size):
        batch = bad[i:i+batch_size]
        print(f"  {i+1}–{min(i+batch_size,len(bad))} / {len(bad)}")
        try:
            results = fix_batch(batch)
            for j, r in enumerate(results):
                data[idx[batch[j]['id']]]['pronunciation'] = r['pronunciation']
        except Exception as e:
            print(f"  skip: {e}")
        time.sleep(0.5)
    with open(DATA_FILE, 'w') as f: json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ Done")

if __name__ == "__main__":
    main()

import json, os

PROTECTED_FILE = "../data/protected_fields.json"

def load_protected():
    if not os.path.exists(PROTECTED_FILE):
        return {}
    with open(PROTECTED_FILE) as f:
        return json.load(f)

def is_protected(word_id, field, protected=None):
    if protected is None:
        protected = load_protected()
    return field in protected.get(str(word_id), [])

def protect(word_id, field):
    """เพิ่ม field เข้า protected list (เรียกหลัง manual fix)"""
    protected = load_protected()
    wid = str(word_id)
    if wid not in protected:
        protected[wid] = []
    if field not in protected[wid]:
        protected[wid].append(field)
    with open(PROTECTED_FILE, 'w') as f:
        json.dump(protected, f, ensure_ascii=False, indent=2)

def safe_set(word, field, value, protected):
    """Set field — ถ้า protected ถามยืนยันก่อน"""
    if not is_protected(word['id'], field, protected):
        word[field] = value
        return True

    current = word.get(field, '')
    print(f"\n⚠️  Protected field detected!")
    print(f"   คำ     : {word['de']}")
    print(f"   Field  : {field}")
    print(f"   ปัจจุบัน: {current}")
    print(f"   ใหม่   : {value}")
    answer = input("   ยืนยันแก้ไข? (y/n): ").strip().lower()
    if answer == 'y':
        word[field] = value
        return True
    print("   → ข้ามไป")
    return False

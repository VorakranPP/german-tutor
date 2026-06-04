# CHANGELOG

## [0.5.0] — 2026-06-04

### Added
- Level filter (A1/A2/B1) บน Vocabulary Tab — สีต่างกันแต่ละระดับ
- Type filter (คำนาม/กริยา/อื่นๆ) นับตาม level ที่เลือก
- Background image `bg-ge.png` เป็น wallpaper จาง 80% ทั้ง app
- Header ใช้ `backdrop-blur` + semi-transparent

### Fixed
- Plural แสดงคำเต็ม เช่น "die Male" แทน "-e"
- Queue สุ่มภายใน level เดียวกัน (Fisher-Yates) ไม่เรียงตาม ID อีกต่อไป
- 511 ตัวอย่างประโยคที่ไม่มีคำนั้น — regenerate ด้วย prompt ที่บังคับให้ใส่คำ
- 21 คำที่มีอักษรญี่ปุ่น/จีนปนในคำแปลไทย — แก้ manual
- เพิ่ม field `cerf` (A1/A2/B1) ทุกคำใน vocab_translated.json

### Scripts Added
- `scripts/fix_examples.py` — regenerate ตัวอย่างที่ไม่มีคำเป้าหมายในประโยค
- `scripts/fix_cjk_and_levels.py` — แก้ CJK + เพิ่ม cerf level

---

## [0.4.0] — 2026-06-04

### Added
- `src/src/pages/VocabPage.jsx` — Vocabulary Tab with full flashcard UI
  - Progress bar แสดง x/2833 คำ + จำได้แล้วกี่คำ
  - Flip card แสดงคำแปลไทย + ตัวอย่างประโยค B1 + คำแปลประโยค
  - ปุ่ม ✅ รู้แล้ว / ❌ ไม่รู้ พร้อม feedback
  - หน้าสรุปเมื่อครบรอบ + ปุ่มเริ่มรอบใหม่
- `src/src/components/Flashcard.jsx` — Flashcard component แสดง type badge, plural/conjugation
- `src/src/stores/vocabStore.js` — Zustand store สำหรับ spaced repetition
  - Levels 1–5 per word, persist ผ่าน localStorage
  - คำ level ต่ำ (ยังไม่รู้) ขึ้นก่อนในคิว

### Fixed
- Downgraded Vite 8 → 5 เพื่อรองรับ Node.js 20.12.1 (Vite 8 ต้องการ Node 20.19+)

---

## [0.3.0] — 2026-06-04

### Added
- `scripts/generate_examples.py` — batch generates B1 example sentences + Thai translation via Claude Haiku
- `vocab_translated.json` now includes `example` (German sentence) and `example_th` (Thai translation) for all 2,833 words
- React app scaffolded with Vite + React Router + Zustand + Tailwind CSS v4
- App shell with 5-tab bottom navigation: คำศัพท์, ไวยากรณ์, อ่าน, ฝึกพูด, ไดอารี่
- Placeholder pages for all 5 tabs

### Fixed
- `translate_vocab.py`: changed model from `claude-opus-4-6` → `claude-haiku-4-5-20251001` (20x cheaper)
- `translate_vocab.py`: increased `max_tokens` 1024 → 2048, reduced batch size 50 → 30 to prevent truncation
- Added resume logic + retry (3 attempts) to both translate and generate_examples scripts

---

## [0.2.0] — 2026-06-04

### Added
- Thai translation complete: 2,833/2,833 words via `translate_vocab.py`

---

## [0.1.0] — 2026-06-04

### Added
- Project structure initialized (`data/`, `scripts/`, `src/`)
- Downloaded Goethe-Zertifikat B1 Wortliste (`sorted.txt`) — 2,833 words
- `scripts/parse_vocab.py` — parses txt → JSON with type detection
  - Nouns: 1,435
  - Verbs: 586
  - Others: 812
- `scripts/translate_vocab.py` — batch translates to Thai with pronunciation via Claude API
- `data/vocab_raw.json` — parsed word list (no translation yet)
- Project documentation: README.md, PROJECT_CONTEXT.md, CLAUDE.md, TODO.md, CHANGELOG.md
- `.gitignore` setup
- Git repo initialized and pushed to GitHub

# CHANGELOG

## [0.8.3] — 2026-06-07

### Added
- **Mark as Memorized** — Direct button on flashcard to save word as known (level 4)
  - 💾 **บันทึก** — Quick save without going through card reviews
  - 🔄 **รีเซ็ท** — Undo memorization to re-learn word
  - ✅ **Visual badge** — Shows "จำได้แล้ว" when word is memorized

- **Session History & Auto-Save** — Track daily learning progress
  - Auto-save on page unload/refresh (no manual save needed)
  - Display history for last 10 days with daily stats
  - Persist history in localStorage

- **Lifetime Statistics** — Total words learned since app started
  - 🏆 **สถิติรวม** section showing cumulative ✅ ❌ counts
  - Progress tracking across all sessions
  - Never reset unless user manually clears

### Changed
- Removed manual "บันทึกวันนี้" button → auto-save only
- Session counters auto-reset after page unload

---

## [0.8.2] — 2026-06-07

### Added
- **npm Setup** — Created package.json with all dependencies (Vite, React, Zustand, Express, Anthropic SDK)
  - Ready for Node.js 20.x environment
  - Dev server can now run with `npm run dev`

### Fixed
- **SchreibenPage JSON parsing** — Improved robustness by extracting JSON object using regex instead of simple string replace
  - Claude responses with trailing content now parse correctly
  - Better error handling for malformed JSON responses

---

## [0.8.1] — 2026-06-05

### Changed
- **Consolidate Anthropic client** — single shared instance in `src/lib/client.js` (ลด duplicate, ง่ายต่อ maintain)
- **Vite config** — เพิ่ม alias stub สำหรับ agent-toolset Node modules ให้ browser build ผ่าน
- **Documentation** — update CLAUDE.md ให้ชัดว่าใช้ Haiku ทั้งหมด (diary, grammar, speaking, reading)

### Refactored
- `src/lib/claude.js`, `DiaryPage.jsx`, `LesenPage.jsx`, `SpeakingPage.jsx` — import shared client แทนสร้าง Anthropic() แยกกัน
- LesenPage structure — consolidate logic, extract lesenStore

---

## [0.8.0] — 2026-06-05

### Added
- **Lesen Tab** — อ่านบทอ่านจาก cache 50 บท (หัวข้อ B1 ครบทุกหมวด)
  - คลิกคำในบทอ่าน → popup คำแปล + คำอ่าน
  - คำที่ไม่มีในคลัง → auto-translate ด้วย Claude Haiku ทันที
  - 5 คำถาม multiple choice + เฉลยหลัง submit
  - สุ่มไม่ซ้ำจนกว่าจะอ่านครบทุกบท
- Prompt caching (`cache_control: ephemeral`) ทุก Claude API call — ลด input token cost ~90% เมื่อใช้ซ้ำ

### Fixed
- Diary wrong words → vocabStore `penalizeWords()` reset level = 1 ให้คำนั้นขึ้น flashcard บ่อยขึ้น

### Scripts Added
- `scripts/generate_reading.py` — batch generate 50 B1 reading passages ครอบคลุม 10 หมวด

---

## [0.7.0] — 2026-06-05

### Added
- **Search bar** — ค้นหาภาษาเยอรมัน/ไทย แสดง list พร้อม CEFR, คำอ่าน, ตัวอย่างประโยค
- **Writing Practice (Sprechen Tab)** — เลือก B1/B2, สุ่มหัวข้อ, Claude Haiku ให้คะแนน 4 ด้าน + feedback ภาษาไทย
- **Diary Tab (Tagebuch)** — เขียน German diary, Claude แก้ + อธิบายไทย, streak counter, history
- Pronunciation แสดงบน **หลังการ์ด** ข้างคำเยอรมัน
- Idiome เพิ่ม 2 สำนวน: "Ich glaube, mein Schwein pfeift!" และ "Alles hat ein Ende, nur die Wurst hat zwei."
- diaryStore (Zustand persist) — entries + streak

### Fixed
- Tagebuch เปลี่ยน claude-sonnet-4-6 → claude-haiku-4-5-20251001 (ประหยัด 20x)
- Tagebuch max_tokens 1024 → 2048 (แก้ error กับ diary ยาว)
- Tee ziehen lassen: อัปคำแปลให้ครอบคลุมความหมายเปรียบเปรย
- QA spot-check 50 random words — 0 issues

---

## [0.6.0] — 2026-06-05

### Added
- Category filter (14 หมวด Goethe B1) — horizontal scroll chips บน Vocabulary Tab
- `pronunciation` field (คำอ่านภาษาไทย) ทุกคำ 2,833/2,833
- `category` field (Alltag, Arbeit, Familie ฯลฯ) ทุกคำ 2,833/2,833
- CEFR level badge (สีฟ้า) มุมขวาบนของหลังการ์ด
- Stats panel ขวา — รู้แล้ว / ยังไม่รู้ / ทั้งหมด (นับรอบนี้)

### Fixed
- Navigation bug: markCorrect/markWrong รับ word โดยตรงแทน global index — การ์ดเลื่อนถูกคำเมื่อ filter active
- 93 nouns ที่มี feminine form ปนใน plural field (เช่น `-en die Doktorin` → `-en`)
- 29 pronunciations ที่มี Devanagari/CJK characters
- Re-applied 21 manual CJK translation fixes หลัง pronunciation script overwrite
- `überhaupt` pronunciation แก้ manual

### Scripts Added
- `scripts/generate_pronunciation.py` — batch generate Thai phonetic pronunciation
- `scripts/tag_categories.py` — batch tag 14 Goethe B1 categories ด้วย Claude Haiku
- `scripts/fix_pronunciation.py` — fix pronunciations ที่มี non-Thai characters
- `scripts/utils.py` — shared utilities: `safe_set()`, `protect()`, `load_protected()`
- `data/protected_fields.json` — track manual fixes ป้องกัน script overwrite
- Scripts ทุกตัวใช้ `safe_set()` — ถามยืนยันก่อน overwrite protected fields

---

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

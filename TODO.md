# TODO

## 🔄 In Progress

- [ ] เพิ่ม pronunciation แสดงบนการ์ด
- [ ] Category filter ใน UI (เพิ่มแล้ว รอ test)

## 📦 Data Pipeline

- [x] Download Goethe B1 Wortliste (`sorted.txt`)
- [x] Parse txt → JSON (`vocab_raw.json`)
- [x] Translate to Thai → `vocab_translated.json` (2,833/2,833 คำ)
- [x] Generate B1 example sentences + Thai translation (2,833/2,833 คำ)
- [x] Fix 511 bad examples (คำเป้าหมายไม่อยู่ในประโยค)
- [x] Fix 21 คำที่มีอักษรญี่ปุ่น/จีนปน
- [x] เพิ่ม CEFR level (A1/A2/B1) ทุกคำ
- [x] เพิ่ม pronunciation (คำอ่านภาษาไทย) ทุกคำ
- [x] เพิ่ม category (14 หมวด Goethe B1) ทุกคำ
- [x] Fix 93 nouns ที่มี feminine form ปนใน plural field
- [x] Data protection system (protected_fields.json + safe_set)
- [ ] Manual QA — spot check 50 random words
- [x] Commit `vocab_translated.json` to repo

## 🎨 Frontend — React App

### Setup
- [x] `npm create vite@latest src -- --template react`
- [x] Install Zustand, Tailwind CSS v4, React Router
- [x] App shell with 5 tabs (BottomNav เป็นภาษาเยอรมัน)
- [x] Dev server รันได้ (Vite 5, Node 20.12.1)
- [x] Background image (bg-ge.png) จาง 80%

### Vocabulary Tab
- [x] Load vocab JSON
- [x] Flashcard component (flip animation)
- [x] Spaced repetition logic (level 1–5, persist localStorage)
- [x] Filter by type (Nomen/Verben/Andere)
- [x] Filter by CEFR level (A1/A2/B1)
- [x] Filter by category (14 หมวด, horizontal scroll)
- [x] Progress bar + Session stats panel (ขวา)
- [x] Plural แสดงคำเต็ม (die Male แทน -e)
- [x] Queue สุ่มภายใน level (Fisher-Yates)
- [x] CEFR badge มุมขวาบนการ์ด
- [ ] แสดง pronunciation บนการ์ด

### Grammar Tab
- [x] Topic list 10 หัวข้อ B1
- [x] Rule explanation in Thai
- [x] Fill-in-the-blank exercise (Claude Haiku)
- [x] Answer checking with explanation (Claude Haiku)

### Reading Tab
- [ ] B1 passage generator (Claude API)
- [ ] Comprehension questions
- [ ] Highlight unknown words → add to vocab bank

### Speaking Practice Tab
- [ ] Chat interface (type in German)
- [ ] Claude corrects grammar + suggests better phrasing
- [ ] Save corrections to vocab bank

### Diary Tab
- [ ] Text editor for daily entry
- [ ] Submit → Claude corrects and explains
- [ ] Auto-extract wrong words → vocab bank
- [ ] Streak counter
- [ ] Export to PDF

## 🚀 Deployment

- [ ] Deploy frontend to Vercel
- [ ] Setup Railway for API proxy (if needed)
- [ ] Add to portfolio / Resume

## 🐛 Known Issues

- None 
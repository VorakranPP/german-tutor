# TODO

## 🔄 In Progress

- [ ] Grammar Tab — กฎไวยากรณ์ภาษาไทย + แบบฝึกหัด

## 📦 Data Pipeline

- [x] Download Goethe B1 Wortliste (`sorted.txt`)
- [x] Parse txt → JSON (`vocab_raw.json`)
- [x] Translate to Thai → `vocab_translated.json` (2,833/2,833 คำ)
- [x] Generate B1 example sentences + Thai translation (2,833/2,833 คำ)
- [x] Fix 511 bad examples (คำเป้าหมายไม่อยู่ในประโยค)
- [x] Fix 21 คำที่มีอักษรญี่ปุ่น/จีนปน
- [x] เพิ่ม CEFR level (A1/A2/B1) ทุกคำ
- [ ] Manual QA — spot check 50 random words
- [x] Commit `vocab_translated.json` to repo

## 🎨 Frontend — React App

### Setup
- [x] `npm create vite@latest src -- --template react`
- [x] Install Zustand, Tailwind CSS v4, React Router
- [x] App shell with 5 tabs: คำศัพท์, ไวยากรณ์, อ่าน, ฝึกพูด, ไดอารี่
- [x] Dev server รันได้ (Vite 5, Node 20.12.1)
- [x] Background image (bg-ge.png) จาง 80%

### Vocabulary Tab
- [x] Load vocab JSON
- [x] Flashcard component (flip animation)
- [x] Spaced repetition logic (level 1–5, persist localStorage)
- [x] Filter by type (noun/verb/other)
- [x] Filter by CEFR level (A1/A2/B1)
- [x] Progress bar
- [x] Plural แสดงคำเต็ม (die Male แทน -e)
- [x] Queue สุ่มภายใน level

### Grammar Tab
- [ ] Topic list (Cases, Tenses, Konjunktiv II, Passive...)
- [ ] Rule explanation in Thai
- [ ] Fill-in-the-blank exercise
- [ ] Claude API for checking answers

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

- None yet

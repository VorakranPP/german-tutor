# TODO

## 🔄 In Progress

- [ ] Deploy to Vercel
- [ ] Lesen Tab — B1 passage generator

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
- [x] Manual QA — spot check 50 random words (0 issues)
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
- [x] แสดง pronunciation บนการ์ด (หน้า + หลัง)
- [x] Search bar (ค้นหา DE/TH)

### Grammar Tab
- [x] Topic list 11 หัวข้อ (รวม Idiome)
- [x] Rule explanation in Thai
- [x] Fill-in-the-blank exercise (Claude Haiku)
- [x] Answer checking with explanation (Claude Haiku)
- [x] Idiome & Redewendungen (13 สำนวน)

### Reading Tab (Lesen)
- [x] Cache 50 บทอ่าน B1 (generate_reading.py)
- [x] คลิกคำ → popup คำแปล + คำอ่าน
- [x] คำที่ไม่มีในคลัง → auto-translate ด้วย Claude
- [x] 5 คำถาม multiple choice + เฉลย
- [ ] เพิ่มคำจาก popup เข้า vocab bank โดยตรง

### Speaking Tab (Sprechen) → Writing Practice
- [x] เลือกระดับ B1/B2
- [x] สุ่มหัวข้อ (8 B1 + 6 B2)
- [x] Claude Haiku ให้คะแนน 4 ด้าน × 5 = 20
- [x] Feedback ภาษาไทย (จุดเด่น, ควรพัฒนา, เคล็ดลับ)

### Diary Tab (Tagebuch)
- [x] Text editor เขียน diary ภาษาเยอรมัน
- [x] Claude Haiku แก้ + อธิบายภาษาไทย
- [x] แสดงจุดผิดแต่ละจุด ~~เดิม~~ → ถูก
- [x] Streak counter 🔥
- [x] History view
- [ ] เชื่อม wrong words → ลด level ใน vocabStore
- [ ] Export to PDF

## 🚀 Deployment

- [ ] Deploy frontend to Vercel
- [ ] Setup Railway for API proxy (if needed)
- [ ] Add to portfolio / Resume

## 🐛 Known Issues

- None yet

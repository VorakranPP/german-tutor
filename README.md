# 🇩🇪 DeutschMeister

> AI-powered German B1 tutor built with React + Claude API.  
> Flashcards, grammar drills, and daily diary correction for Goethe B1 exam prep.  
> **Road to Frankfurt. 🚀**

---

## Features

- **Vokabeln** — Flashcard + Spaced repetition (2,833 คำ) + search bar + filter CEFR/หมวด/ประเภท + คำอ่าน + ตัวอย่างประโยค B1
- **Grammatik** — 11 หัวข้อ B1 (รวม Idiome 13 สำนวน) + fill-in-the-blank + ตรวจคำตอบ ด้วย Claude Haiku
- **Sprechen** — Writing Practice B1/B2 สุ่มหัวข้อ Claude ให้คะแนน 4 ด้าน + feedback ภาษาไทย
- **Tagebuch** — เขียน diary ภาษาเยอรมัน Claude แก้ทุกจุด + streak counter 🔥 + history
- **Lesen** — 50 บทอ่าน B1 แบบ cache + คลิกคำดูความหมาย (auto-translate คำที่ไม่มีในคลัง) + 5 คำถาม MCQ

## Tech Stack

- **Frontend**: React 19 + Zustand + Tailwind CSS v4
- **Build**: Vite 5 (Node.js 20.x compatible)
- **AI**: Claude API — `claude-haiku-4-5-20251001` ทุก feature (Grammatik, Writing, Diary, Reading)
  - Prompt caching (ephemeral) ทุก call → ลด input token cost ~90% เมื่อใช้ซ้ำ
  - Single shared Anthropic client (`src/lib/client.js`) → easy maintenance
- **Deploy**: Vercel (frontend) + Railway (backend, optional)

## Getting Started

```bash
# 1. Clone repo
git clone <repo-url>
cd german-tutor

# 2. Install dependencies
npm install

# 3. Set API key
# ANTHROPIC_API_KEY ต้องอยู่ใน .env (ดูตัวอย่าง .env.example)

# 4. Start dev server
npm run dev
# Frontend: http://localhost:5176 (Vite)
# API proxy (optional): node dev-server.js (port 3001)
```

## Data Pipeline

```bash
# Parse Goethe word list (ทำแล้ว — vocab_raw.json พร้อม)
python3 scripts/parse_vocab.py

# Translate to Thai (ทำแล้ว — 2,833/2,833 คำ)
python3 scripts/translate_vocab.py

# Generate B1 example sentences (ทำแล้ว — 2,833/2,833 คำ)
python3 scripts/generate_examples.py
```

## Project Structure

```
german-tutor/
├── data/
│   ├── vocab_raw.json          # คำศัพท์ดิบ (ไม่มีคำแปล)
│   ├── vocab_translated.json   # คำศัพท์ครบ (th + example + pronunciation + category + cerf)
│   └── protected_fields.json   # manual fix tracking (ป้องกัน script overwrite)
├── scripts/
│   ├── parse_vocab.py          # แปลง sorted.txt → JSON
│   ├── translate_vocab.py      # แปลเป็นไทยด้วย Claude Haiku
│   ├── generate_examples.py    # สร้างประโยคตัวอย่าง B1
│   ├── generate_pronunciation.py # สร้างคำอ่านภาษาไทย
│   ├── tag_categories.py       # tag 14 หมวด Goethe B1
│   ├── fix_examples.py         # regenerate ประโยคที่ไม่มีคำเป้าหมาย
│   ├── fix_pronunciation.py    # แก้ pronunciation ที่มี non-Thai chars
│   └── utils.py                # safe_set(), protect() — ป้องกัน overwrite
├── src/                        # React app (Vite)
│   └── src/
│       ├── components/         # Flashcard, BottomNav
│       ├── data/               # grammarTopics.js
│       ├── lib/                # client.js (shared Anthropic instance), claude.js (grammar helpers)
│       ├── pages/              # VocabPage, GrammarPage, DiaryPage, SpeakingPage, LesenPage
│       └── stores/             # vocabStore, diaryStore, lesenStore (Zustand persist)
├── .env                        # ANTHROPIC_API_KEY (ไม่ commit)
└── CLAUDE.md                   # instructions for Claude Code


## Roadmap

See [TODO.md](TODO.md)

---

*Built by PP (Vorakran) — เตรียมสอบ Goethe B1 และ EU Blue Card สู่ Frankfurt 🇩🇪*

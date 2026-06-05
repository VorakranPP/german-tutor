# 🇩🇪 DeutschMeister

> AI-powered German B1 tutor built with React + Claude API.  
> Flashcards, grammar drills, and daily diary correction for Goethe B1 exam prep.  
> **Road to Frankfurt. 🚀**

---

## Features

- **Vokabeln** — Flashcard + Spaced repetition (2,833 คำ) + filter CEFR A1/A2/B1 + 14 หมวด Goethe B1 + คำอ่านภาษาไทย + ตัวอย่างประโยค B1
- **Grammatik** — 10 หัวข้อ B1 อธิบายภาษาไทย + fill-in-the-blank + ตรวจคำตอบด้วย Claude
- **อ่าน** — บทอ่านระดับ B1 สร้างด้วย Claude + คำถามทดสอบความเข้าใจ *(เร็วๆ นี้)*
- **ฝึกพูด** — พิมพ์ภาษาเยอรมัน Claude แก้ไข grammar *(เร็วๆ นี้)*
- **ไดอารี่** — เขียน diary ภาษาเยอรมัน Claude แก้และบันทึกคำผิดเข้า vocab bank อัตโนมัติ *(เร็วๆ นี้)*

## Tech Stack

- React 19 + Zustand + Tailwind CSS v4
- Vite 5 (Node.js 20.x compatible)
- Claude API — Haiku สำหรับ bulk tasks, Sonnet สำหรับ tutoring
- Vercel (frontend) + Railway (backend, optional)

## Getting Started

```bash
# 1. Clone repo
git clone <repo-url>
cd german-tutor

# 2. Set API key
cp .env.example .env
# แก้ ANTHROPIC_API_KEY ใน .env

# 3. Start frontend
cd src
npm install
npm run dev
# เปิด http://localhost:5173
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
│       ├── lib/                # claude.js (Anthropic SDK client)
│       ├── pages/              # VocabPage, GrammarPage, ...
│       └── stores/             # vocabStore (Zustand)
├── .env                        # ANTHROPIC_API_KEY (ไม่ commit)
└── CLAUDE.md                   # instructions for Claude Code
```

## Roadmap

See [TODO.md](TODO.md)

---

*Built by PP (Vorakran) — เตรียมสอบ Goethe B1 และ EU Blue Card สู่ Frankfurt 🇩🇪*

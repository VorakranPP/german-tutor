# 🇩🇪 DeutschMeister

> AI-powered German B1 tutor built with React + Claude API.  
> Flashcards, grammar drills, and daily diary correction for Goethe B1 exam prep.  
> **Road to Frankfurt. 🚀**

---

## Features

- **Vocabulary** — Flashcards with spaced repetition from Goethe-Zertifikat B1 Wortliste (2,833 words)
- **Grammar** — Rules explained in Thai + fill-in-the-blank exercises
- **Reading** — B1-level passages with AI comprehension questions
- **Speaking Practice** — Type and get instant grammar feedback from Claude
- **My Diary** — Write daily entries in German, Claude corrects and saves mistakes to vocab bank automatically

## Tech Stack

- React + Zustand + Tailwind CSS
- Claude API (claude-haiku for translation, claude-sonnet for tutoring)
- Vercel (frontend) + Railway (backend, optional)

## Getting Started

```bash
# Install dependencies
npm install

# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Run dev server
npm run dev
```

## Data Pipeline

```bash
# Parse Goethe word list
python3 scripts/parse_vocab.py

# Translate to Thai with pronunciation
python3 scripts/translate_vocab.py
```

## Project Structure

```
german-tutor/
├── data/               # vocab_raw.json, vocab_translated.json
├── scripts/            # Python parse + translate scripts
├── src/                # React app
│   ├── components/
│   ├── stores/         # Zustand state
│   └── pages/
├── .env
└── README.md
```

## Roadmap

See [TODO.md](TODO.md)

---

*Built by PP (Vorakran) as part of career transition to Frankfurt, Germany 🇩🇪*

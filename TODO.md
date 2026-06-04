# TODO

## 🔄 In Progress

- [ ] Set ANTHROPIC_API_KEY and run `translate_vocab.py`
- [ ] Verify `vocab_translated.json` quality (sample check)

## 📦 Data Pipeline

- [x] Download Goethe B1 Wortliste (`sorted.txt`)
- [x] Parse txt → JSON (`vocab_raw.json`)
- [ ] Translate + pronunciation → (`vocab_translated.json`)
- [ ] Manual QA — spot check 50 random words
- [ ] Commit final `vocab_translated.json` to repo

## 🎨 Frontend — React App

### Setup
- [ ] `npm create vite@latest src -- --template react`
- [ ] Install Zustand, Tailwind CSS
- [ ] Setup basic routing (React Router)
- [ ] App shell with 5 tabs: Vocabulary, Grammar, Reading, Speaking, Diary

### Vocabulary Tab
- [ ] Load vocab JSON
- [ ] Flashcard component (flip animation)
- [ ] Spaced repetition logic (level 1–5)
- [ ] Filter by type (noun/verb/other)
- [ ] Progress bar

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

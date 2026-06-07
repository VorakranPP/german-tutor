# PROJECT CONTEXT

## Background

PP (Vorakran Trisilanun) — Network Engineer, 14+ years experience, Bangkok.  
Currently upskilling toward **DevOps / Cloud Engineer** role at **Movolt Solutions GmbH, Frankfurt, Germany**.

This app is built as a personal study tool to prepare for the **Goethe-Zertifikat B1** exam,  
which is required before applying for the EU Blue Card visa.

## Why This App

- Existing apps (Duolingo, Anki) lack Thai explanations and don't target B1 exam specifically
- Need a tool that connects **daily writing practice** with **vocabulary review** automatically (Diary wrong words → auto-penalize in vocab)
- Built as a portfolio project to demonstrate React + AI integration (Claude API, Zustand, Tailwind CSS, spaced repetition)

## Target User

Primarily PP himself. Secondary: Thai people preparing for German language exams.

## Exam Target

| Exam | Target Date | Status |
|------|------------|--------|
| Goethe-Zertifikat B1 | Q3 2026 | 🔄 Preparing |
| AWS CLF-C02 | July 2026 | 🔄 Retake |
| AWS SAA-C03 | Q4 2026 | ⏳ Planned |

## Connection to Career Goal

```
German B1 cert + AWS certs + Portfolio projects
        ↓
Apply to Movolt Solutions GmbH (Frankfurt)
        ↓
EU Blue Card → Relocate with family to Germany (2027)
```

## Current Status (v0.8.2)

**Features Complete:**
- ✅ **Vokabeln Tab** — 2,833 flashcards + spaced repetition + search + filter (CEFR/หมวด/type) + pronunciation + example sentences
- ✅ **Grammatik Tab** — 10 B1 grammar topics + fill-in-the-blank exercises + Claude auto-checking + Thai explanations
- ✅ **Sprechen Tab** — Writing practice B1/B2 + Claude scoring + 4-aspect feedback (content, vocab, structure, fluency)
- ✅ **Tagebuch Tab** — German diary writing + Claude auto-correction + Thai explanations + correction history + streak counter 🔥
- ✅ **Lesen Tab** — 50 cached B1 reading passages + word lookup (auto-translate unknown words) + 5 MCQ comprehension questions

**Tech Optimizations:**
- Prompt caching on all Claude calls → ~90% input token cost reduction
- Single shared Anthropic client (src/lib/client.js) → simplified maintenance
- All features use `claude-haiku-4-5-20251001` (20x cheaper than Sonnet)

## Vocabulary Source

Goethe-Zertifikat B1 Wortliste — official word list from Goethe Institut Munich  
Source: https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_B1_Wortliste.pdf  
Parsed: 2,833 words (1,435 nouns, 586 verbs, 812 others)

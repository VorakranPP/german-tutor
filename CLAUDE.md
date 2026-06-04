# CLAUDE.md

Instructions for Claude when working on this project.

## Project Summary

German B1 study app — React frontend + Claude API backend.  
Vocabulary flashcards, grammar drills, reading, speaking practice, and daily diary with AI correction.

## Tech Stack

- **Frontend**: React, Zustand, Tailwind CSS
- **AI**: Anthropic Claude API (claude-sonnet-4-6 for tutoring, claude-haiku-4-5-20251001 for bulk tasks)
- **Deploy**: Vercel (frontend), Railway (API proxy if needed)
- **Data**: JSON seed file from Goethe B1 Wortliste (2,833 words)

## Key Conventions

- Components in `src/components/` — one file per component
- Zustand stores in `src/stores/` — one store per domain (vocab, diary, progress)
- Thai language UI — all labels, buttons, and explanations in Thai
- German grammar explanations always in Thai for PP's comprehension
- Vocab JSON structure:
  ```json
  {
    "id": "0001",
    "de": "die Wohnung",
    "type": "noun",
    "plural": "-en",
    "th": "อพาร์ตเมนต์",
    "example": "Meine Wohnung ist sehr schön.",
    "example_th": "อพาร์ตเมนต์ของฉันสวยมาก",
    "cerf": "A2"
  }
  ```
  Notes:
  - Verbs have `conjugation` instead of `plural`
  - `cerf` field: A1 (id 1–500), A2 (501–1500), B1 (1501–2833) — based on frequency rank
  - `pronunciation` field unused (removed from pipeline)

## Claude API Usage

- Use `claude-haiku-4-5-20251001` for: bulk translation, flashcard generation, simple Q&A
- Use `claude-sonnet-4-6` for: diary correction, grammar explanation, speaking feedback
- Always include Thai instruction in system prompt
- Keep max_tokens reasonable — 1024 for most tasks

## Spaced Repetition Logic

Cards have a `level` field (1–5). After each review:
- Correct → level + 1 (show less frequently)
- Wrong → level reset to 1 (show again soon)

## Diary → Vocab Pipeline

When Claude corrects a diary entry, extract words PP got wrong  
and automatically add them to the personal vocab bank with `source: "diary"`.

## Do Not

- Do not use localStorage — use Zustand with persist middleware to Railway DB
- Do not hardcode API keys — always use environment variables
- Do not add English UI — Thai only for all user-facing text

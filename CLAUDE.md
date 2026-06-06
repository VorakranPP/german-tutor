# CLAUDE.md

Instructions for Claude when working on this project.

## Project Summary

German B1 study app — React frontend + Claude API backend.  
Vocabulary flashcards, grammar drills, reading, speaking practice, and daily diary with AI correction.

## Tech Stack

- **Frontend**: React, Zustand, Tailwind CSS
- **AI**: Anthropic Claude API (claude-haiku-4-5-20251001 for all tasks)
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
    "cerf": "A2",
    "pronunciation": "ดี วอ-นุง",
    "category": "Wohnen"
  }
  ```
  Notes:
  - Verbs have `conjugation` instead of `plural`
  - `cerf`: A1 (id 1–500), A2 (501–1500), B1 (1501–2833) — based on frequency rank
  - `category`: 14 Goethe B1 topics (Alltag, Arbeit, Familie, Gesundheit, Reisen, Wohnen, Bildung, Einkaufen, Freizeit, Natur, Kommunikation, Gesellschaft, Sprache, Sonstige)
  - Manual fixes tracked in `data/protected_fields.json` — use `safe_set()` from `scripts/utils.py`

## Claude API Usage

- Use `claude-haiku-4-5-20251001` for: all tutoring tasks (diary correction, grammar explanation, speaking feedback, vocabulary, reading)
- Always include Thai instruction in system prompt
- Keep max_tokens reasonable — 1024 for most tasks
- All API calls include prompt caching (ephemeral) for cost reduction

## Spaced Repetition Logic

Cards have a `level` field (1–5). After each review:
- Correct → level + 1 (show less frequently)
- Wrong → level reset to 1 (show again soon)

## Diary → Vocab Pipeline

When Claude corrects a diary entry, extract words PP got wrong  
and automatically add them to the personal vocab bank with `source: "diary"`.

## Vocabulary Addition Workflow

When adding new words to `data/vocab_translated.json`:

1. **Check if word exists** using grep (case-insensitive partial match)
2. **Extract all unique words** from diary entry or text
3. **Filter out existing words** already in vocab_translated.json
4. **For each new word**, create entry following vocab JSON structure:
   - Required fields: `de`, `type`, `th`, `example`, `example_th`, `id`, `cerf`, `pronunciation`, `category`
   - For verbs: use `conjugation` instead of `plural`
   - For words from diary: add `source: "diary"` field
5. **Assign sequential IDs** (continue from last ID in file)
6. **Commit** with message: `feat: add N B1 vocabulary words from [source]`

See [VOCAB_WORKFLOW.md](./VOCAB_WORKFLOW.md) for detailed example and workflow.

## Do Not

- Do not use localStorage — use Zustand with persist middleware to Railway DB
- Do not hardcode API keys — always use environment variables
- Do not add English UI — Thai only for all user-facing text

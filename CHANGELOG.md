# CHANGELOG

## [Unreleased]

### In Progress
- Thai translation + pronunciation for all 2,833 vocab entries

---

## [0.1.0] — 2026-06-04

### Added
- Project structure initialized (`data/`, `scripts/`, `src/`)
- Downloaded Goethe-Zertifikat B1 Wortliste (`sorted.txt`) — 2,833 words
- `scripts/parse_vocab.py` — parses txt → JSON with type detection
  - Nouns: 1,435
  - Verbs: 586
  - Others: 812
- `scripts/translate_vocab.py` — batch translates to Thai with pronunciation via Claude API
- `data/vocab_raw.json` — parsed word list (no translation yet)
- Project documentation: README.md, PROJECT_CONTEXT.md, CLAUDE.md, TODO.md, CHANGELOG.md
- `.gitignore` setup
- Git repo initialized and pushed to GitHub

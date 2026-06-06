# Vocabulary Addition Workflow

Guide for adding new German vocabulary words to `data/vocab_translated.json`.

## Overview

When processing diary entries or text content, extract new vocabulary words and add them to the B1 vocabulary list following the established structure and conventions.

## Prerequisites

- Word must NOT already exist in `data/vocab_translated.json`
- Word should be B1 level or relevant to learner's current level
- Thai translation and pronunciation must be provided

## Step-by-Step Process

### 1. Extract and Filter Words

```bash
# Extract all unique words from text
grep -oE '\b[a-zA-ZäöüßÄÖÜ-]+\b' text.txt | tr '[:upper:]' '[:lower:]' | sort -u

# Check if word exists in vocabulary
grep -i "word" data/vocab_translated.json
```

### 2. Required Information per Word

Gather the following before adding:

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `de` | string | "das Abendessen" | German word (lowercase unless noun) |
| `type` | string | "noun", "verb", "adjective", "adverb", "pronoun", "other" | Part of speech |
| `plural` OR `conjugation` | string | "-en" or "essen, isst, aß, hat gegessen" | Grammar form (noun: plural; verb: conjugation) |
| `th` | string | "อาหารเย็น" | Thai translation |
| `example` | string | "Das Abendessen war lecker." | German example sentence |
| `example_th` | string | "อาหารเย็นนั้นอร่อยมาก" | Thai translation of example |
| `id` | string | "2834" | Sequential ID (continue from last ID) |
| `cerf` | string | "B1" | CERF level (A1, A2, or B1) |
| `pronunciation` | string | "อา-เบนท์-เอส-เซิน" | Thai phonetic spelling |
| `category` | string | "Einkaufen" | One of 14 Goethe B1 categories |
| `source` | string | "diary" | OPTIONAL: origin of word (diary, reading, etc.) |

### 3. Goethe B1 Categories

Choose appropriate category from these 14:
- **Alltag** (Daily Life)
- **Arbeit** (Work)
- **Familie** (Family)
- **Gesundheit** (Health)
- **Reisen** (Travel)
- **Wohnen** (Housing)
- **Bildung** (Education)
- **Einkaufen** (Shopping)
- **Freizeit** (Leisure)
- **Natur** (Nature)
- **Kommunikation** (Communication)
- **Gesellschaft** (Society)
- **Sprache** (Language)
- **Sonstige** (Other)

### 4. JSON Structure

#### For Nouns
```json
{
  "de": "das abendessen",
  "type": "noun",
  "plural": "-",
  "th": "อาหารเย็น",
  "example": "Das Abendessen war sehr lecker.",
  "example_th": "อาหารเย็นนั้นอร่อยมาก",
  "id": "2834",
  "cerf": "B1",
  "pronunciation": "อา-เบนท์-เอส-เซิน",
  "category": "Einkaufen",
  "source": "diary"
}
```

#### For Verbs
```json
{
  "de": "zubereiten",
  "type": "verb",
  "conjugation": "zubereiten, bereitet zu, bereitete zu, hat zubereitet",
  "th": "เตรียม / ปรุงอาหาร",
  "example": "Ich habe das Abendessen für meine Familie zubereitet.",
  "example_th": "ฉันเตรียมอาหารเย็นสำหรับครอบครัวของฉัน",
  "id": "2845",
  "cerf": "B1",
  "pronunciation": "ซู-เบไร-เทท",
  "category": "Alltag",
  "source": "diary"
}
```

#### For Adjectives/Adverbs/Other
```json
{
  "de": "anschließend",
  "type": "adverb",
  "th": "ต่อมา",
  "example": "Wir gingen ins Kino, anschließend aßen wir Pizza.",
  "example_th": "เราไปโรงภาพยนตร์ ต่อมาเรากินพิซซ่า",
  "id": "2835",
  "cerf": "B1",
  "pronunciation": "อาน-ชลีส-เซนท์",
  "category": "Kommunikation",
  "source": "diary"
}
```

### 5. Adding to File

1. Open `data/vocab_translated.json`
2. Find the last entry (before closing `]`)
3. Add comma after last entry's closing `}`
4. Insert new entry/entries with proper JSON formatting
5. Save file

### 6. Commit Changes

```bash
git add data/vocab_translated.json
git commit -m "feat: add N B1 vocabulary words from [source]

[Description of words added]

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

## Example Workflow

### Input
Diary entry: "Heute war ein gelungener Tag. Ich habe Musik und Podcasts gehört..."

### Step 1: Extract Words
```
abend, abendessen, anschließend, anspruchsvoll, beschäftigt, fitnessstudio, 
gehört, gelungener, musik, podcasts, programmierung, zubereitet, ...
```

### Step 2: Check Against Vocabulary
```bash
grep -i "abendessen\|anschließend\|podcasts" data/vocab_translated.json
# (no matches → these are new)
```

### Step 3: Add New Words
Add 12 entries to vocab_translated.json with IDs 2834-2845

### Step 4: Commit
```
feat: add 12 B1 vocabulary words from diary entry (IDs 2834-2845)

Added new words extracted from user diary: abendessen, anschließend, 
anspruchsvoll, beschäftigt, fitnessstudio, gehört, gelungener, mich, 
mittelmäßig, podcasts, programmierung, zubereitet.
```

## Validation Checklist

Before committing, verify:

- ✅ All required fields present for each word
- ✅ IDs are sequential and unique
- ✅ `cerf` level is appropriate (A1, A2, or B1)
- ✅ `category` is from the 14 approved categories
- ✅ `type` matches grammar type
- ✅ Verbs have `conjugation` field (not `plural`)
- ✅ Nouns have `plural` field (not `conjugation`)
- ✅ Thai translations are accurate
- ✅ Example sentences are natural German
- ✅ Pronunciations use Thai script
- ✅ JSON is valid (use `jq . data/vocab_translated.json` to check)
- ✅ Words with `source: "diary"` came from diary entries

## JSON Validation

```bash
# Validate JSON syntax
jq . data/vocab_translated.json > /dev/null && echo "✅ Valid JSON"

# Count total entries
jq 'length' data/vocab_translated.json

# Find specific word
jq '.[] | select(.de == "podcasts")' data/vocab_translated.json
```

## Notes

- **IDs must be sequential** — start from last ID + 1
- **Source field is optional** — use for tracking origin (diary, reading, etc.)
- **Thai pronunciation** — use Thai script, hyphen-separated syllables
- **Protected fields** — documented in `data/protected_fields.json`
- **Do not modify existing entries** — they may be protected

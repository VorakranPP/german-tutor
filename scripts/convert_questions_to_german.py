#!/usr/bin/env python3
"""
Convert reading comprehension questions from Thai to German using Claude Haiku.
Updates reading_passages.json with German questions and hidden Thai translations.
"""

import json
import os
from anthropic import Anthropic

# Initialize Anthropic client
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable not set")

client = Anthropic()

def convert_question(thai_q: str, thai_options: list[str]) -> tuple[str, list[str]]:
    """Convert Thai question and options to natural German using Claude Haiku."""

    options_text = "\n".join(f"- {opt}" for opt in thai_options)

    prompt = f"""You are a German language expert. Convert this Thai multiple-choice question
about a German reading passage to a natural German question.

IMPORTANT RULES:
1. Write ONLY German question and options - no Thai, no explanation
2. German should be B1 level, natural and clear
3. Keep the same meaning and answer logic
4. Format exactly as:
QUESTION: [German question]
OPTIONS:
- [Option A in German]
- [Option B in German]
- [Option C in German]

Thai question: {thai_q}

Thai options:
{options_text}

Convert NOW:"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    text = response.content[0].text.strip()

    # Parse response
    lines = text.split("\n")
    german_q = None
    german_options = []

    for i, line in enumerate(lines):
        if line.startswith("QUESTION:"):
            german_q = line.replace("QUESTION:", "").strip()
        elif line.startswith("OPTIONS:"):
            for j in range(i+1, len(lines)):
                if lines[j].startswith("- "):
                    german_options.append(lines[j].replace("- ", "").strip())

    return german_q or thai_q, german_options or thai_options

def process_passages():
    """Process all reading passages."""

    # Load reading passages
    script_dir = os.path.dirname(os.path.abspath(__file__))
    passages_file = os.path.join(script_dir, "../data/reading_passages.json")

    with open(passages_file, "r", encoding="utf-8") as f:
        passages = json.load(f)

    total = len(passages)
    converted = 0
    failed = 0

    print(f"📚 Converting {total} passages with ~5 questions each...")
    print(f"💰 Estimate: ~250 questions × Haiku = ~$0.15\n")

    for idx, passage in enumerate(passages, 1):
        print(f"[{idx}/{total}] {passage.get('title', 'Untitled')}... ", end="", flush=True)

        try:
            for q_idx, question in enumerate(passage.get("questions", [])):
                thai_q = question.get("q", "")
                thai_options = question.get("options", [])

                # Store Thai version
                question["q_th"] = thai_q
                question["options_th"] = thai_options

                # Convert to German
                german_q, german_options = convert_question(thai_q, thai_options)
                question["q"] = german_q
                question["options"] = german_options

                converted += 1

            print("✅")

        except Exception as e:
            print(f"❌ Error: {str(e)[:50]}")
            failed += 1

    # Save updated passages
    with open(passages_file, "w", encoding="utf-8") as f:
        json.dump(passages, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Complete!")
    print(f"   Converted: {converted} questions")
    print(f"   Failed: {failed}")
    print(f"   Saved: {passages_file}")

if __name__ == "__main__":
    process_passages()

#!/usr/bin/env python3
"""
Cache German word translations to avoid repeated API calls.
Extracts unique words from reading passages and translates them once.
"""

import json
import os
import re
from anthropic import Anthropic

api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable not set")

client = Anthropic()

def extract_unique_words(passages):
    """Extract all unique German words from passages (excluding common articles/prepositions)."""
    # Common German words to skip
    skip_words = {
        'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'eines',
        'und', 'oder', 'aber', 'doch', 'sondern', 'weil', 'wenn', 'dass', 'ob', 'zu', 'in',
        'von', 'mit', 'auf', 'an', 'für', 'ist', 'sind', 'war', 'waren', 'bin', 'bist',
        'hat', 'habe', 'haben', 'habt', 'wird', 'werde', 'werdet', 'sein', 'seien',
        'im', 'am', 'ins', 'ans', 'zur', 'zum', 'beim', 'aus', 'über', 'unter', 'durch',
        'nach', 'vor', 'gegen', 'bei', 'zwischen', 'seit', 'während', 'trotz', 'wegen',
        'nicht', 'kein', 'keine', 'keinen', 'keinem', 'keines', 'keine', 'ja', 'nein',
        'doch', 'so', 'sehr', 'mehr', 'wenig', 'viel', 'alle', 'beide', 'einige', 'einiger',
        'andere', 'anderer', 'jede', 'jeder', 'jedes', 'dieser', 'dieses', 'diese',
        'welcher', 'welche', 'welches', 'aller', 'alles', 'diesen', 'diesem',
        'es', 'mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen', 'mein', 'dein',
        'sein', 'ihr', 'unser', 'euer', 'hier', 'dort', 'da', 'dort', 'wohin', 'wo',
        'wie', 'was', 'wer', 'wen', 'wem', 'wessen', 'als', 'dann', 'damals', 'danach'
    }

    words = {}
    for passage in passages:
        text = passage.get('passage', '')
        # Split by whitespace and punctuation, keep only words with letters
        tokens = re.findall(r'\b[a-zäöüß]+\b', text.lower())
        for token in tokens:
            if token not in skip_words and len(token) > 2:
                words[token] = words.get(token, 0) + 1

    # Sort by frequency, return top 1500
    sorted_words = sorted(words.items(), key=lambda x: x[1], reverse=True)
    return [w[0] for w in sorted_words[:1500]]

def batch_translate_words(words, batch_size=20):
    """Translate words in batches to minimize API calls."""
    translations = {}
    failed = []

    print(f"📚 Caching {len(words)} unique German words...")
    print(f"💰 Estimate: {len(words)//batch_size + 1} API calls × Haiku = ~$0.01\n")

    for i in range(0, len(words), batch_size):
        batch = words[i:i+batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (len(words) + batch_size - 1) // batch_size

        print(f"[{batch_num}/{total_batches}] Translating {len(batch)} words... ", end="", flush=True)

        word_list = ", ".join(batch)
        prompt = f"""Translate these German words to Thai. Return as JSON only with German keys and Thai values.
Keep Thai translations SHORT (1-3 words max).
German words: {word_list}

Format exactly as:
{{"word1": "Thai1", "word2": "Thai2", ...}}

Translate NOW:"""

        try:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )

            text = response.content[0].text.strip()
            # Extract JSON
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                batch_translations = json.loads(json_match.group())
                translations.update(batch_translations)
                print("✅")
            else:
                print(f"⚠️ (parsing error)")
                failed.extend(batch)
        except Exception as e:
            print(f"❌ {str(e)[:40]}")
            failed.extend(batch)

    return translations, failed

def main():
    # Load passages
    script_dir = os.path.dirname(os.path.abspath(__file__))
    passages_file = os.path.join(script_dir, "../data/reading_passages.json")
    cache_file = os.path.join(script_dir, "../data/word_cache.json")

    with open(passages_file, "r", encoding="utf-8") as f:
        passages = json.load(f)

    # Extract unique words
    print("🔍 Extracting unique German words...")
    unique_words = extract_unique_words(passages)
    print(f"   Found {len(unique_words)} unique words\n")

    # Translate in batches
    translations, failed = batch_translate_words(unique_words)

    # Save cache
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Complete!")
    print(f"   Translated: {len(translations)} words")
    print(f"   Failed: {len(failed)}")
    print(f"   Saved: {cache_file}")

if __name__ == "__main__":
    main()

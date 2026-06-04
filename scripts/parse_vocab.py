import json
import re

def detect_word_type(line):
    # Noun: ขึ้นต้นด้วย der/die/das
    if re.match(r'^(der|die|das)\s', line):
        return "noun"
    # Verb: มี conjugation pattern เช่น ", hat, hatte"
    if re.search(r',\s*(hat|ist|wird)\s+\w+$', line):
        return "verb"
    # Adjective/Adverb: ที่เหลือ
    return "other"

def parse_noun(line):
    # "die Wohnung, -en" → word="die Wohnung", plural="-en"
    parts = line.split(',')
    word = parts[0].strip()
    plural = parts[1].strip() if len(parts) > 1 else ""
    return word, plural

def parse_verb(line):
    # "haben, hat, hatte, hat gehabt" → base form
    parts = line.split(',')
    word = parts[0].strip()
    return word

def parse_line(line):
    line = line.strip()
    if not line:
        return None

    word_type = detect_word_type(line)

    if word_type == "noun":
        word, plural = parse_noun(line)
        return {
            "de": word,
            "plural": plural,
            "type": "noun",
            "th": "",
            "example": ""
        }
    elif word_type == "verb":
        word = parse_verb(line)
        return {
            "de": word,
            "conjugation": line,
            "type": "verb",
            "th": "",
            "example": ""
        }
    else:
        return {
            "de": line,
            "type": "other",
            "th": "",
            "example": ""
        }

def main():
    input_file = "../data/sorted.txt"
    output_file = "../data/vocab_raw.json"

    words = []
    with open(input_file, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            parsed = parse_line(line)
            if parsed:
                parsed["id"] = str(i + 1).zfill(4)
                words.append(parsed)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    # สรุปผล
    nouns = sum(1 for w in words if w["type"] == "noun")
    verbs = sum(1 for w in words if w["type"] == "verb")
    others = sum(1 for w in words if w["type"] == "other")

    print(f"✅ Done! Total: {len(words)} words")
    print(f"   Nouns : {nouns}")
    print(f"   Verbs : {verbs}")
    print(f"   Others: {others}")
    print(f"   Output: {output_file}")

if __name__ == "__main__":
    main()

export const grammarTopics = [
  {
    id: 'kasus',
    title: 'กรณีการก (Kasus)',
    subtitle: 'Nominativ · Akkusativ · Dativ · Genitiv',
    icon: '📋',
    explanation: `ภาษาเยอรมันมี 4 กรณีการก (Fälle) ที่เปลี่ยนรูปคำนามและ article:

**Nominativ** — ประธานของประโยค
→ Der Mann schläft. (ผู้ชายนอนหลับ)

**Akkusativ** — กรรมตรง (ใครทำอะไร "กับ" อะไร)
→ Ich sehe den Mann. (ฉันเห็นผู้ชาย)

**Dativ** — กรรมรอง (ให้แก่ใคร)
→ Ich gebe dem Mann das Buch. (ฉันให้หนังสือแก่ผู้ชาย)

**Genitiv** — แสดงความเป็นเจ้าของ
→ Das ist das Auto des Mannes. (นั่นคือรถของผู้ชาย)

**ตาราง Article:**
| | Mask. | Fem. | Neut. | Pl. |
|---|---|---|---|---|
| Nom. | der | die | das | die |
| Akk. | den | die | das | die |
| Dat. | dem | der | dem | den |
| Gen. | des | der | des | der |`,
  },
  {
    id: 'perfekt',
    title: 'อดีตกาล Perfekt',
    subtitle: 'haben/sein + Partizip II',
    icon: '⏰',
    explanation: `**Perfekt** ใช้พูดเกี่ยวกับอดีตในชีวิตประจำวัน (ภาษาพูด)

**โครงสร้าง:** haben/sein + Partizip II

**ใช้ haben กับ:**
- กริยาส่วนใหญ่ที่มีกรรม
→ Ich habe Kaffee getrunken. (ฉันดื่มกาแฟแล้ว)
→ Er hat das Buch gelesen. (เขาอ่านหนังสือแล้ว)

**ใช้ sein กับ:**
- กริยาที่แสดงการเคลื่อนที่ (gehen, fahren, kommen, fliegen...)
- กริยาที่แสดงการเปลี่ยนสถานะ (werden, sterben, aufwachen...)
→ Ich bin nach Berlin gefahren. (ฉันไปเบอร์ลินแล้ว)
→ Sie ist eingeschlafen. (เธอหลับแล้ว)

**Partizip II:**
- กริยาปกติ: ge- + Stamm + -t → gemacht, gespielt
- กริยาผิดปกติ: ต้องจำ → gegangen, geschrieben, getrunken`,
  },
  {
    id: 'praeteritum',
    title: 'อดีตกาล Präteritum',
    subtitle: 'อดีตในภาษาเขียน',
    icon: '📜',
    explanation: `**Präteritum** ใช้ในภาษาเขียน เช่น นิยาย รายงาน ข่าว

**กริยาปกติ (schwache Verben):** Stamm + -te
→ machen → ich machte, du machtest
→ spielen → er spielte, wir spielten

**กริยาผิดปกติ (starke Verben):** เปลี่ยน Stamm ต้องจำ
→ gehen → ging
→ kommen → kam
→ schreiben → schrieb
→ sehen → sah

**Modalverben ใน Präteritum (ใช้บ่อยมาก):**
| กริยา | Präteritum |
|---|---|
| müssen | musste |
| können | konnte |
| wollen | wollte |
| sollen | sollte |
| dürfen | durfte |

→ Ich musste früh aufstehen. (ฉันต้องตื่นเช้า)`,
  },
  {
    id: 'konjunktiv2',
    title: 'Konjunktiv II',
    subtitle: 'สมมติ · ขอร้อง · สุภาพ',
    icon: '💭',
    explanation: `**Konjunktiv II** ใช้ในสถานการณ์:

**1. สมมติ / เงื่อนไข (Wunsch/Bedingung)**
→ Wenn ich reich wäre, würde ich reisen.
(ถ้าฉันรวย ฉันจะท่องเที่ยว)

**2. ขอร้องสุภาพ**
→ Könnten Sie mir helfen? (คุณช่วยฉันได้ไหม?)
→ Dürfte ich fragen? (ฉันขอถามได้ไหม?)

**3. แนะนำ**
→ Du solltest mehr schlafen. (คุณควรนอนมากกว่านี้)

**รูป Konjunktiv II ที่ใช้บ่อย:**
| กริยา | K.II |
|---|---|
| sein | wäre |
| haben | hätte |
| können | könnte |
| müssen | müsste |
| werden | würde |

**würde + Infinitiv** ใช้แทน K.II ของกริยาส่วนใหญ่
→ Ich würde gern kommen. (ฉันอยากมาจริงๆ)`,
  },
  {
    id: 'passiv',
    title: 'Passiv (ประโยคกรรมวาจก)',
    subtitle: 'werden + Partizip II',
    icon: '🔄',
    explanation: `**Passiv** เน้นที่การกระทำ ไม่ใช่ผู้กระทำ

**โครงสร้าง:** werden + Partizip II

**Präsens Passiv:**
→ Das Buch wird gelesen. (หนังสือถูกอ่าน)
→ Die Tür wird geöffnet. (ประตูถูกเปิด)

**Präteritum Passiv:**
→ Das Buch wurde gelesen. (หนังสือถูกอ่าน [ในอดีต])

**ถ้าอยากระบุผู้กระทำ ใช้ von + Dativ:**
→ Das Buch wird von dem Schüler gelesen.
(หนังสือถูกอ่านโดยนักเรียน)

**เทียบ Aktiv ↔ Passiv:**
| Aktiv | Passiv |
|---|---|
| Der Arzt behandelt den Patienten. | Der Patient wird (vom Arzt) behandelt. |`,
  },
  {
    id: 'relativsatz',
    title: 'ประโยคสัมพันธ์ (Relativsatz)',
    subtitle: 'der/die/das ที่ขยายคำนาม',
    icon: '🔗',
    explanation: `**Relativsatz** ขยายคำนามด้วยประโยคย่อย

**โครงสร้าง:** คำนาม + Relativpronomen + ... + กริยา (ท้ายประโยค)

**Relativpronomen ตรงกับ Genus + Kasus:**
| | Mask. | Fem. | Neut. | Pl. |
|---|---|---|---|---|
| Nom. | der | die | das | die |
| Akk. | den | die | das | die |
| Dat. | dem | der | dem | denen |

**ตัวอย่าง:**
→ Der Mann, **der** dort steht, ist mein Vater.
(ผู้ชายที่ยืนอยู่ตรงนั้นคือพ่อของฉัน) — Nom.

→ Das Buch, **das** ich lese, ist interessant.
(หนังสือที่ฉันอ่านน่าสนใจ) — Akk.

→ Die Frau, **der** ich helfe, ist nett.
(ผู้หญิงที่ฉันช่วยใจดี) — Dat.`,
  },
  {
    id: 'modalverben',
    title: 'Modalverben',
    subtitle: 'können · müssen · dürfen · sollen · wollen · mögen',
    icon: '⚙️',
    explanation: `**Modalverben** ใช้คู่กับ Infinitiv เสมอ (กริยาอยู่ท้ายประโยค)

**โครงสร้าง:** Subjekt + Modalverb + ... + Infinitiv

| Verb | ความหมาย | ตัวอย่าง |
|---|---|---|
| können | สามารถ / ทำได้ | Ich kann schwimmen. |
| müssen | ต้อง (จำเป็น) | Du musst lernen. |
| dürfen | อนุญาตให้ / ห้าม | Hier darf man nicht rauchen. |
| sollen | ควร (คนอื่นสั่ง) | Du sollst pünktlich kommen. |
| wollen | ต้องการ / อยากจะ | Er will Arzt werden. |
| mögen | ชอบ | Ich mag Kaffee. |
| möchten | อยากได้ (สุภาพ) | Ich möchte Wasser, bitte. |

**ข้อสังเกต:**
- Modalverb conjugate ตาม subject
- กริยาหลักอยู่ท้ายประโยคเสมอในรูป Infinitiv`,
  },
  {
    id: 'wechselpraepositionen',
    title: 'Wechselpräpositionen',
    subtitle: 'an · auf · hinter · in · neben · über · unter · vor · zwischen',
    icon: '📍',
    explanation: `**Wechselpräpositionen** ใช้ได้ทั้ง Akkusativ และ Dativ

**กฎง่ายๆ:**
- **Akkusativ** → ตอบคำถาม **Wohin?** (ไปที่ไหน = การเคลื่อนที่)
- **Dativ** → ตอบคำถาม **Wo?** (อยู่ที่ไหน = สถานที่)

**ตัวอย่าง:**
→ Ich lege das Buch **auf den** Tisch. (Akk. — วางลงบนโต๊ะ)
→ Das Buch liegt **auf dem** Tisch. (Dat. — หนังสืออยู่บนโต๊ะ)

→ Er hängt das Bild **an die** Wand. (Akk.)
→ Das Bild hängt **an der** Wand. (Dat.)

**9 คำบุพบท:**
an, auf, hinter, in, neben, über, unter, vor, zwischen`,
  },
  {
    id: 'adjektivdeklination',
    title: 'Adjektivdeklination',
    subtitle: 'การผันคุณศัพท์ตาม Article',
    icon: '🎨',
    explanation: `**คุณศัพท์** ที่อยู่หน้าคำนามต้องผันตาม Genus, Kasus และ Article

**หลัง definite article (der/die/das):**
| | Mask. | Fem. | Neut. | Pl. |
|---|---|---|---|---|
| Nom. | -e | -e | -e | -en |
| Akk. | -en | -e | -e | -en |
| Dat. | -en | -en | -en | -en |

→ der **alte** Mann, die **alte** Frau, das **alte** Haus

**หลัง indefinite article (ein/eine):**
| | Mask. | Fem. | Neut. |
|---|---|---|---|
| Nom. | -er | -e | -es |
| Akk. | -en | -e | -es |
| Dat. | -en | -en | -en |

→ ein **alter** Mann, eine **alte** Frau, ein **altes** Haus`,
  },
  {
    id: 'komparativ',
    title: 'Komparativ & Superlativ',
    subtitle: 'เปรียบเทียบขั้นกว่าและขั้นสูงสุด',
    icon: '📊',
    explanation: `**ขั้นปกติ → ขั้นกว่า → ขั้นสูงสุด**

**กฎทั่วไป:**
- Komparativ: คุณศัพท์ + **-er**
- Superlativ: am + คุณศัพท์ + **-sten**

→ schnell → schnell**er** → am schnell**sten**
→ klein → klein**er** → am klein**sten**

**คุณศัพท์ที่มี Umlaut:**
→ alt → **ält**er → am **ält**esten
→ groß → größ**er** → am größ**ten**
→ jung → **jüng**er → am **jüng**sten

**รูปผิดปกติต้องจำ:**
| ปกติ | Komparativ | Superlativ |
|---|---|---|
| gut | besser | am besten |
| viel | mehr | am meisten |
| gern | lieber | am liebsten |

**การเปรียบเทียบ:**
→ Er ist so groß **wie** ich. (เท่ากัน)
→ Er ist größer **als** ich. (มากกว่า)`,
  },
  {
    id: 'idiome',
    title: 'Idiome & Redewendungen',
    subtitle: 'สำนวนที่แปลตรงตัวไม่ได้',
    icon: '💬',
    explanation: `**Idiome** คือสำนวนที่ความหมายจริงต่างจากคำแปลตรงตัว — ต้องจำเป็นชุด

**ชีวิตประจำวัน:**
→ **Tee ziehen lassen** = แช่ชาให้ได้ที่
   (ตรงตัว: ปล่อยให้ชาดึง)
→ **Daumen drücken** = ขอให้โชคดี
   (ตรงตัว: กดนิ้วหัวแม่มือ)
→ **Das ist nicht mein Bier** = ไม่ใช่เรื่องของฉัน
   (ตรงตัว: นั่นไม่ใช่เบียร์ฉัน)

**ความเข้าใจ:**
→ **Ich verstehe nur Bahnhof** = ฉันไม่เข้าใจอะไรเลย
   (ตรงตัว: ฉันเข้าใจแค่คำว่าสถานีรถไฟ)
→ **Das ist mir Wurst** = ฉันไม่แคร์เลย
   (ตรงตัว: นั่นคือไส้กรอกของฉัน)

**การทำงาน/ความพยายาม:**
→ **Einen Zahn zulegen** = เร่งความเร็ว / พยายามมากขึ้น
   (ตรงตัว: เพิ่มฟันหนึ่งซี่)
→ **Den Nagel auf den Kopf treffen** = พูดถูกจุด
   (ตรงตัว: ตอกตะปูถูกหัว)
→ **Nicht auf den Mund gefallen sein** = พูดเก่ง, ไม่ขาดคำพูด
   (ตรงตัว: ไม่ล้มลงบนปาก)

**อารมณ์/ความรู้สึก:**
→ **Auf dem Holzweg sein** = เข้าใจผิด, ไปผิดทาง
   (ตรงตัว: อยู่บนเส้นทางไม้)
→ **Ins Fettnäpfchen treten** = พูดพลาด, ทำให้คนอื่นเขิน
   (ตรงตัว: เหยียบกระถางไขมัน)
→ **Jemandem auf den Keks gehen** = ทำให้รำคาญ
   (ตรงตัว: เดินบนคุกกี้ของใครบางคน)

**เคล็ดลับ:** Idiom ในเยอรมันมักใช้ร่างกาย อาหาร หรือสัตว์เป็นสัญลักษณ์`,
  },
]

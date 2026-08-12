# Jawab Google Sheet me kaise pahunchayein

Do minute ka kaam hai. Koi API key, koi Google Cloud project, kuch nahi.
Sirf ek Apps Script jo tumhari apni Sheet se juda hota hai.

## 1. Sheet banao

[sheets.new](https://sheets.new) kholo. Naam kuch bhi rakh lo, jaise
"Nainu ke jawab".

## 2. Script chipka do

Sheet me: **Extensions → Apps Script**. Jo bhi code pehle se dikhe use
mita do, aur neeche wala poora paste kar do.

```javascript
// Relationship Reality Check ke jawab is Sheet me daalta hai.
// Har sawaal ki apni ek line banti hai, taaki phone pe padhna aasan rahe.

var HEADERS = [
  'Kab bhara',
  'Submission',
  'Section',
  'Sawaal no.',
  'Sawaal',
  'Jawab',
  'Zaroori tha?'
]

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents)
    var rows = payload.rows || []
    if (!rows.length) {
      return reply({ ok: false, error: 'koi row nahi aayi' })
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]

    // Pehli baar header lagao.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS)
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
      sheet.setFrozenRows(1)
    }

    // Saari lines ek saath, ek ek karke nahi, warna 62 calls lag jaati.
    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length)
      .setValues(rows)

    return reply({ ok: true, added: rows.length })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}
```

## 3. Deploy karo

**Deploy → New deployment**

- Gear icon → type me **Web app** chuno
- **Execute as**: Me (tumhara apna account)
- **Who has access**: **Anyone**

  Ye zaroori hai, warna website ka server script tak pahunch hi nahi payega.
  Ghabrane wali baat nahi: is URL se koi kuch padh nahi sakta, sirf nayi
  lines add ho sakti hain. URL kisi ko dena mat, bas.

**Deploy** dabao, Google permission maangega, allow kar dena. Aakhir me ek
URL milega, kuch aisa:

```
https://script.google.com/macros/s/AKfycb....../exec
```

Wo URL copy kar lo.

## 4. Vercel me daal do

Vercel project → **Settings → Environment Variables**

| Name | Value |
| --- | --- |
| `SHEETS_WEBHOOK_URL` | upar wala `/exec` wala URL |

Save karke ek baar **redeploy** kar dena, warna nayi value uthegi nahi.

Bas. Ab jaise hi koi questionnaire submit karega, Sheet me lines aa
jayengi.

## Kaise pata chalega ki chal gaya

Questionnaire poora bhar ke submit karo. Aakhri screen pe neeche
**"Jawab mujh tak pahunch gaye"** dikhna chahiye. Sheet kholo, lines wahan
honi chahiye.

Agar laal card aaya "Jawab online save nahi ho paye", toh:

- URL `/exec` pe khatam hota hai na? (`/dev` pe nahi)
- "Who has access" **Anyone** hai na?
- Env var save karne ke baad redeploy kiya tha na?

## Sheet ke bina bhi kaam chalta rahega

`SHEETS_WEBHOOK_URL` set nahi hai, toh jawab Supabase me chale jaate hain,
jo pehle se laga hua hai. Sheet lag jaye toh wahi primary ban jaati hai,
aur Supabase sirf tab use hota hai jab Sheet kisi wajah se fail ho jaye.
Matlab jawab kisi bhi soorat me kho nahi sakte.

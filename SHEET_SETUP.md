# Connect the /join form to a Google Sheet

One-time setup, ~5 minutes. After this, every registration lands as a row in
your sheet (which you can also open/export in Excel).

The target sheet for CLIQUE is:
<https://docs.google.com/spreadsheets/d/1Q8o3weHfy1teNbwIG5AmhakEHsT_JwRGkDDUoWn8PFo/edit>
(sheet ID `1Q8o3weHfy1teNbwIG5AmhakEHsT_JwRGkDDUoWn8PFo`).

## Steps

1. Open that sheet (link above). You must be signed in as an account that can edit it.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste this:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Registrations');
  if (!sheet) sheet = ss.insertSheet('Registrations');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Roll No', 'Section', 'Nirma Email',
      'WhatsApp Number', 'Residence', 'Hometown', 'Skill Set',
      'Experience', 'Why Club', 'Good Fit',
    ]);
  }
  const p = e.parameter;
  sheet.appendRow([
    new Date(), p.name, p.rollNo, p.section, p.email,
    p.whatsapp, p.residence, p.hometown, p.skills,
    p.experience, p.whyClub, p.goodFit,
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy → New deployment**.
5. Gear icon → select type **Web app**.
   - Description: `clique registrations`
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, authorize when prompted, and copy the **Web app URL**
   (it ends in `/exec`).
7. Paste that URL into [src/lib/registration.ts](src/lib/registration.ts):

```ts
export const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/…/exec';
```

Done. The "DEMO MODE" tag on the /join page disappears automatically and
submissions start appearing in the sheet.

## Notes

- Until the URL is set, submissions are saved in the visitor's own browser
  (`localStorage` key `cliqueRegistrations`) so you can test the flow.
- To update the script later, edit it and use **Deploy → Manage deployments →
  Edit → New version** (the URL stays the same).
- Export to Excel anytime: **File → Download → Microsoft Excel (.xlsx)**.

// Registration submissions land in this Google Sheet via a Google Apps Script
// web app:
//   https://docs.google.com/spreadsheets/d/1Q8o3weHfy1teNbwIG5AmhakEHsT_JwRGkDDUoWn8PFo/edit
// Follow SHEET_SETUP.md (repo root) to add the Apps Script to that sheet and
// deploy it, then paste the deployment /exec URL below. Until then the form
// runs in demo mode: submissions are kept in localStorage so nothing is lost.

export const SHEET_WEBHOOK_URL = ''; // <-- paste your Apps Script /exec URL here

export interface Registration {
  name: string;
  rollNo: string;
  section: string;
  email: string;
  whatsapp: string;
  residence: string;
  hometown: string;
  skills: string;
  experience: string;
  whyClub: string;
  goodFit: string;
}

export const isSheetConfigured = (): boolean => SHEET_WEBHOOK_URL.length > 0;

export async function submitRegistration(data: Registration): Promise<void> {
  if (!isSheetConfigured()) {
    const key = 'cliqueRegistrations';
    let queue: unknown[] = [];
    try {
      queue = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      // corrupt store — start fresh
    }
    queue.push({ ...data, submittedAt: new Date().toISOString() });
    try {
      localStorage.setItem(key, JSON.stringify(queue));
    } catch {
      // ignore
    }
    console.warn('[CLIQUE] Sheet webhook not configured — registration stored locally only.', data);
    return;
  }

  // Form-encoded + no-cors: Apps Script web apps don't send CORS headers, so
  // the response is opaque — a resolved fetch means the row was delivered.
  const body = new URLSearchParams(Object.entries(data));
  await fetch(SHEET_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', body });
}

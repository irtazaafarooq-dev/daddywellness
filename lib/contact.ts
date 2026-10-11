export type ContactResult = { ok: true } | { ok: false; reason: 'not-configured' | 'error'; message: string };

export async function sendContact(data: Record<string, string>): Promise<ContactResult> {
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (r.ok) return { ok: true };
    const j = await r.json().catch(() => ({}));
    if (r.status === 503) return { ok: false, reason: 'not-configured', message: 'Messages aren’t switched on yet.' };
    return { ok: false, reason: 'error', message: j.error || 'Something went wrong.' };
  } catch {
    return { ok: false, reason: 'error', message: 'No connection. Try again.' };
  }
}

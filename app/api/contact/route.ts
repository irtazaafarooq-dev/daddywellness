import { NextResponse } from 'next/server';
import { PERSON } from '@/lib/site';

// Delivers "Connect" and brand-enquiry submissions to the management inbox via Resend.
// Env: RESEND_API_KEY (required), CONTACT_TO (defaults to the mgmt email), CONTACT_FROM (optional).

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const hits = new Map<string, number[]>(); // best-effort per-instance rate limit

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }

  // honeypot: real people never see or fill this field
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const email = clean(body.email, 254);
  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const budget = clean(body.budget, 60);
  const message = clean(body.message, 4000);
  const source = clean(body.source, 40) || 'website';

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 422 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many messages. Try again in a few minutes.' }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: 'not-configured' }, { status: 503 });

  const kind = message || company ? 'Brand enquiry' : 'New connection';
  const rows: [string, string][] = [
    ['Email', email], ['Name', name], ['Company / brand', company], ['Budget', budget], ['Came from', source],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
<h2 style="margin:0 0 12px;color:#e32226">${kind} from the Daddy Wellness website</h2>
<table style="border-collapse:collapse">${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join('')}</table>
${message ? `<p style="margin:16px 0 4px;color:#666">Message</p><p style="white-space:pre-wrap;margin:0">${esc(message)}</p>` : ''}
<p style="margin-top:20px;color:#888;font-size:13px">Hit reply to answer ${esc(email)} directly.</p></div>`;
  const text = [`${kind} from the Daddy Wellness website`, ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), message && `\nMessage:\n${message}`].filter(Boolean).join('\n');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Daddy Wellness Website <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || PERSON.email],
      reply_to: email,
      subject: `${kind}: ${name || company || email}`,
      html,
      text,
    }),
  });
  if (!r.ok) {
    console.error('Resend error', r.status, await r.text().catch(() => ''));
    return NextResponse.json({ error: 'Could not send right now.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

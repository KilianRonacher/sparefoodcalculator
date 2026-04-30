/**
 * SpareFoodCalculator — Contact Form Worker
 * ==========================================
 * Cloudflare Worker, der das Kontaktformular entgegennimmt und die
 * Nachricht via Resend an den Empfaenger weiterleitet.
 *
 * Env-Variablen (als Secrets via `wrangler secret put`):
 *   RESEND_API_KEY  — API-Key von resend.com
 *
 * Optionale Vars (in wrangler.toml [vars]):
 *   RECIPIENT_EMAIL — Ziel-Adresse (Default: kilianfelbertal@gmail.com)
 *   FROM_EMAIL      — Absender (muss eine in Resend verifizierte Domain sein)
 *
 * CORS ist auf die produktiven Origins beschraenkt + localhost fuer Tests.
 */

const ALLOWED_ORIGINS = [
  'https://sparefoodcalculator.com',
  'https://www.sparefoodcalculator.com',
  'https://kilianronacher.github.io',
  'http://localhost:8765',
  'http://127.0.0.1:8765'
];

const DEFAULT_RECIPIENT = 'kilianfelbertal@gmail.com';
// Resend's onboarding-Domain funktioniert ohne eigene verifizierte Domain.
// Sobald du sparefoodcalculator.com in Resend verifiziert hast, hier auf
// z. B. 'kontakt@sparefoodcalculator.com' aendern.
const DEFAULT_FROM = 'SpareFoodCalculator <onboarding@resend.dev>';

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return json(405, { error: 'method_not_allowed' }, origin);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json(400, { error: 'invalid_json' }, origin);
    }

    // Honeypot — legitime Nutzer fuellen das versteckte Feld nicht.
    // Bot-Submissions tun das oft. Wir tun so, als waere alles OK.
    if (data.website && String(data.website).trim() !== '') {
      return json(200, { ok: true, honey: true }, origin);
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();

    if (!name || !email || !message) {
      return json(400, { error: 'missing_fields' }, origin);
    }
    if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
      return json(400, { error: 'field_too_long' }, origin);
    }
    if (!isEmail(email)) {
      return json(400, { error: 'invalid_email' }, origin);
    }
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return json(500, { error: 'not_configured' }, origin);
    }

    const recipient = env.RECIPIENT_EMAIL || DEFAULT_RECIPIENT;
    const fromAddress = env.FROM_EMAIL || DEFAULT_FROM;

    const html =
      '<h2>Neue Kontaktanfrage — SpareFoodCalculator</h2>' +
      '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
      '<p><strong>E-Mail:</strong> ' + escapeHtml(email) + '</p>' +
      '<p><strong>Nachricht:</strong></p>' +
      '<p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' +
      '<hr><p style="color:#888;font-size:0.85em">Gesendet via SpareFoodCalculator-Kontaktformular</p>';

    const text =
      'Name: ' + name + '\n' +
      'E-Mail: ' + email + '\n\n' +
      'Nachricht:\n' + message;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        reply_to: email,
        subject: 'Kontakt von ' + name + ' (SpareFoodCalculator)',
        html: html,
        text: text
      })
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error', resendRes.status, errText);
      return json(502, { error: 'mail_delivery_failed' }, origin);
    }

    return json(200, { ok: true }, origin);
  }
};

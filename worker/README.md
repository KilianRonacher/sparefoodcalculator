# Contact Worker — Setup

Cloudflare Worker, der das Kontaktformular der Seite entgegennimmt und die
Nachricht via [Resend](https://resend.com) an deine E-Mail-Adresse weiterleitet.

Ergebnis: das Formular auf `pages/contact.html` POSTet auf einen Endpoint
unter deiner eigenen Cloudflare-Subdomain (z. B.
`https://sfc-contact.<dein-cloudflare-subdomain>.workers.dev`). Kein
externes Mailprogramm wird auf dem Geraet des Nutzers geoeffnet.

## Voraussetzungen (einmalig)

1. **Cloudflare-Account** (gratis): https://dash.cloudflare.com/sign-up
2. **Resend-Account** (gratis bis 3.000 Mails/Monat): https://resend.com/signup
3. **Node.js** lokal installiert (fuer `wrangler`).

## Setup-Schritte

### 1. Resend API-Key holen
- Bei Resend einloggen → "API Keys" → "Create API Key" → Name z. B. `sfc-worker` →
  Permission "Sending access" reicht → Key kopieren (faengt mit `re_...`).
- Den Key gut aufheben — Resend zeigt ihn nur einmal an.

### 2. Wrangler installieren und einloggen

```bash
cd worker
npm install -g wrangler   # falls noch nicht da
wrangler login            # oeffnet Browser-Login zu Cloudflare
```

### 3. Resend-API-Key als Secret setzen

```bash
wrangler secret put RESEND_API_KEY
# Wrangler fragt dich: Enter a secret value:
# → den re_... Key reinpasten und Enter
```

### 4. Worker deployen

```bash
wrangler deploy
```

Wrangler gibt am Ende eine URL aus, z. B.:
```
https://sfc-contact.<dein-username>.workers.dev
```

### 5. Diese URL ins Frontend eintragen

In `pages/contact.html` gibt es ganz oben in der Submit-JS-Funktion die Konstante

```js
const CONTACT_ENDPOINT = 'https://sfc-contact.REPLACE-ME.workers.dev';
```

Ersetze `REPLACE-ME` mit deiner echten Cloudflare-Subdomain (oder die ganze URL
durch deine).

### 6. Testen

- `pages/contact.html` lokal oder deployed oeffnen.
- Formular ausfuellen, abschicken.
- Beim ersten Mail kommt eine Resend-Bestaetigungsmail an
  `kilianfelbertal@gmail.com` (oder was du als RECIPIENT konfiguriert hast).
- Fertig.

## Optionale Nachjustierungen

### Eigene Domain als Absender (statt onboarding@resend.dev)
1. In Resend → "Domains" → eigene Domain (z. B. `sparefoodcalculator.com`) hinzufuegen.
2. DNS-Eintraege (DKIM, SPF) bei deinem DNS-Anbieter anlegen — Resend zeigt sie an.
3. Nach Verifizierung in `worker/contact-worker.js` die Konstante `DEFAULT_FROM`
   anpassen, z. B.:
   ```js
   const DEFAULT_FROM = 'SpareFoodCalculator <kontakt@sparefoodcalculator.com>';
   ```
4. Erneut deployen: `wrangler deploy`.

### Rate-Limit gegen Spam
Cloudflare-Dashboard → dein Worker → "Settings" → "Rate Limiting" — z. B.
10 Requests pro 5 Minuten pro IP. Kostet auf dem Free-Plan nichts fuer
einfache Regeln.

### Logs einsehen
```bash
wrangler tail
```
zeigt live alle Worker-Requests samt `console.log`/`console.error`.

## Datei-Uebersicht

| Datei | Zweck |
|---|---|
| `contact-worker.js` | Worker-Code (CORS, Validierung, Resend-Aufruf) |
| `wrangler.toml`     | Deployment-Konfiguration |
| `README.md`         | dieses Dokument |

const express = require('express');
const path    = require('path');
const { Resend } = require('resend');

const app  = express();
const PORT = 3000;

const resend           = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_TO_EMAIL   = process.env.CONTACT_TO_EMAIL   || 'management@hannes-brune.de';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Kontaktformular <onboarding@resend.dev>';

// Static assets
app.use(express.static(path.join(__dirname)));
app.use(express.json());

const SUBJECT_LABELS = {
  booking:     'Booking / Kampfanfrage',
  sponsoring:  'Sponsoring-Anfrage',
  media:       'Medien & Presse',
  interview:   'Interview / Podcast',
  kooperation: 'Kooperation / Zusammenarbeit',
  sonstige:    'Sonstige Anfrage',
};

// Contact form submission
app.post('/api/contact', async (req, res) => {
  if (!resend) {
    console.error('RESEND_API_KEY ist nicht gesetzt.');
    return res.status(500).json({ error: 'E-Mail-Versand ist derzeit nicht konfiguriert.' });
  }

  const { firstName, lastName, email, company, subject, message } = req.body || {};
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: 'Bitte alle Pflichtfelder ausfüllen.' });
  }

  const subjectLabel = SUBJECT_LABELS[subject] || subject;

  try {
    await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Kontaktformular] ${subjectLabel} — ${firstName} ${lastName}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `E-Mail: ${email}`,
        company ? `Unternehmen: ${company}` : null,
        `Betreff: ${subjectLabel}`,
        '',
        message,
      ].filter(Boolean).join('\n'),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Resend-Fehler:', err);
    res.status(502).json({ error: 'Nachricht konnte nicht gesendet werden. Bitte später erneut versuchen.' });
  }
});

// Named routes
const pages = {
  '/':          'index.html',
  '/ueber':     'ueber-hannes.html',
  '/kaempfe':   'kaempfe.html',
  '/galerie':   'galerie.html',
  '/sponsoren': 'sponsoren.html',
  '/kontakt':   'kontakt.html',
  '/impressum': 'impressum.html',
  '/datenschutz': 'datenschutz.html',
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('\x1b[31m');
  console.log('  ██╗  ██╗██████╗     ██████╗ ██████╗ ██╗   ██╗███╗   ██╗███████╗');
  console.log('  ██║  ██║██╔══██╗    ██╔══██╗██╔══██╗██║   ██║████╗  ██║██╔════╝');
  console.log('  ███████║██████╔╝    ██████╔╝██████╔╝██║   ██║██╔██╗ ██║█████╗  ');
  console.log('  ██╔══██║██╔══██╗    ██╔══██╗██╔══██╗██║   ██║██║╚██╗██║██╔══╝  ');
  console.log('  ██║  ██║██████╔╝    ██████╔╝██║  ██║╚██████╔╝██║ ╚████║███████╗');
  console.log('  ╚═╝  ╚═╝╚═════╝     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝');
  console.log('\x1b[0m');
  console.log(`\x1b[31m  🥊 http://localhost:${PORT}\x1b[0m\n`);
  console.log(`\x1b[90m  /             Startseite`);
  console.log(`  /ueber         Über Hannes`);
  console.log(`  /kaempfe       Kämpfe & Record`);
  console.log(`  /galerie       Galerie`);
  console.log(`  /sponsoren     Sponsoren`);
  console.log(`  /kontakt       Kontakt`);
  console.log(`  /impressum     Impressum`);
  console.log(`  /datenschutz   Datenschutz\x1b[0m\n`);
});

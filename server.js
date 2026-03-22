const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

// Static assets
app.use(express.static(path.join(__dirname)));

// Named routes
const pages = {
  '/':          'index.html',
  '/ueber':     'ueber-hannes.html',
  '/kaempfe':   'kaempfe.html',
  '/galerie':   'galerie.html',
  '/sponsoren': 'sponsoren.html',
  '/kontakt':   'kontakt.html',
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
  console.log(`  /kontakt       Kontakt\x1b[0m\n`);
});

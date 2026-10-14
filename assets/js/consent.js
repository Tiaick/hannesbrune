/* ============================================================
   HANNES BRUNE — Consent & Google Analytics
   gtag.js wird erst nach ausdrücklicher Einwilligung geladen.
   ============================================================ */
(function () {
  const GA_ID       = 'G-SWJ1TFYNSC';
  const STORAGE_KEY = 'hb-consent';
  const VERSION     = 1;

  function readConsent() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return raw && raw.v === VERSION ? raw.analytics : null;
    } catch (e) { return null; }
  }

  function writeConsent(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, analytics, ts: Date.now() }));
    } catch (e) { /* Speicher blockiert — Entscheidung gilt nur für diese Sitzung */ }
  }

  let gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearAnalyticsCookies() {
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(c => {
      const name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      domains.forEach(d => {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  /* ---- Banner ---- */
  let banner = null;

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-labelledby', 'consentTitle');
    banner.setAttribute('aria-describedby', 'consentText');
    banner.innerHTML =
      '<div class="consent__inner">' +
        '<div class="consent__body">' +
          '<p class="consent__eyebrow">Datenschutz</p>' +
          '<h2 class="consent__title" id="consentTitle">Kurze Statistik — okay?</h2>' +
          '<p class="consent__text" id="consentText">' +
            'Mit Ihrer Einwilligung nutzen wir Google Analytics, um zu verstehen, welche Inhalte ' +
            'gelesen werden. Dabei werden Cookies gesetzt und Daten an Google übertragen. ' +
            'Ohne Zustimmung bleibt alles aus. Widerruf jederzeit über „Cookie-Einstellungen“ im Footer. ' +
            '<a href="datenschutz.html#analytics">Mehr erfahren</a>' +
          '</p>' +
        '</div>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--outline consent__btn" data-consent="deny">Ablehnen</button>' +
          '<button type="button" class="btn btn--gold consent__btn" data-consent="accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    banner.addEventListener('click', e => {
      const choice = e.target.closest('[data-consent]');
      if (!choice) return;
      decide(choice.dataset.consent === 'accept');
    });
    document.body.appendChild(banner);
  }

  function showBanner() {
    if (!banner) buildBanner();
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-visible');
    setTimeout(() => { banner.hidden = true; }, 400);
  }

  function decide(analytics) {
    const previous = readConsent();
    writeConsent(analytics);
    hideBanner();
    if (analytics) {
      loadAnalytics();
    } else if (previous === true || gaLoaded) {
      // Widerruf: GA-Cookies entfernen und bereits geladenes gtag.js verwerfen
      clearAnalyticsCookies();
      location.reload();
    }
  }

  function init() {
    const consent = readConsent();
    if (consent === true) loadAnalytics();
    else if (consent === null) showBanner();

    document.querySelectorAll('[data-consent-open]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); showBanner(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

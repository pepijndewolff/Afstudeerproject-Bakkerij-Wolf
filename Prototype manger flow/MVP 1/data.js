/* ============================================================
   Wolf MVP — gedeelde datalaag (data.js)
   Eén bron van waarheid voor alle schermen.
   Vanilla JS, geen build, geen frameworks. Werkt op file://.

   Gebruik op elke pagina:
     <script src="data.js"></script>
   en daarna de pagina-eigen <script> die WolfData uitleest.
   ============================================================ */
(function () {
  'use strict';

  // ---- Constanten ----------------------------------------------------------
  const DAGEN = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const DAGEN_KORT = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
                   'augustus', 'september', 'oktober', 'november', 'december'];
  const LEVER_WEEKDAGEN = [2, 4, 6]; // dinsdag, donderdag, zaterdag
  const SLUIT_UUR = 15;             // 15:00 op de dag vóór levering
  const STORAGE_KEY = 'wolf-state-v1';

  // ---- Testmoment ----------------------------------------------------------
  // Vast "nu" voor de gebruikerstest: maandag 1 juni 2026, 14:00.
  // Zet TESTMODUS op false om weer de echte datum/tijd te gebruiken.
  const TESTMODUS = true;
  const TEST_NU = new Date(2026, 5, 1, 14, 0, 0); // maandag 1 juni 2026, 14:00

  function pad(n) { return String(n).padStart(2, '0'); }

  // ---- Statische masterdata ------------------------------------------------

  // Bakkerij-totaalcapaciteit per product (per leverdag).
  const PRODUCTEN = {
    'klassiek-1000': { naam: 'Klassiek 1000gr', capaciteit: 120 },
    'klassiek-1200': { naam: 'Klassiek 1200gr', capaciteit: 80 },
    'burger-buns':   { naam: 'Burger buns',     capaciteit: 200 },
    'baguette':      { naam: 'Baguette',        capaciteit: 150 },
    'brioche':       { naam: 'Brioche',         capaciteit: 20 }, // bewust krap: 20/20 = vol
  };

  // Klanten. type: 'regulier' | 'uitzondering'.
  const KLANTEN = [
    {
      id: 'juno',
      naam: 'Juno',
      type: 'uitzondering',
      contact: 'Olivier',
      telefoon: '+31 23 456 789',
      email: 'info@juno.nl',
      adres: ['Frans Halsstraat 42-3', '1042 BT, Amsterdam'],
      aanvraagNaDeadline: true,
      leverinstructies: 'Achterdeur bellen',
      producten: {
        'klassiek-1000': { max: 60, prijs: '4,20' },
        'klassiek-1200': { max: 60, prijs: '5,40' },
        'burger-buns':   { max: 30, prijs: '0,50' },
        'baguette':      { max: 80, prijs: '5,40' },
        'brioche':       { max: 40, prijs: '6,20' },
      },
      standaardorder: { 'klassiek-1000': 40, 'baguette': 25, 'brioche': 10 },
    },
    {
      id: '212',
      naam: '212',
      type: 'regulier',
      contact: 'Martijn van Dijk',
      telefoon: '+31 20 345 6789',
      email: 'info@212amsterdam.nl',
      adres: ['Herengracht 212', '1016 BS, Amsterdam'],
      aanvraagNaDeadline: false,
      leverinstructies: 'Voorzijde ingang',
      producten: {
        'klassiek-1000': { max: 50, prijs: '4,20' },
        'klassiek-1200': { max: 45, prijs: '5,40' },
        'burger-buns':   { max: 30, prijs: '0,50' },
        'baguette':      { max: 60, prijs: '5,40' },
      },
      standaardorder: { 'klassiek-1000': 30, 'burger-buns': 24 },
    },
    {
      id: 'cornerstore',
      naam: 'Cornerstore',
      type: 'uitzondering',
      contact: 'Thomas',
      telefoon: '+31 20 987 6543',
      email: 'info@cornerstore.nl',
      adres: ['Prinsengracht 88', '1015 KR, Amsterdam'],
      aanvraagNaDeadline: true,
      leverinstructies: 'Zijdeur rechts',
      producten: {
        'klassiek-1000': { max: 60, prijs: '4,20' },
        'baguette':      { max: 80, prijs: '5,40' },
        'brioche':       { max: 20, prijs: '6,20' },
      },
      standaardorder: { 'klassiek-1000': 30, 'baguette': 20 },
    },
  ];

  // ---- Tijd / leverdagcyclus (relatief aan echte nu) -----------------------

  function isLeverWeekdag(d) { return LEVER_WEEKDAGEN.indexOf(d.getDay()) !== -1; }

  function dagId(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function sluitMoment(leverdatum) {
    const s = new Date(leverdatum);
    s.setDate(s.getDate() - 1);
    s.setHours(SLUIT_UUR, 0, 0, 0);
    return s;
  }

  // Maandag (begin) van de week waarin datum d valt.
  function startOfWeek(d) {
    const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dag = (m.getDay() + 6) % 7; // ma = 0
    m.setDate(m.getDate() - dag);
    return m;
  }

  // Bouwt één leverdag-object met status: open | gesloten | geleverd.
  function buildDag(datum, focusId) {
    const now = nu();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dDate = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
    const sm = sluitMoment(datum);
    const id = dagId(datum);
    let st;
    if (dDate < today) st = 'geleverd';
    else if (now >= sm || isDagGesloten(id)) st = 'gesloten';
    else st = 'open';
    return {
      id: id,
      datum: datum,
      weekdag: DAGEN[datum.getDay()],
      sluitMoment: sm,
      state: st,
      gesloten: st !== 'open',
      geleverd: st === 'geleverd',
      isFocus: focusId ? id === focusId : false,
      label: `${DAGEN[datum.getDay()]} ${datum.getDate()} ${MAANDEN[datum.getMonth()]}`,
    };
  }

  // Id van de focusdag = eerstvolgende OPEN leverdag vanaf vandaag.
  function focusDagId() {
    const now = nu();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cursor = new Date(today);
    for (let i = 0; i < 28; i++) {
      if (isLeverWeekdag(cursor)) {
        const sm = sluitMoment(cursor);
        const id = dagId(cursor);
        if (now < sm && !isDagGesloten(id)) return id;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return null;
  }

  // Leverdag-objecten: 1 meest recente verstreken + de eerstvolgende 4 (dashboard).
  function getDeliveryDays() {
    const now = nu();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fid = focusDagId();

    const komend = [];
    const cursor = new Date(today);
    while (komend.length < 4) {
      if (isLeverWeekdag(cursor) && cursor >= today) komend.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    const vorige = new Date(today);
    vorige.setDate(vorige.getDate() - 1);
    while (!isLeverWeekdag(vorige)) vorige.setDate(vorige.getDate() - 1);

    return [vorige].concat(komend).map(function (d) { return buildDag(d, fid); });
  }

  // Leverdagen (di/do/za) van een week. offset = aantal weken t.o.v. deze week.
  function getWeekLeverdagen(offset) {
    const ma = startOfWeek(nu());
    ma.setDate(ma.getDate() + (offset || 0) * 7);
    const fid = focusDagId();
    const dagen = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(ma);
      d.setDate(d.getDate() + i);
      if (isLeverWeekdag(d)) dagen.push(buildDag(d, fid));
    }
    return dagen;
  }

  // ---- Klanten -------------------------------------------------------------

  // Alle klanten: basis + in de sessie toegevoegde, met bewerkingen toegepast.
  function getKlanten() {
    const st = state();
    const nieuw = st.nieuweKlanten || [];
    return KLANTEN.concat(nieuw).map(function (k) {
      const patch = st.klanten[k.id];
      return patch ? Object.assign({}, k, patch) : k;
    });
  }

  function klantById(id) {
    return getKlanten().find(function (k) { return k.id === id; });
  }

  function setKlant(id, patch) {
    const st = state();
    st.klanten[id] = Object.assign({}, st.klanten[id], patch);
    bewaar(st);
  }

  function addKlant(klant) {
    const st = state();
    if (!st.nieuweKlanten) st.nieuweKlanten = [];
    st.nieuweKlanten.push(klant);
    bewaar(st);
  }

  // ---- Standaardorders + aanvragen -----------------------------------------

  // Standaardorders (Juno + 212) — terugkerend op ELKE leverdag.
  function getOrders(dagId) {
    let id = dagId;
    if (!id) {
      const f = getDeliveryDays().find(function (d) { return d.isFocus; });
      id = f ? f.id : null;
    }
    if (!id) return [];
    const ingediend = state().orders[id] || {};
    return ['juno', '212'].map(function (kid, i) {
      const k = klantById(kid);
      return {
        dagId: id,
        klantId: kid,
        klant: k.naam,
        type: 'Standaardorder',
        tijdstip: i === 0 ? 'Zo 09:14' : 'Za 14:55',
        bestelnr: i === 0 ? '#001' : '#002',
        status: 'ingepland',
        aantallen: ingediend[kid] || Object.assign({}, k.standaardorder),
      };
    });
  }

  // Aanvragen (off-pattern). Cornerstore is de uitgewerkte (capaciteit/deadline).
  const AANVRAGEN_SEED = [
    {
      id: 'aanvraag-cornerstore',
      klantId: 'cornerstore',
      klant: 'Cornerstore',
      weekdag: 'Donderdag',
      tijdstip: 'Ma 10:42',
      reden: 'Bestellimiet',
      bestelnr: '#003',
      producten: [
        { productId: 'baguette', aantal: 40, status: 'past' },
        { productId: 'brioche',  aantal: 20, status: 'controleer' },
      ],
    },
    {
      id: 'aanvraag-juno',
      klantId: 'juno',
      klant: 'Juno',
      weekdag: 'Dinsdag',
      tijdstip: 'Ma 7:10',
      reden: 'Na deadline',
      bestelnr: '#004',
      producten: [
        { productId: 'klassiek-1000', aantal: 30, status: 'past' },
      ],
    },
    {
      id: 'aanvraag-212',
      klantId: '212',
      klant: '212',
      weekdag: 'Dinsdag',
      tijdstip: 'Ma 8:02',
      reden: 'Na deadline',
      bestelnr: '#005',
      producten: [
        { productId: 'baguette', aantal: 20, status: 'past' },
      ],
    },
  ];

  function getAanvragen() {
    const st = state();
    return AANVRAGEN_SEED.map(function (a) {
      const opgeslagen = st.aanvragen[a.id] || {};
      return Object.assign({}, a, {
        status: opgeslagen.status || 'te-beoordelen',
        aantallen: opgeslagen.aantallen || null,
      });
    });
  }

  function getAanvraag(id) {
    const lijst = getAanvragen();
    return id ? lijst.find(function (a) { return a.id === id; }) : lijst[0];
  }

  // ---- Paklijst (gesloten dag) ---------------------------------------------

  // Meest recente gesloten leverdag (door tijd óf handmatig via sluiten-flow).
  function getPaklijstDag() {
    const dagen = getDeliveryDays();
    const st = state();
    const gesloten = dagen.filter(function (d) { return d.gesloten || st.gesloten[d.id]; });
    if (!gesloten.length) return dagen[0];
    return gesloten.reduce(function (a, b) { return b.datum > a.datum ? b : a; });
  }

  // Per klant een paklijst met items (per product 1 regel) + afvinkstatus.
  function getPaklijstKlanten() {
    return ['juno', '212', 'cornerstore'].map(function (kid) {
      const k = klantById(kid);
      const items = getPaklijstItems(kid);
      const ingepakt = items.filter(function (it) { return it.ingepakt; }).length;
      return {
        klantId: kid,
        klant: k.naam,
        totaal: items.reduce(function (s, it) { return s + it.aantal; }, 0),
        items: items,
        aantalItems: items.length,
        ingepakt: ingepakt,
        klaar: ingepakt === items.length,
      };
    });
  }

  function getPaklijstItems(klantId) {
    const k = klantById(klantId);
    const order = k.standaardorder;
    const st = state();
    const checks = st.paklijst[klantId] || {};
    return Object.keys(order).map(function (pid, i) {
      return {
        productId: pid,
        product: PRODUCTEN[pid].naam,
        aantal: order[pid],
        ingepakt: checks[pid] === true || (checks[pid] === undefined && i === 0), // 1e default ingepakt
      };
    });
  }

  // ---- Muteerbare staat (sessionStorage) -----------------------------------
  function leegState() {
    return { aanvragen: {}, paklijst: {}, orders: {}, gesloten: {}, klanten: {}, nieuweKlanten: [] };
  }

  function state() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return leegState();
      return Object.assign(leegState(), JSON.parse(raw));
    } catch (e) {
      return leegState();
    }
  }

  function bewaar(st) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(st)); } catch (e) {}
  }

  function setAanvraagStatus(id, status, aantallen) {
    const st = state();
    st.aanvragen[id] = Object.assign({}, st.aanvragen[id], { status: status });
    if (aantallen) st.aanvragen[id].aantallen = aantallen;
    bewaar(st);
  }

  function setPaklijstItem(klantId, productId, ingepakt) {
    const st = state();
    if (!st.paklijst[klantId]) st.paklijst[klantId] = {};
    st.paklijst[klantId][productId] = ingepakt;
    bewaar(st);
  }

  function setDagGesloten(dagId) {
    const st = state();
    st.gesloten[dagId] = true;
    bewaar(st);
  }

  function isDagGesloten(dagId) { return state().gesloten[dagId] === true; }

  function aantalOpenAanvragen() {
    return getAanvragen().filter(function (a) { return a.status === 'te-beoordelen'; }).length;
  }

  function reset() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // ---- Datum/tijd helpers --------------------------------------------------
  function nu() { return TESTMODUS ? new Date(TEST_NU.getTime()) : new Date(); }

  function formatDatumTijd(d) {
    d = d || nu();
    return `${DAGEN[d.getDay()]}, ${d.getDate()} ${MAANDEN[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDatum(d) {
    return `${DAGEN[d.getDay()]} ${d.getDate()} ${MAANDEN[d.getMonth()]}`;
  }

  function weeknummer(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
    return 1 + Math.round((date - firstThursday) / (7 * 24 * 3600 * 1000));
  }

  // Bindt een live klok aan een element-id (vult tekst + ververst elke 30s).
  function bindKlok(elementId) {
    function tick() {
      const el = document.getElementById(elementId);
      if (el) el.textContent = formatDatumTijd(nu());
    }
    tick();
    setInterval(tick, 30000);
  }

  // ---- Publieke API --------------------------------------------------------
  window.WolfData = {
    DAGEN: DAGEN,
    DAGEN_KORT: DAGEN_KORT,
    MAANDEN: MAANDEN,
    LEVER_WEEKDAGEN: LEVER_WEEKDAGEN,
    PRODUCTEN: PRODUCTEN,
    KLANTEN: KLANTEN,
    getKlanten: getKlanten,
    klantById: klantById,
    setKlant: setKlant,
    addKlant: addKlant,
    getDeliveryDays: getDeliveryDays,
    getWeekLeverdagen: getWeekLeverdagen,
    startOfWeek: startOfWeek,
    sluitMoment: sluitMoment,
    getOrders: getOrders,
    getAanvragen: getAanvragen,
    getAanvraag: getAanvraag,
    getPaklijstDag: getPaklijstDag,
    getPaklijstKlanten: getPaklijstKlanten,
    getPaklijstItems: getPaklijstItems,
    setAanvraagStatus: setAanvraagStatus,
    setPaklijstItem: setPaklijstItem,
    setDagGesloten: setDagGesloten,
    isDagGesloten: isDagGesloten,
    aantalOpenAanvragen: aantalOpenAanvragen,
    state: state,
    reset: reset,
    nu: nu,
    formatDatumTijd: formatDatumTijd,
    formatDatum: formatDatum,
    weeknummer: weeknummer,
    bindKlok: bindKlok,
    pad: pad,
  };
})();

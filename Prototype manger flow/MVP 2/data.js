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
  // Vast "nu" voor de gebruikerstest: maandag 1 juni 2026, 14:00 — precies
  // 1 uur vóór het sluitmoment van de dinsdag-leverdag. Zo ziet Noor altijd
  // hetzelfde scenario: openstaande aanvragen klaar om te beoordelen en te sluiten.
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
  // producten: { productId: { max, prijs } }  — klant-maximum + klantprijs.
  // standaardorder: { productId: aantal }     — vaste terugkerende bestelling.
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
      leverwijze: 'levering',
      notities: 'Vaste afname op dinsdag. Levering vóór 08:00.',
      factuur: {
        email: 'facturen@juno.nl',
        bedrijfsnaam: 'Juno Horeca B.V.',
        adres: ['Frans Halsstraat 42-3', '1042 BT, Amsterdam'],
        btw: 'NL8123.45.678.B01',
        debiteurnr: 'DEB-1001',
      },
      producten: {
        'klassiek-1000': { max: 60, prijs: '4,20' },
        'klassiek-1200': { max: 60, prijs: '5,40' },
        'burger-buns':   { max: 30, prijs: '0,50' },
        'baguette':      { max: 80, prijs: '5,40' },
        'brioche':       { max: 40, prijs: '6,20' },
      },
      standaardorder: { 'klassiek-1000': 40, 'baguette': 25, 'brioche': 10 },
      geschiedenis: [
        { datum: 'Za 30 mei', bestelnr: '#0987', producten: 3, status: 'geleverd', leverwijze: 'levering' },
        { datum: 'Di 26 mei', bestelnr: '#0954', producten: 3, status: 'geleverd', leverwijze: 'levering' },
        { datum: 'Za 23 mei', bestelnr: '#0921', producten: 2, status: 'geleverd', leverwijze: 'levering' },
      ],
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
      leverwijze: 'ophalen',
      notities: 'Haalt zelf op rond 09:00.',
      factuur: {
        email: 'finance@212amsterdam.nl',
        bedrijfsnaam: '212 Amsterdam B.V.',
        adres: ['Herengracht 212', '1016 BS, Amsterdam'],
        btw: 'NL8234.56.789.B01',
        debiteurnr: 'DEB-1002',
      },
      producten: {
        'klassiek-1000': { max: 50, prijs: '4,20' },
        'klassiek-1200': { max: 45, prijs: '5,40' },
        'burger-buns':   { max: 30, prijs: '0,50' },
        'baguette':      { max: 60, prijs: '5,40' },
      },
      standaardorder: { 'klassiek-1000': 30, 'burger-buns': 24 },
      geschiedenis: [
        { datum: 'Za 30 mei', bestelnr: '#0985', producten: 2, status: 'opgehaald', leverwijze: 'ophalen' },
        { datum: 'Di 26 mei', bestelnr: '#0951', producten: 2, status: 'opgehaald', leverwijze: 'ophalen' },
      ],
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
      leverwijze: 'levering',
      notities: 'Mag aanvragen boven standaard capaciteit.',
      factuur: {
        email: 'admin@cornerstore.nl',
        bedrijfsnaam: 'Cornerstore B.V.',
        adres: ['Prinsengracht 88', '1015 KR, Amsterdam'],
        btw: 'NL8345.67.890.B01',
        debiteurnr: 'DEB-1003',
      },
      producten: {
        'klassiek-1000': { max: 60, prijs: '4,20' },
        'baguette':      { max: 80, prijs: '5,40' },
        'brioche':       { max: 20, prijs: '6,20' },
      },
      standaardorder: { 'klassiek-1000': 30, 'baguette': 20 },
      geschiedenis: [
        { datum: 'Do 28 mei', bestelnr: '#0972', producten: 2, status: 'geleverd', leverwijze: 'levering' },
        { datum: 'Do 21 mei', bestelnr: '#0918', producten: 2, status: 'geleverd', leverwijze: 'levering' },
      ],
    },
  ];

  const LEVERWIJZE_LABEL = { levering: 'Levering', ophalen: 'Ophalen' };

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
  // - geleverd  : de leverdag ligt in het verleden (bestelling is uitgeleverd)
  // - gesloten  : sluitmoment verstreken (of handmatig gesloten) → paklijst gemaakt
  // - open      : nog bestelbaar
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

  // ---- Standaardorders + aanvragen koppelen aan leverdagen -----------------

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

  // Standaardorders (Juno + 212) — terugkerend op ELKE leverdag.
  // Zonder dagId: de focusdag. Werkt voor elke leverdag, ook historische.
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
        leverwijze: k.leverwijze,
        leverwijzeLabel: LEVERWIJZE_LABEL[k.leverwijze] || '—',
        aantallen: ingediend[kid] || Object.assign({}, k.standaardorder),
      };
    });
  }

  // Aanvragen (off-pattern). Cornerstore is de uitgewerkte (capaciteit/deadline).
  // leverdagOffset = index in de eerstvolgende open leverdagen (0 = morgen/focusdag).
  // Status leeft in sessionStorage zodat beoordelen blijft hangen.
  const AANVRAGEN_SEED = [
    {
      id: 'aanvraag-cornerstore',
      klantId: 'cornerstore',
      klant: 'Cornerstore',
      leverdagOffset: 0,
      tijdstip: 'Ma 10:42',
      reden: 'Bestellimiet',
      bestelnr: '#003',
      // Aangevraagde producten met capaciteitscheck (Brioche loopt tegen 20/20)
      producten: [
        { productId: 'baguette', aantal: 40, status: 'past' },
        { productId: 'brioche',  aantal: 20, status: 'controleer' },
      ],
    },
    {
      id: 'aanvraag-juno',
      klantId: 'juno',
      klant: 'Juno',
      leverdagOffset: 1,
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
      leverdagOffset: 2,
      tijdstip: 'Ma 8:02',
      reden: 'Na deadline',
      bestelnr: '#005',
      producten: [
        { productId: 'baguette', aantal: 20, status: 'past' },
      ],
    },
  ];

  // Urgentie-volgorde voor sortering (lager = urgenter).
  const STATUS_ORDE = { 'te-beoordelen': 0, 'aangepast': 1, 'goedgekeurd': 2, 'afgewezen': 2 };

  function getAanvragen() {
    const st = state();
    const openDagen = getDeliveryDays().filter(function (d) { return !d.gesloten; });
    const lijst = AANVRAGEN_SEED.map(function (a) {
      const opgeslagen = st.aanvragen[a.id] || {};
      const dag = openDagen[a.leverdagOffset] || openDagen[openDagen.length - 1] || null;
      return Object.assign({}, a, {
        status: opgeslagen.status || 'te-beoordelen',
        aangepast: !!opgeslagen.aangepast,
        aantallen: opgeslagen.aantallen || null,
        leverdagId: dag ? dag.id : null,
        leverdag: dag,
        leverdagLabel: dag ? dag.label : '—',
      });
    });
    // Sorteer: openstaand eerst (op urgentie), dan eerstvolgende leverdag, afgehandelde onderaan.
    return lijst.sort(function (x, y) {
      const sx = STATUS_ORDE[x.status] != null ? STATUS_ORDE[x.status] : 1;
      const sy = STATUS_ORDE[y.status] != null ? STATUS_ORDE[y.status] : 1;
      if (sx !== sy) return sx - sy;
      const dx = x.leverdag ? x.leverdag.datum.getTime() : Infinity;
      const dy = y.leverdag ? y.leverdag.datum.getTime() : Infinity;
      return dx - dy;
    });
  }

  function getAanvraag(id) {
    const lijst = getAanvragen();
    return id ? lijst.find(function (a) { return a.id === id; }) : lijst[0];
  }

  // Open aanvragen voor een specifieke leverdag (blokkeert het sluiten van die dag).
  function aantalOpenAanvragenVoorDag(dagId) {
    return getAanvragen().filter(function (a) {
      return a.status === 'te-beoordelen' && a.leverdagId === dagId;
    }).length;
  }

  // ---- Paklijst (gesloten dag) ---------------------------------------------

  // Meest recente gesloten leverdag (door tijd óf handmatig via sluiten-flow).
  // Dit is de dag waarvan de paklijst getoond wordt.
  function getPaklijstDag() {
    const dagen = getDeliveryDays();
    const st = state();
    const gesloten = dagen.filter(function (d) { return d.gesloten || st.gesloten[d.id]; });
    if (!gesloten.length) return dagen[0];
    return gesloten.reduce(function (a, b) { return b.datum > a.datum ? b : a; });
  }

  // Per-klant paklijststatus: nog-te-pakken | klaar | geleverd | opgehaald.
  // 'geleverd'/'opgehaald' = afgerond (overdracht voltooid).
  function paklijstStatus(klantId, ingepakt, aantalItems) {
    const st = state();
    const afgerond = (st.paklijstAfgerond || {})[klantId];
    if (afgerond === 'geleverd' || afgerond === 'opgehaald') return afgerond;
    if (ingepakt === aantalItems && aantalItems > 0) return 'klaar';
    return 'te-pakken';
  }

  const PAKLIJST_STATUS_LABEL = {
    'te-pakken': 'Nog te pakken',
    'klaar': 'Klaar voor overdracht',
    'geleverd': 'Geleverd',
    'opgehaald': 'Opgehaald',
  };

  // Per klant een paklijst met items (per product 1 regel) + afvinkstatus.
  function getPaklijstKlanten() {
    return ['juno', '212', 'cornerstore'].map(function (kid) {
      const k = klantById(kid);
      const items = getPaklijstItems(kid);
      const ingepakt = items.filter(function (it) { return it.ingepakt; }).length;
      const status = paklijstStatus(kid, ingepakt, items.length);
      return {
        klantId: kid,
        klant: k.naam,
        leverwijze: k.leverwijze,
        leverwijzeLabel: LEVERWIJZE_LABEL[k.leverwijze] || '—',
        totaal: items.reduce(function (s, it) { return s + it.aantal; }, 0),
        items: items,
        aantalItems: items.length,
        ingepakt: ingepakt,
        klaar: ingepakt === items.length,
        status: status,
        statusLabel: PAKLIJST_STATUS_LABEL[status],
        afgerond: status === 'geleverd' || status === 'opgehaald',
      };
    });
  }

  function setPaklijstAfgerond(klantId, wijze) {
    const st = state();
    if (!st.paklijstAfgerond) st.paklijstAfgerond = {};
    st.paklijstAfgerond[klantId] = wijze; // 'geleverd' | 'opgehaald'
    bewaar(st);
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
    return { aanvragen: {}, paklijst: {}, paklijstAfgerond: {}, orders: {}, gesloten: {}, klanten: {}, nieuweKlanten: [] };
  }

  // Bestelgeschiedenis per klant: vaste historie + in deze sessie afgeronde order.
  function getBestelgeschiedenis(klantId) {
    const k = klantById(klantId);
    if (!k) return [];
    const basis = (k.geschiedenis || []).slice();
    const st = state();
    const afgerond = (st.paklijstAfgerond || {})[klantId];
    if (afgerond) {
      const dag = getPaklijstDag();
      const items = getPaklijstItems(klantId);
      basis.unshift({
        datum: dag ? dag.label.replace(/^(\w{2})\w+/, '$1') : 'Vandaag',
        bestelnr: klantId === 'juno' ? '#001' : klantId === '212' ? '#002' : '#003',
        producten: items.length,
        status: afgerond,
        leverwijze: k.leverwijze,
        vandaag: true,
      });
    }
    return basis;
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
    if (aantallen) {
      st.aanvragen[id].aantallen = aantallen;
      st.aanvragen[id].aangepast = true;
    }
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

  // ---- Zijbalk (centraal: rename, volgorde, badge, uitloggen) --------------
  const NAV_ITEMS = [
    { key: 'dagoverzicht', label: 'Dagoverzicht', href: '1-23-dashboard.html' },
    { key: 'aanvragen',    label: 'Aanvragen',    href: '1-298-aanvragen.html', badge: true },
    { key: 'bestellingen', label: 'Bestellingen', href: '1-109-bestellingen.html' },
    { key: 'paklijsten',   label: 'Paklijsten',   href: '1-441-paklijst.html' },
    { key: 'klanten',      label: 'Klanten',      href: '1-336-klanten-overzicht.html' },
  ];

  function buildSidebar(active) {
    const open = aantalOpenAanvragen();
    const items = NAV_ITEMS.map(function (it) {
      const isActief = it.key === active;
      const itemCls = isActief
        ? 'nav-item bg-[#f9f7f2] border-l-4 border-black px-8 py-3'
        : 'nav-item border-b border-[#b5ae9c] px-8 py-3';
      const tekstCls = isActief
        ? 'font-gt-bd text-[18px] text-[#1e1e1e] w-full'
        : 'font-gt-rg text-[18px] text-black w-full';
      const badge = (it.badge && open > 0)
        ? `<span class="bg-[#c45d1d] text-white inter-medium text-[13px] rounded-full px-2 py-[1px] min-w-[22px] text-center shrink-0">${open}</span>`
        : '';
      return `
        <a href="${it.href}" class="${itemCls}">
          <div class="flex items-center justify-between w-full gap-2">
            <p class="${tekstCls}" style="width:auto;">${it.label}</p>
            ${badge}
          </div>
        </a>`;
    }).join('');

    return `
      <nav class="flex flex-col w-full">${items}</nav>
      <div class="mt-auto px-8 pt-4">
        <button onclick="WolfData.uitloggen()" class="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 hover:opacity-70">
          <span class="inter-regular text-[16px] text-[#6b6456]">&#8592;</span>
          <span class="inter-regular text-[16px] text-[#6b6456]">Uitloggen</span>
        </button>
      </div>`;
  }

  // Vult elke <aside data-wolf-sidebar="KEY"> bij het laden van de pagina.
  function initSidebar() {
    const el = document.querySelector('[data-wolf-sidebar]');
    if (el) el.innerHTML = buildSidebar(el.getAttribute('data-wolf-sidebar'));
  }

  function uitloggen() {
    reset();
    window.location.href = '1-651-login.html';
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
      initSidebar();
    }
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
    aantalOpenAanvragenVoorDag: aantalOpenAanvragenVoorDag,
    getPaklijstDag: getPaklijstDag,
    getPaklijstKlanten: getPaklijstKlanten,
    getPaklijstItems: getPaklijstItems,
    setPaklijstAfgerond: setPaklijstAfgerond,
    getBestelgeschiedenis: getBestelgeschiedenis,
    LEVERWIJZE_LABEL: LEVERWIJZE_LABEL,
    setAanvraagStatus: setAanvraagStatus,
    setPaklijstItem: setPaklijstItem,
    setDagGesloten: setDagGesloten,
    isDagGesloten: isDagGesloten,
    aantalOpenAanvragen: aantalOpenAanvragen,
    buildSidebar: buildSidebar,
    initSidebar: initSidebar,
    uitloggen: uitloggen,
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

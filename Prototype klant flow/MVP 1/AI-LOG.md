# AI-LOG — Wolf Klant MVP 1

Logboek van AI-gebruik bij het uitwerken van het klantportaal prototype. Dit bestand is onderdeel van de afstudeerverantwoording. Elke werksessie met Claude Code krijgt een eigen blok, in omgekeerd chronologische volgorde (nieuwste boven).

**Doel:** transparant maken welke beslissingen door Pepijn (ontwerper) zijn genomen en welke door AI (uitvoerder).

---

## 2026-06-01 — 3 nieuwe schermen + updates (datum, credentials, sidebar, leverdata)

**Opdracht van Pepijn**
> Testdatum op 1 juni zetten; logingegevens test@klant.nl / 1234; 3 nieuwe schermen (bestelgeschiedenis, klant account, account bewerken) nabouwen op basis van screenshots; naam "Eerdere bestellingen" → "Bestel geschiedenis".

**Figma-schermen als bron gebruikt**
- `363:344` — Bestelgeschiedenis (via Figma REST API)
- `364:544` — Klant account (via Figma REST API)
- `364:676` — Account bewerken (via Figma REST API)
- Screenshots van alle drie aangeleverd door Pepijn als PNG

**Bestanden aangepast**
- `1-240-1846-login.html` — credentials gewijzigd naar test@klant.nl / 1234; test@standaard.nl toegevoegd als tweede account
- `1-240-1583-klant-dashboard.html` — datum → 1 juni 14:00; eerstvolgende leverdag → donderdag 4 juni; sidebar bijgewerkt
- `1-243-111-nieuwe-bestelling-standaard.html` — week-tabs en kaartdata → juni; sidebar bijgewerkt
- `1-243-348-nieuwe-bestelling-uitzondering.html` — idem
- `1-244-472-producten-kiezen.html`, `1-244-787-bestelling-controleren.html`, `1-244-990-bestel-bevestiging.html` — sidebar bijgewerkt

**Bestanden aangemaakt**
- `1-363-344-bestelgeschiedenis.html` — overzicht eerdere bestellingen met Herhaal-knoppen voor afgehandelde rijen
- `1-364-544-klant-account.html` — leesscherm met contactgegevens + prijsafspraken tabel
- `1-364-676-account-bewerken.html` — bewerkscherm met input-velden + Opslaan/Annuleren knoppen

**Aannames door Claude**
- `test@klant.nl` gekoppeld aan klanttype `uitzondering` (meest informatieve testflow). Pepijn heeft geen klanttype gespecificeerd.
- Leverdag-kaarten in juni: patroon identiek aan Figma, datums bijgewerkt naar juni 2026.
- Account bewerken: Opslaan + Annuleren knoppen toegevoegd (niet in Figma zichtbaar). Navigeren terug naar klant-account.
- Brioche prijs 6,20 in prijsafspraken overgenomen uit Figma screenshot.

**Ontwerpkeuzes (door Pepijn bepaald)**
- Naam "Bestel geschiedenis" (twee woorden) — exact uit Figma
- Datum 1 juni als testdatum — door Pepijn bevestigd
- Alle lay-out, kleuren, content uit Pepijns Figma-schermen + screenshots

**Open vragen**
1. Klanttype voor test@klant.nl: nu `uitzondering` — correct?
2. Opslaan/Annuleren in account bewerken: door Claude toegevoegd. Akkoord?
3. Brioche: 6,20 in prijsafspraken vs. 0,50 in producten-kiezen — bewust of Figma-inconsistentie?

**AI-gebruik samengevat**
Claude heeft datum/credentials/sidebar bijgewerkt in bestaande bestanden en 3 nieuwe schermen gebouwd op basis van Figma JSON + Pepijns screenshots. De Opslaan/Annuleren-knoppen zijn een prototypeaanvulling.

---

## 2026-06-01 — 7 Figma-schermen geïmplementeerd (eerste sessie klantkant)

**Opdracht van Pepijn**
> Implementeer deze 7 designs vanuit Figma:
> - 243:348 Nieuwe bestelling - uitzonderingsklant
> - 244:472 Producten kiezen
> - 244:787 Bestelling controleren
> - 244:990 Bestel bevestiging
> - 243:111 Nieuwe bestelling - standaard klant
> - 240:1583 Klant dashboard
> - 240:1846 Login

**Figma-schermen als bron gebruikt**
Alle 7 frames rechtstreeks via de Figma REST API opgehaald (screenshots + volledige JSON node-data) met het persoonlijk toegangstoken. De Figma MCP-server (`figma-developer-mcp`) stond geconfigureerd maar kon niet verbinden tot het token was vernieuwd.

**Aannames door Claude**
- Testdatum: maandag 23 maart 2026, 13:06 — afgeleid uit de Figma dashboard-tekst "Maandag, 23 maart, 13:06". Niet door Pepijn bevestigd; mogelijk moet dit gelijk worden getrokken met de Wolf MVP 1 testdatum (1 juni 2026). Open punt.
- Login-accounts: twee dummy-accounts aangemaakt (juno@juno.nl en juno@uitzondering.nl, beide wachtwoord '1234') om de twee klanttypen te testen. Pepijn heeft de logingegevens niet gespecificeerd.
- Navigatie van "Herhaal Bestelling #002" laadt de baguette+klassiek-aantallen uit bestelling #002 in het productenformulier. Dit is logica die niet expliciet in de Figma staat — aanname op basis van CLAUDE.md.
- Baguette-max is 80 (klantmaximum), overeenkomstig de Figma. Aantallen boven 80 worden automatisch als aanvraag behandeld.
- De "Aanvraag"-melding op de bevestigingspagina toont alleen als het aantallen boven het max zijn, óf als de leverdag zelf een aanvraagdag was (uitzonderingsklant).
- Assets (logo SVG, fonts, iconen) gekopieerd vanuit Wolf MVP 1/Assets — geen nieuwe assets gemaakt of verzonnen.
- Inline SVG-iconen (kalender, pijlen, check) zijn door Claude geschreven omdat de Figma-assets niet als vectorbestanden exporteerbaar waren zonder extra stap. Uitzondering: wolf logo 1.svg, envelope.svg, lock.svg, calendar.svg, warning.svg, checkmark.svg zijn letterlijk overgezet.

**Bestanden aangemaakt**
- `1-240-1846-login.html` — Login klantportaal
- `1-240-1583-klant-dashboard.html` — Klantdashboard
- `1-243-111-nieuwe-bestelling-standaard.html` — Leverdag kiezen (standaard klant)
- `1-243-348-nieuwe-bestelling-uitzondering.html` — Leverdag kiezen (uitzonderingsklant)
- `1-244-472-producten-kiezen.html` — Producten en aantallen kiezen
- `1-244-787-bestelling-controleren.html` — Bestelling controleren
- `1-244-990-bestel-bevestiging.html` — Bestelbevestiging
- `assets/` — wolf logo 1.svg, envelope.svg, lock.svg, calendar.svg, warning.svg, checkmark.svg, arrow-right.svg, GT America Extended Regular.ttf

**Interacties toegevoegd**
- Login → dashboard (met klanttype opgeslagen in sessionStorage)
- Dashboard → juiste leverdag-scherm op basis van klanttype (standaard of uitzondering)
- Leverdag kiezen → producten kiezen (leverdag + aanvraagstatus opgeslagen)
- Producten kiezen: +/− knoppen, aanvraag-detectie (boven klantmax), live samenvatting
- Bestelling controleren: dynamische opbouw uit sessionStorage, Ingepland/Aanvraag-statussen
- Bevestiging: aanvraagmelding conditioneel zichtbaar; sessie gedeeltelijk opgeschoond

**Ontwerpkeuzes (door Pepijn in Figma bepaald)**
- Alle kleuren, typografie, spacing en layout exact overgenomen uit Figma-schermen
- Teksten letterlijk overgenomen uit Figma JSON
- Twee aparte HTML-bestanden voor standaard- en uitzonderingsklant (idem Figma: twee aparte frames)
- Aanvraagkaart op uitzonderingsklant-scherm heeft witte achtergrond i.p.v. de beige van beschikbare kaarten

**Voorstellen aan Pepijn**
- Geen voorstellen gedaan — alle inhoud en structuur kwamen uit Figma. Wel open punten hieronder.

**Open vragen / beslissingen voor Pepijn**
1. **Testdatum:** moet de klantkant dezelfde vaste datum gebruiken als Wolf MVP 1 (maandag 1 juni 2026, 14:00), of de datum uit de Figma-mockup (maandag 23 maart 2026, 13:06)?
2. **Logincredentials:** welke e-mailadressen/wachtwoorden moeten werken in de test? Nu: `juno@juno.nl` en `juno@uitzondering.nl`, wachtwoord `1234`.
3. **Eerdere bestellingen-scherm:** staat nog niet in de 7 Figma-frames — is er al een Figma-ontwerp voor?
4. **Mijn account:** geen Figma-frame aangeleverd — link staat er in maar gaat nergens naartoe.
5. **Herhaal bestelling #002:** laadt nu dezelfde vaste aantallen (20 klassiek + 90 baguette). Is dit de bedoeling voor de test?

**AI-gebruik samengevat**
Claude heeft alle 7 Figma-frames nagebouwd als HTML/CSS/JS, op basis van screenshots en de ruwe Figma JSON node-data. Alle teksten, kleuren en layout zijn direct uit Figma overgenomen. Navigatie en eenvoudige prototype-state zijn door Claude toegevoegd conform CLAUDE.md-richtlijnen. Inhoudelijke keuzes (scherminhoud, microcopy, klanttypen, aanvraaglogica) zijn volledig door Pepijn in Figma bepaald.

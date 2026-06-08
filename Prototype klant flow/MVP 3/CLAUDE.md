# Wolf MVP — Prototype-instructie voor Claude Code (klantkant)

Dit project is een **afstudeerproject** voor CMD. De HTML-schermen in deze folder zijn (of worden) gegenereerd vanuit een Figma-ontwerp via de Figma MCP server. Het doel is om deze schermen uit te werken tot een **klikbaar, testbaar prototype** waarmee de **klantflow** van Bakkerij Wolf getest kan worden in een desktop browser.

Lees dit bestand bij elke sessie. Houd je hier strikt aan.

> **Let op — status van deze folder:** op het moment van schrijven staan de Figma-schermen nog niet als HTML in `Wolf Klant MVP 1`. Zodra ze geëxporteerd zijn, gelden de bestandsnaam- en assetregels hieronder. Verzin in de tussentijd geen schermen of bestanden zelf.

---

## Project context — Bakkerij Wolf

Bakkerij Wolf verwerkt B2B-bestellingen van restaurants en bedrijven. Nu komen die vooral via e-mail binnen en worden ze handmatig overgenomen in interne lijsten voor productie, planning, levering en facturatie. Dat geeft extra werk, fouten en weinig overzicht — vooral bij wijzigingen, uitzonderingen en drukke momenten.

Het prototype onderzoekt hoe een digitaal bestelportaal dit kan ondersteunen. Het volledige systeem bestaat uit twee kanten:

1. **Klantportaal** — waar zakelijke klanten bestellingen plaatsen, herhalen en aanvragen indienen.
2. **Bakkerijportaal** — waar Wolf bestellingen bekijkt, aanvragen beoordeelt, klantafspraken beheert en paklijsten gebruikt (uitgewerkt in de folder `Wolf MVP 1`).

**Deze CLAUDE.md gaat alleen over de klantkant.** Aanvragen die de klant indient, worden aan de andere kant door Wolf beoordeeld in het bakkerijportaal — dat is buiten scope van dit prototype, maar verklaart waarom een aanvraag aan klantzijde "nog niet definitief" is.

---

## Prototype scope — klantflow

Dit prototype werkt de klantflow uit. De klant moet zelfstandig een bestelling kunnen plaatsen of herhalen, een leverdag kiezen en begrijpen wanneer een bestelling direct geplaatst wordt of wanneer het een aanvraag wordt.

De flow moet geschikt zijn voor gebruikerstests. Het hoeft geen volledig werkend product te zijn — het is een testmiddel om te observeren of zakelijke klanten de flow, regels en meldingen begrijpen.

**Gebruiker in scope:** een zakelijke klant van Bakkerij Wolf, bijvoorbeeld een restaurant of bedrijf dat regelmatig brood of andere producten bestelt.

De klant moet in het prototype kunnen: inloggen, het klantdashboard bekijken, een nieuwe bestelling starten, een leverdag kiezen, producten en aantallen kiezen, zien welke aantallen mogelijk zijn, begrijpen wanneer een bestelling direct geplaatst wordt versus een aanvraag wordt, de bestelling controleren en bevestigen, eerdere bestellingen bekijken en herhalen, en de status van bestellingen of aanvragen bekijken.

---

## Centrale concepten en regels

Gebruik alleen regels die door Pepijn zijn aangeleverd. **Bedenk geen nieuwe capaciteits-, deadline- of aanvraagregels.**

**Levermomenten.** Wolf levert op vaste dagen: **dinsdag, woensdag, donderdag en zaterdag.** De klant kiest een leverdag. Niet elke leverdag is altijd beschikbaar — beschikbaarheid hangt af van de deadline, het klanttype en de aanvraagrechten van de klant.

**Reguliere klant.** Mag bestellen tot uiterlijk **48 uur vóór de leverdag**. Is de deadline verstreken, dan wordt die leverdag niet als normale besteloptie aangeboden; de klant wordt verwezen naar de eerstvolgende beschikbare leverdag. Bestellen na de deadline kan niet via het portaal, en uitzonderingen worden niet actief gestimuleerd.

**Uitzonderingsklant.** Heeft extra aanvraagrechten en kan ná de normale deadline nog een aanvraag indienen, zolang dit binnen de aanvraagperiode valt:
- normale bestellingen tot **48 uur** vóór levering;
- aanvragen tot **24 uur** vóór levering;
- aanvragen worden door Wolf beoordeeld (goedkeuren, aanpassen of afwijzen);
- de klant moet duidelijk begrijpen dat een aanvraag **nog geen definitieve bestelling** is.

**Aanvraag.** Een bestelling of wijziging die niet automatisch geplaatst kan worden, bijvoorbeeld omdat de normale deadline verstreken is, een klant met aanvraagrechten toch nog wil bestellen, een aantal boven een klantmaximum of productcapaciteit uitkomt, of Wolf de haalbaarheid eerst moet beoordelen. Presenteer een aanvraag nooit alsof die al bevestigd is. Gebruik duidelijke status en microcopy, bijvoorbeeld: "Aanvraag ingediend", "Wacht op beoordeling", "Nog niet definitief", "Wolf beoordeelt of dit nog haalbaar is".

**Capaciteit en klantmaxima.** Intern spelen twee limieten: bakkerijcapaciteit per product en een maximum per klant. Aan de klantkant hoeft de volledige berekening niet zichtbaar te zijn. De klant moet vooral begrijpen welke aantallen mogelijk zijn, wanneer een aantal boven de normale ruimte komt, wanneer iets als aanvraag wordt behandeld, en wat de status van die aanvraag is.

---

## Schermen binnen de klantflow

De exacte schermnamen kunnen per Figma-export verschillen. **Gebruik de bestaande HTML- en Figma-schermen als waarheid.** De klantflow bestaat in ieder geval uit deze schermtypen:

- Login klantportaal
- Klantdashboard
- Nieuwe bestelling starten
- Leverdag kiezen
- Producten kiezen
- Aantallen aanpassen
- Bestelling controleren
- Bestelling bevestigen
- Bevestigingsscherm
- Bestelgeschiedenis / recente bestellingen
- Detailweergave van bestelling of aanvraag
- Herhaal-bestelling-flow
- Statusweergave van bestellingen en aanvragen

Bestaat een scherm nog niet, maak het dan **niet** zelf op basis van vrije interpretatie. Vraag eerst of Pepijn het in Figma wil aanleveren of expliciet als prototypevariant wil laten uitwerken.

---

## Belangrijke testflow

Het prototype moet minimaal deze flow ondersteunen:

1. Klant logt in.
2. Klant komt op het dashboard.
3. Klant start een nieuwe bestelling.
4. Klant kiest een leverdag.
5. Klant ziet of die leverdag open, gesloten of alleen via aanvraag mogelijk is.
6. Klant kiest producten en aantallen.
7. Klant ziet of de bestelling direct geplaatst kan worden of een aanvraag wordt.
8. Klant controleert de bestelling.
9. Klant bevestigt de bestelling of aanvraag.
10. Klant ziet een duidelijke bevestiging mét status.
11. Klant kan terug naar dashboard of bestelgeschiedenis.
12. Klant kan een eerdere bestelling bekijken of herhalen.

---

## Rolverdeling — wie beslist wat

Dit is het belangrijkste deel van deze instructie. Voor het afstudeerproject moet inzichtelijk blijven welke keuzes door de ontwerper (Pepijn) zijn gemaakt en welke door AI. **AI mag geen belangrijke ontwerpkeuzes maken.**

### Pepijn beslist (ontwerper)
- Welke schermen er zijn en hoe ze eruitzien (Figma is de waarheid).
- Visuele hiërarchie, kleuren, typografie, spacing, componentgebruik.
- Inhoud en microcopy.
- Welke functionaliteit in de testflow zit.
- Welke klanttypen en bestelregels worden toegepast en welke randgevallen getest worden.
- Hoe de aanvraaglogica aan de klant wordt uitgelegd.
- Welke dummy-data wordt gebruikt als dit inhoudelijk invloed heeft op de test.

Als Figma iets anders toont dan bestaande HTML: volg Figma of vraag Pepijn.

### Claude mag doen (uitvoerder)
- HTML/CSS/JS schrijven om bestaande Figma-schermen exact na te bouwen.
- Bestaande HTML-bestanden structureren.
- Navigatie tussen bestaande schermen toevoegen en knoppen aan de juiste schermen koppelen, **mits de bestemming uit de bestaande schermen blijkt**.
- Eenvoudige prototype-state toevoegen met JavaScript.
- Realistische dummy-data invullen als Pepijn daarvoor toestemming geeft.
- Kleine bugs oplossen, duplicatie verminderen, bestaande CSS-variabelen en Tailwind-classes hergebruiken.
- Voorstellen doen als iets efficiënter of duidelijker kan — **stel voor, bevestig, dan pas doen.**

### Claude mag NIET doen
- Nieuwe ontwerpkeuzes maken of schermen verzinnen die niet in Figma staan.
- Features toevoegen of visuele stijl (kleuren, typografie, spacing, layout) aanpassen zonder toestemming.
- Bestaande copy herschrijven als die al in Figma staat.
- Aanvraag- of bestelregels zelf interpreteren, of eigen foutmeldingen/microcopy bedenken bij onduidelijke situaties.
- Frameworks of libraries toevoegen buiten de huidige stack.
- Het prototype complexer maken dan nodig voor de test.

Bij twijfel: **vraag, niet aannemen.**

---

## Tech stack & conventies

- **Vanilla HTML/CSS/JS** — geen build step, geen frameworks.
- **Tailwind via CDN** (`https://cdn.tailwindcss.com`).
- **Inter via Google Fonts** + Arial Narrow fallback voor `font-gt-*` classes.
- **Taal:** Nederlands (UI, comments, microcopy).
- **Test-context:** desktop browser. Niet optimaliseren voor mobiel tenzij Pepijn dit vraagt.

### Design tokens
Gebruik bestaande CSS-variabelen en stijlen uit de huidige bestanden. Belangrijke Wolf-kleuren:
- `--stroke: #b5ae9c`
- `--wolf-white: #f9f7f2`
- `--wolf-grey: #1e1e1e`

Gebruik geen nieuwe kleurenset zonder toestemming.

### Bestandsnaamgeving
Volg de bestaande bestandsnaamgeving uit de Figma-export. Als bestaande schermen het patroon `1-{node-id}-{naam}.html` volgen, houd dit aan. Maak geen nieuwe schermbestanden aan zonder dat duidelijk is dat het scherm in Figma bestaat of door Pepijn is gevraagd.

### Figma MCP assets
Schermen verwijzen naar assets via `http://localhost:3845/assets/...` (Figma MCP dev-server). Als assets niet laden:
1. Meld het in de chat.
2. Vraag of de assets lokaal moeten worden opgeslagen of opnieuw via Figma MCP opgehaald.
3. Verzin geen vervangende illustraties, iconen of beelden.

---

## Interactie & navigatie

Het prototype moet klikbaar zijn voor gebruikerstests. De interacties zijn minimaal genoeg om de testflow te doorlopen.

**Navigatie (richtlijn, volg de schermen als die anders aangeven):**
- Login → klantdashboard.
- Dashboard → nieuwe bestelling; dashboard toont ook recente bestellingen / lopende aanvragen.
- Nieuwe bestelling → leverdag kiezen → producten kiezen → bestelling controleren → bevestiging.
- Bevestiging → terug naar dashboard of bestelgeschiedenis.
- Recente bestelling kan worden geopend; herhaal-bestelling start een nieuwe bestelling op basis van eerdere dummy-data.

**Prototype-state.** Eenvoudige state mag met `localStorage`, `sessionStorage` of simpele JS-variabelen, alleen als dit nodig is voor de test. Toegestaan: geselecteerde leverdag, geselecteerde producten, aangepaste aantallen, status "bestelling geplaatst", "aanvraag ingediend", "wacht op beoordeling", laatst herhaalde bestelling. Geen complex state-management.

---

## Belangrijke interacties klantkant

**Leverdag kiezen.** Maak duidelijk of een leverdag beschikbaar is, of de deadline verstreken is, of normaal bestellen nog kan of alleen een aanvraag mogelijk is, en wat de eerstvolgende beschikbare leverdag is. Voor reguliere klanten: gesloten dagen niet actief als normale optie aanbieden. Voor uitzonderingsklanten: een gesloten leverdag mag zichtbaar blijven als "Aanvraag mogelijk", zolang dit binnen de 24-uurs aanvraagperiode valt.

**Producten en aantallen kiezen.** Het prototype hoeft geen echte voorraad of productieplanning te berekenen, maar moet wel de juiste logica tonen: normale aantallen kunnen direct door, aantallen boven een grens kunnen als aanvraag worden behandeld, onmogelijke keuzes worden duidelijk uitgelegd, en de klant begrijpt altijd wat de volgende stap is.

**Bestelling controleren.** In het controlescherm zijn zichtbaar: klant-/bedrijfsnaam, leverdag, gekozen producten, aantallen, ophalen of leveren (als dat onderdeel van de flow is), de status (normale bestelling of aanvraag) en een duidelijke bevestigingsknop.

**Bevestiging.** Na bevestigen maakt het scherm expliciet of de bestelling definitief geplaatst is, of de aanvraag is ingediend maar nog beoordeeld moet worden. Gebruik geen vage tekst als alleen "Bedankt" — de status moet expliciet zijn.

**Herhaal bestelling.** Gebruik de producten en aantallen uit de eerdere bestelling, laat de klant opnieuw een leverdag kiezen en de bestelling controleren, en behandel de bestelling opnieuw volgens de huidige deadline- en aanvraaglogica. Een herhaalbestelling is dus niet automatisch definitief zonder controle.

---

## Dummy data

Gebruik realistische dummy-data die past bij Bakkerij Wolf en B2B-klanten. Voeg geen onnodige extra productgroepen, prijzen of klanttypen toe.

- **Klanten:** Juno, Restaurant Breda, Café Binnenvisser, Hotel V, Coffee Company.
- **Producten:** Klassiek, Klassiek 1200g, Baguette, Burger buns, Brioche.

---

## AI-transparantie — verplicht per sessie

Voor het afstuderen moet AI-gebruik traceerbaar zijn. Bij elke werksessie:

1. **Lees `AI-LOG.md`** voordat je begint.
2. **Voeg aan het eind van de sessie een nieuw blok toe** aan `AI-LOG.md` met: datum + korte sessietitel; wat Pepijn heeft gevraagd; welke Figma-schermen als bron zijn gebruikt; welke bestanden zijn aangepast; welke interacties zijn toegevoegd; welke aannames Claude heeft gemaakt; welke ontwerpkeuzes door Pepijn zijn aangeleverd; welke voorstellen Claude heeft gedaan en welke zijn goedgekeurd of afgewezen; open vragen of beslissingen die Pepijn nog moet maken.

Houd het log kort en feitelijk — het is bewijslast voor het proces, geen marketingtekst.

> Bestaat `AI-LOG.md` nog niet in deze folder, maak het dan bij de eerste sessie aan met het eerste logblok.

---

## Werkproces per opdracht

1. Lees `CLAUDE.md`.
2. Lees `AI-LOG.md`.
3. Lees de relevante HTML-bestanden.
4. Vat in één of twee zinnen samen wat je gaat doen.
5. Vraag bij onduidelijkheid.
6. Voer de opdracht uit.
7. Test of de flow werkt.
8. Update `AI-LOG.md`.

Bij grote opdrachten: maak eerst een korte takenlijst en wacht op akkoord van Pepijn.

---

## Wat een goed klantprototype hier betekent

Een goed prototype volgt het Figma-ontwerp, ziet eruit als Bakkerij Wolf (zelfde stijl, kleuren, typografie), maakt duidelijk wanneer iets een bestelling of aanvraag is, maakt deadlines en leverdagen begrijpelijk, laat de klant zelfstandig door de flow gaan, bevat realistische dummy-data, werkt in een desktop browser zonder console-errors, en bevat geen verzonnen AI-features. Het is simpel genoeg om goed te kunnen testen.

Het prototype is geen eindproduct. Het is een middel om te testen of zakelijke klanten de bestelflow begrijpen.

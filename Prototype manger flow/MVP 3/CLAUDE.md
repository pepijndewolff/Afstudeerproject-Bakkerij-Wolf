# Wolf MVP — Prototype-instructie voor Claude Code

Dit project is een **afstudeerproject**. De HTML-schermen in deze folder zijn gegenereerd vanuit een Figma-ontwerp (via de Figma MCP server). Het doel is om deze schermen uit te werken tot een **klikbaar, testbaar prototype** waarmee de doelgroep getest kan worden in een desktop browser.

Lees dit bestand bij elke sessie. Houd je hier strikt aan.

---

## Project context — Bakkerij Wolf

**Wat het systeem is:** Operationele back-office voor Bakkerij Wolf om de dagelijkse productie- en bestelcyclus te plannen, inkomende bestellingen en aanvragen te beoordelen en bestellingen af te wikkelen tot aan de paklijst.

**Twee portalen, één prototype-scope.** Het volledige systeem heeft twee inlogzijden — een **klanten-portal** (waar zakelijke klanten bestellen) en een **bakkerij-portal** (back-office voor Wolf). **Dit prototype werkt alleen de bakkerij-flow uit.** De huidige login (`1-651-login.html`) is de bakkerij-login; de titel "Bestelportaal" is daarom niet correct en moet hernoemd worden (zie open punten in `AI-LOG.md`).

**Gebruiker in scope: Noor — bakkerij-manager.** Zij doet zowel het orderbeheer als het inpakken zelf. Haar volledige taakflow die het prototype moet ondersteunen, van begin tot eind:

- Inkomende bestellingen en aanvragen bekijken
- Aanvragen beoordelen: goedkeuren of afwijzen, en aantallen aanpassen
- Bestellingen sluiten om 15:00 op de dag vóór de leverdag
- Klantprofielen inzien, wijzigen en nieuwe klanten aanmaken
- Paklijsten bekijken inclusief pakstatussen

**Centrale concepten en regels:**

- **Standaardorder / ingeplande bestelling:** vaste, terugkerende bestelling per klant.
- **Aanvraag:** verzoek buiten het standaardpatroon. Alleen toegestaan voor klanten met de juiste status.
- **Klanttype, instelbaar per klantprofiel door Wolf:**
  - *Reguliere klant* — mag een bestelling plaatsen tot uiterlijk **48 uur** vóór de leverdag.
  - *Uitzonderingsklant* — mag aanvragen indienen tot **24 uur** vóór de leverdag, en mag aanvragen doen **boven de standaard maximum-capaciteit**.
- Het klanttype moet in het klantprofiel aanpasbaar zijn.
- **Sluitmoment:** 15:00 op de dag vóór levering. Na het sluiten worden geen bestellingen of aanvragen meer geaccepteerd en wordt de paklijst automatisch gegenereerd.
- **Capaciteit:** per product is er een bakkerij-totaal (bv. "Brioche 20/20") en een klant-maximum. Beide worden meegewogen bij het beoordelen van een aanvraag.

**Schermen die er nu zijn:**
- `1-651-login.html` — Login (bakkerij; nog te hernoemen)
- `1-23-dashboard.html` — Dashboard
- `1-109-bestellingen.html` — Bestellingen-overzicht per leverdag
- `1-234-beoordelen.html` — Aanvraag beoordelen (detail)
- `1-356-sluiten.html` — Bestellingen sluiten (bevestiging)
- `1-441-paklijst.html` — Paklijst per leverdag
- `1-536-klant.html` — Klantprofiel

**Ontbrekend:**
- Aanvragen-overzichtsscherm (sidebar-item bestaat al, scherm nog niet).

---

## Rolverdeling — wie beslist wat

Dit is het belangrijkste deel van deze instructie. Voor het afstudeerproject moet inzichtelijk zijn welke beslissingen door de ontwerper (Pepijn) zijn genomen en welke door AI. **AI mag geen belangrijke ontwerpkeuzes maken.**

### Pepijn beslist (ontwerper)
- Welke schermen er zijn en hoe ze eruitzien (Figma is de waarheid).
- Visuele hiërarchie, kleuren, typografie, spacing, copy/tekst.
- Welke functionaliteit het prototype moet hebben.
- De flow tussen schermen — als het niet duidelijk is uit de schermen of de Figma, **vraag het**.
- Microcopy, foutmeldingen, lege-staat teksten.
- Wat er gebeurt bij randgevallen die de doelgroep zou kunnen tegenkomen.

### Claude mag doen (uitvoerder)
- HTML/CSS/JS schrijven die de bestaande schermen exact reproduceren.
- Logische interacties toevoegen om schermen aan elkaar te knopen (klik op knop → ga naar scherm X), **mits de bestemming uit de bestaande schermen blijkt**.
- Tailwind classes en bestaande CSS-variabelen hergebruiken.
- Realistische dummy-data invullen die past bij de context (bakkerij, bestellingen, klanten in NL).
- Code refactoren, duplicatie verwijderen, kleine bugfixes.
- Voorstellen doen — maar als voorstel, niet als uitgevoerde keuze. **Stel voor, bevestig, dan pas doen.**

### Claude mag NIET doen
- Nieuwe schermen of features verzinnen die niet in de Figma staan.
- Visueel design aanpassen (kleuren, lettertypes, spacing, layout) zonder expliciete toestemming.
- Eigen interpretatie geven aan onduidelijke flows — vraag in plaats daarvan.
- Microcopy of teksten zelf schrijven als de Figma er al een heeft.
- Bestaande HTML "verbeteren" zonder gevraagd te worden.
- Libraries of frameworks toevoegen buiten de huidige stack.

Bij twijfel: **vraag, niet aannemen**.

---

## Tech stack & conventies

- **Vanilla HTML/CSS/JS** — geen build step, geen frameworks.
- **Tailwind via CDN** (`https://cdn.tailwindcss.com`) — zoals nu al in de bestanden staat.
- **Inter via Google Fonts** + Arial Narrow fallback voor `font-gt-*` classes.
- **Design tokens** staan in CSS-variabelen bovenaan elk bestand:
  - `--stroke: #b5ae9c`
  - `--wolf-white: #f9f7f2`
  - `--wolf-grey: #1e1e1e`
- **Taal:** Nederlands (UI, comments, microcopy).
- **Doelgroep test-context:** desktop browser. Niet optimaliseren voor mobiel tenzij gevraagd.

### Bestandsnaamgeving
De bestaande schermen volgen het patroon `1-{node-id}-{naam}.html`. Houd dit aan voor nieuwe varianten van bestaande schermen. Geen nieuwe schermen aanmaken zonder overleg.

### Figma MCP assets
De schermen verwijzen naar `http://localhost:3845/assets/...` voor SVG/PNG. Dat is de Figma MCP dev-server. Tijdens prototypen kunnen deze stuk zijn — dan:
1. Meld het in de chat.
2. Vraag of de assets lokaal moeten worden gemaakt of via Figma MCP opnieuw opgehaald.
3. Verzin geen vervangende illustraties zelf.

---

## Interactie & navigatie

Het prototype moet klikbaar zijn voor gebruikerstests. Voor navigatie tussen schermen:

- Sidebar-items linken naar het bijbehorende scherm (`Dashboard` → `1-23-dashboard.html`, `Bestellingen` → `1-109-bestellingen.html`, etc.).
- Knoppen die in de Figma een duidelijke vervolg-actie hebben, krijgen een `<a href>` of `onclick` naar het volgende scherm.
- Voor interacties zonder duidelijke bestemming: **eerst vragen**.
- State (geselecteerde rij, gefilterd, ingelogd) mag met simpele JS in `localStorage` of `sessionStorage` — maar alleen als het nodig is voor de test, en met instemming.

JavaScript blijft minimaal: net genoeg om de testflow werkend te krijgen. Geen frameworks, geen complex state-management.

---

## AI-transparantie — verplicht per sessie

Voor het afstuderen moet AI-gebruik traceerbaar zijn. Bij elke werksessie:

1. **Lees `AI-LOG.md`** voordat je begint — zo zie je wat eerder is gedaan.
2. **Voeg aan het eind van de sessie een nieuw blok toe** aan `AI-LOG.md` met:
   - Datum + korte sessietitel.
   - Wat Pepijn heeft gevraagd.
   - Welke bestanden zijn aangepast.
   - Welke aannames Claude heeft gemaakt (en waarom).
   - Welke voorstellen Pepijn heeft goedgekeurd vs. afgewezen.
   - Open vragen of beslissingen die Pepijn nog moet maken.

Houd het log feitelijk en kort — geen marketingtaal. Het is bewijslast, geen verkooppraatje.

---

## Werkproces per opdracht

Volg deze volgorde bij prototyping-opdrachten:

1. **Lees de relevante HTML-schermen** om de huidige staat te begrijpen.
2. **Vat samen** wat je gaat doen voordat je iets schrijft. Eén of twee zinnen.
3. **Vraag bij onduidelijkheid** — flow, copy, gedrag. Geen aannames over design-intentie.
4. **Voer uit** in zo min mogelijk stappen.
5. **Update `AI-LOG.md`** aan het einde van de sessie.

Bij grote opdrachten: maak een korte takenlijst eerst, laat Pepijn die bevestigen, en werk dan af.

---

## Wat een goed prototype hier betekent

Een prototype dat slaagt voor de doelgroep-test:
- Ziet er exact zo uit als de Figma.
- Voelt klikbaar — knoppen reageren, navigatie werkt, er gebeurt iets bij interactie.
- Heeft realistische dummy-data die niet afleidt.
- Werkt in Chrome/Safari/Firefox op desktop zonder console-errors.
- Bevat geen "AI-feel" (geen verzonnen icons, geen ge-paraphraseerde copy, geen extra "nice-to-have" features).

Het prototype is een **gereedschap om gebruikers te observeren**, niet een product. Houd het simpel.

# Opdracht voor Claude Code — MVP 2 klantflow Bakkerij Wolf

Plak deze prompt in Claude Code in de folder `Wolf Klant MVP 1`.

---

Je werkt aan MVP 2 van de **klantflow** van het Bakkerij Wolf-prototype. Lees eerst `CLAUDE.md` en `AI-LOG.md` in deze folder en houd je strikt aan de rolverdeling die daarin staat. Belangrijkste regel: **jij maakt geen nieuwe ontwerpkeuzes.** Pepijn (ontwerper) beslist over schermen, layout, kleur, typografie, spacing en microcopy. Figma is de waarheid.

Deze opdracht komt voort uit een gebruikerstest (klant "Noor"). De flow bleek duidelijk en intuïtief. Er zijn drie concrete verbeterpunten die nu gebouwd mogen worden, plus een paar punten die je **niet** zelf invult maar als voorstel aan Pepijn voorlegt.

## Werkwijze (verplicht)

1. Lees `CLAUDE.md` en `AI-LOG.md`.
2. Lees de relevante bestaande HTML-bestanden voordat je iets wijzigt.
3. Vat per onderdeel in één of twee zinnen samen wat je gaat doen.
4. Bouw alleen de onderdelen onder "Wel bouwen". Voor alles onder "Eerst voorstellen": stel voor en **wacht op akkoord of Figma** voordat je iets bouwt.
5. Hergebruik bestaande CSS-variabelen, Tailwind-classes en componenten. Voeg geen nieuwe kleuren, fonts of libraries toe.
6. Test of de bestaande testflow nog werkt en geen console-errors geeft.
7. Werk `AI-LOG.md` bij met een nieuw sessieblok.

## Wel bouwen (Pepijn heeft de keuze al gemaakt)

### 1. Aanvraag explicieter maken
Een aanvraag moet echt als aanvraag voelen, niet als gegarandeerde bestelling. Maak in de aanvraag-flow expliciet duidelijk dat:
- de bestelling **nog niet definitief** is en eerst door Bakkerij Wolf beoordeeld wordt;
- de gekozen **producten en aantallen pas zeker zijn na beoordeling**;
- het **klantmaximum vervalt** bij een aanvraag, omdat Wolf de aanvraag los beoordeelt.

Gebruik hiervoor de bestaande statussen en microcopy-richting uit `CLAUDE.md` (bijv. "Aanvraag ingediend", "Wacht op beoordeling", "Nog niet definitief", "Wolf beoordeelt of dit nog haalbaar is"). 

**Grens:** verzin geen nieuwe microcopy-teksten als die al in Figma staan. Bestaat de exacte tekst nog niet, gebruik dan letterlijk de voorbeeldteksten uit `CLAUDE.md` en markeer in `AI-LOG.md` dat dit een aanname is die Pepijn nog moet bevestigen. Wijzig de visuele opmaak (kleur/layout) van de statusweergave niet zelf.

### 2. Onderscheid limiet-overschrijding vs deadline-overschrijding
Er moet duidelijk verschil zijn tussen "te laat" en "te veel":
- **Deadline-overschrijding** (bestelling/aanvraag valt buiten de tijdsregels): behoudt de huidige melding/popup buiten de interactieplek. Niet wijzigen.
- **Limiet-overschrijding** (klant is op tijd, maar bestelt boven het toegestane maximum / boven de normale ruimte): toon de waarschuwing **inline, direct bij het betreffende aantal** in plaats van in een los kader buiten de interactieplek.

Bouw de inline-waarschuwing met bestaande stijl-tokens en de bestaande waarschuwingskleur (oranje, zoals nu gebruikt). **Bedenk geen nieuwe regels voor maxima of capaciteit** — gebruik alleen de bestaande logica uit het prototype. De tekst van de inline-waarschuwing: gebruik bestaande copy als die er is; anders een nuchtere variant die aansluit op de bestaande microcopy en die je in `AI-LOG.md` als aanname markeert.

### 3. Duidelijkere bevestiging na plaatsen
De bevestiging na het plaatsen van een bestelling moet expliciet maken dat de bestelling geplaatst is én dat er een kopie per mail is verstuurd. Gebruik deze tekstrichting (door Pepijn aangeleverd):

> Bedankt voor je bestelling. Een kopie van deze bestelling is verstuurd naar …@…nl.

- Vul het mailadres met realistische dummy-data uit de bestaande klantenset (`CLAUDE.md`: Juno, Restaurant Breda, Café Binnenvisser, Hotel V, Coffee Company).
- Houd het onderscheid bestelling vs aanvraag intact: bij een aanvraag mag de bevestiging niet suggereren dat de bestelling definitief is.
- Wijzig alleen de tekst/inhoud van het bestaande bevestigingsscherm. Verander de layout/opmaak niet zonder akkoord.

## Eerst voorstellen — niet zelf bouwen

### A. "Bestelling inzien" (geplaatste bestelling achteraf bekijken)
Noor klikte herhaaldelijk op "Bestelling inzien"; die functie/dit scherm bestaat nog niet in de klantflow. Dit is een **nieuw scherm** en dus een ontwerpkeuze. Bouw het niet zelf. Stel aan Pepijn voor dat dit scherm in Figma aangeleverd of als prototypevariant gevraagd wordt, en noteer het als open vraag in `AI-LOG.md`.

### B. Productuitleg voor nieuwe klanten (beschrijvingen / afbeeldingen)
Uit de test kwam dat nieuwe klanten mogelijk productbeschrijvingen of -afbeeldingen nodig hebben. Dit raakt content en visueel ontwerp. Niet zelf invullen of afbeeldingen verzinnen. Voorleggen aan Pepijn en als open vraag noteren.

### C. Bezorginfo / streeftijd levering
Suggestie uit de test: meer uitleg over bezorging en een indicatie/streeftijd van levering. Dit raakt inhoud en mogelijk nieuwe regels. Niet zelf bedenken; voorstellen en als open vraag noteren.

### D. Factuur opstellen vanuit klantomgeving (nice to have)
Buiten scope van deze test-MVP. Alleen noteren als open punt; niet bouwen.

## Afsluiten
Sluit af met een korte samenvatting in de chat van wat je gebouwd hebt en welke punten je aan Pepijn hebt voorgelegd, en werk `AI-LOG.md` bij volgens de structuur in `CLAUDE.md` (datum + sessietitel, vraag van Pepijn, gebruikte Figma-bronnen, gewijzigde bestanden, toegevoegde interacties, aannames, door Pepijn aangeleverde keuzes, je voorstellen + akkoord/afwijzing, open vragen).

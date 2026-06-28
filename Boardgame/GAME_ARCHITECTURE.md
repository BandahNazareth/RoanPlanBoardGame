# Spelarkitektur

Det här dokumentet beskriver hur projektet ska hållas organiserat när spelet byggs vidare. Syftet är att göra koden enkel att förstå, ändra och utöka utan att blanda ihop data, spelregler, rendering och aktivt game state.

## 1. Projektets mål

Projektet är en webbaserad prototyp för ett hexbaserat brädspel. Målet är att kunna visa en hexagon-karta i webbläsaren, placera entities på kartan, klicka på hexrutor och entities, och visa relevant information i UI:t.

Arkitekturen ska vara enkel och modulär så att nya system kan läggas till stegvis, till exempel movement, combat, multiplayer och sparat game state.

## 2. Nuvarande filstruktur

```text
Boardgame/
  index.html
  style.css
  main.js
  data/
    tokens.js
    commanders.js
    heroes.js
    rules.js
    strongholds.js
    terrain.js
    units.js
  systems/
    engine.js
    gameState.js
    hexGrid.js
    movement.js
    multiplayer.js
    renderer.js
```

`index.html`, `style.css` och `main.js` är projektets startpunkt. Data ligger i `data/`. Spelmotor, game state, kartlogik och rendering ligger i `systems/`.

## 3. Teknikval

Projektet använder vanilla HTML, CSS och JavaScript.

Inga frameworks ska användas i nuläget:

- Ingen React, Vue, Svelte eller liknande.
- Ingen build step krävs.
- JavaScript-moduler används direkt i webbläsaren med `type="module"`.

## 4. Datafiler

Spelets statiska definitioner ska ligga i `data/`-filer.

Exempel på statisk data:

- Entity-definitioner
- Unit-definitioner
- Hero-definitioner
- Terrain-definitioner
- Regeldata och rule documents
- Stronghold-definitioner

Datafiler ska beskriva vad något är, inte vad som händer just nu i en aktiv spelomgång.

`data/tokens.js` innehåller just nu entity definitions. Definitionerna kan representera typer som `unit`, `hero`, `stronghold` och `terrain`.

Regelkort eller större regeltexter ska inte vara entities. De ska behandlas som separata rule documents/cards, till exempel i `data/rules.js` eller `data/ruleDocuments.js`.

## 5. Game State

Aktivt game state ska vara JSON-baserat eller enkelt kunna exporteras som JSON.

Game state beskriver till exempel:

- Vilka entities som finns på kartan
- Var varje entity står
- Vems tur det är
- Vilka resurser, effekter och statusar som är aktiva
- Vilken hex eller entity som är vald

Statiska definitioner från `data/` ska kombineras med aktivt game state. Exempel: `tokens.js` kan definiera en entity-typ, medan game state beskriver att en viss instans av definitionen står på hex `0,0`.

En entity i game state ska minst ha:

- `id`
- `definitionId`
- `type`
- `ownerId`
- `position { q, r }`

## 6. Engine

`systems/engine.js` är spelmotor/controller för prototypen.

All mutering av game state ska gå via engine-funktioner, till exempel:

- `selectHex(q, r)`
- `selectEntity(entityId)`
- `moveEntity(entityId, q, r)`

Ingen multiplayer, stridslogik eller avancerad regelmotor krävs ännu. När sådan logik läggs till ska den ligga i engine eller separata systemfiler, inte i renderer.

## 7. Renderer-regler

Inga spelregler ska hårdkodas i `systems/renderer.js`.

`renderer.js` ska endast ansvara för:

- Visuell rendering
- Att skapa och uppdatera DOM/SVG
- Att visa aktuell UI-information
- Att koppla UI-händelser vidare till callbacks, till exempel `onHexClick` och `onEntityClick`

Renderer får aldrig ändra game state direkt. Renderer får bara läsa state och skicka användarhändelser vidare till engine/controller.

`renderer.js` ska inte avgöra om ett drag är giltigt, hur långt en entity får röra sig, vem som vinner en strid eller hur regler tolkas. Sådan logik ska ligga i engine eller separata systemfiler.

## 8. HexGrid-ansvar

`systems/hexGrid.js` ansvarar för hex-koordinater, placering och kartlogik.

Exempel på ansvar:

- Skapa hexrutor
- Hantera axial- eller cube-koordinater
- Räkna ut pixelpositioner för hexar
- Räkna ut hexhörn för rendering
- Hitta grannar
- Mäta avstånd mellan hexar
- Hantera kartrelaterade hjälpfunktioner

Rendering kan använda resultat från `hexGrid.js`, men själva kunskapen om hex-koordinater ska ligga i `hexGrid.js`.

## 9. Praktisk regel framåt

När ny funktionalitet läggs till:

1. Lägg statiska definitioner i `data/`.
2. Lägg aktivt game state i `systems/gameState.js`.
3. Lägg game state-mutering i `systems/engine.js`.
4. Lägg spel- och kartlogik i tydliga moduler under `systems/`.
5. Låt `renderer.js` rita det den får in och skicka klick vidare.
6. Håll aktivt game state separat från definitioner.
7. Undvik att lägga spelregler direkt i UI-koden.

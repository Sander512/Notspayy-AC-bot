# NotSpayys Bot

Een altijd-online Discord-bot: welkomstberichten, support-tickets,
serverregels, en 26 slash-commands. **Werkt op elke Discord-server die de
bot toevoegt** — elke server configureert zichzelf met `/setwelcome`,
`/setsupport`, `/setrules` en `/link`, volledig los van elkaar.

**Belangrijk:** dit is een *persistente* bot — hij moet continu blijven
draaien (in tegenstelling tot de API, die serverless op Vercel draait).
Dat betekent dat hij **niet** op Vercel kan draaien; hij heeft een eigen
always-on plek nodig zoals Render.

## Installatie

```bash
cd bot
npm install
cp .env.example .env
```

Vul in `.env`:
- `DISCORD_BOT_TOKEN` — Developer Portal → jouw applicatie → **Bot** → Reset Token
- `DISCORD_CLIENT_ID` — Developer Portal → **OAuth2 → General** → Client ID (zelfde als de API gebruikt)
- `NOTSPAYYS_API_URL` — je website-URL (voor `/license`, `/link`, en alle instellingen)
- `BOT_API_SECRET` — zelfde waarde als in de API's environment variables

Welkomstkanaal, ticket-categorie, staff-rol en serverregels stel je **niet**
meer in `.env` in — elke Discord-server die de bot toevoegt regelt dat zelf
met `/setwelcome`, `/setsupport` en `/setrules`. Zie "Zelfbediening" onderaan.

**Zorg dat de bot op je server staat** met de juiste permissies:
1. Developer Portal → **OAuth2 → URL Generator**.
2. Scopes: `bot` en `applications.commands`.
3. Bot-permissies: **Kick Members**, **Ban Members**, **Moderate Members**,
   **Manage Messages**, **Manage Channels**, **Manage Roles**, **Send
   Messages**, **View Channels**, **Read Message History**.
4. Open de gegenereerde link, kies je server. **Dit werkt voor elke server**
   — niet alleen die van jou.

**Zet aan de Discord-kant ook de "Server Members Intent" aan:**
Developer Portal → jouw applicatie → **Bot** → onder "Privileged Gateway
Intents" → zet **Server Members Intent** aan. Zonder dit werkt het
welkomstbericht niet (de bot krijgt dan geen `guildMemberAdd`-events).

## Slash-commands registreren

Eenmalig (en na elke wijziging aan een command):
```bash
npm run deploy-commands
```
Dit registreert de commando's **globaal** (niet voor één specifieke
server), zodat ze werken op elke server waar de bot lid van wordt. Kan tot
~1 uur duren voor ze overal zichtbaar zijn na de eerste keer.

## Zelfbediening — elke server regelt zichzelf

Nadat de bot is toegevoegd, configureert elke server-admin zijn eigen
server met commando's (vereist de "Server beheren"-permissie in Discord):
- `/setwelcome kanaal:#welkom bericht:"Welkom {user}!" aan:true`
- `/setsupport categorie:Tickets staffrol:@Staff aan:true`
- `/setrules tekst:"1. Wees respectvol..."`
- `/link key:NSP-FREE-XXXX-XXXX-XXXX` — koppelt aan hun NotSpayys-server voor `/detections`, `/bans`, `/acstats`

Instellingen zijn ook via `/owner` → tabblad **Bot** te beheren (vul het
Discord Server-ID in om een specifieke server te laden/bewerken).

## Starten

```bash
npm start
```

Zie je in de console `Ingelogd als ... — online en klaar.`? Dan werkt de bot.

## Welkomstbericht, support-tickets en regels aanpassen

Deze staan **niet** meer in `.env` — stel ze in via `/owner` → tabblad
**Bot** op je website. De bot haalt ze elke minuut automatisch opnieuw op.

## Statuspagina (nodig voor Render)

De bot start ook een kleine webserver (via `statusServer.js`) op
`process.env.PORT`. Dit is nodig omdat Render's **Web Service**-type
vereist dat er iets op een poort luistert — zonder dit ziet Render de
deploy als "ongezond". Open de URL die Render je geeft in de browser en je
ziet een statuspagina met bot-naam, servernaam, ledenaantal, uptime en
ping. `/health` geeft hetzelfde in JSON-vorm terug.

## Waar laat ik dit draaien? (24/7 hosting)

Vercel kan dit niet hosten (serverless functions blijven niet continu
draaien — precies wat een Discord-bot wél nodig heeft). Opties, van
makkelijkst naar goedkoopst:

1. **Dezelfde machine als je FiveM-server** — als dat een eigen VPS/dedicated
   server is (niet enkel een game-panel zonder shell-toegang), is dit de
   simpelste optie: geen extra kosten, en de machine draait toch al 24/7.
   Installeer Node.js, zet deze map erop, en start de bot met een
   process-manager zodat hij automatisch herstart bij een crash of reboot:
   ```bash
   npm install -g pm2
   pm2 start index.js --name notspayys-bot
   pm2 save
   pm2 startup   # volg de instructie die dit commando teruggeeft
   ```
2. **Een kleine eigen VPS** (bv. Oracle Cloud's gratis tier, of een
   goedkope VPS van €3-5/maand) — zelfde pm2-aanpak als hierboven.
3. **Railway** — werkt met minimale moeite (`railway up`), maar de gratis
   laag is een eenmalig krediet, geen permanent gratis tier.

Heb je geen VPS en wil je er geen apart geld aan uitgeven — dan is optie 1
(meeliften op je bestaande FiveM-server, als die een eigen VPS is) verreweg
de praktischste keuze.

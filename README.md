# NotSpayys Bot

Een altijd-online Discord-bot: welkomstberichten bij nieuwe leden, een
support-ticketsysteem, serverregels, en een reeks slash-commands
(`/ping`, `/support`, `/close`, `/license`, `/serverinfo`, `/userinfo`,
`/avatar`, `/uptime`, `/invite`, `/rules`, `/announce`). Draait als Render
Web Service dankzij een ingebouwde statuspagina (zie onderaan).

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
- `DISCORD_GUILD_ID` — rechtsklik je servernaam in Discord → ID kopiëren
- `WELCOME_CHANNEL_ID` — rechtsklik het kanaal waar welkomstberichten moeten komen → ID kopiëren
- `SUPPORT_CATEGORY_ID` — rechtsklik de categorie waaronder ticket-kanalen moeten komen → ID kopiëren
- `SUPPORT_STAFF_ROLE_ID` — de staff-rol die automatisch in elk ticket komt
- `NOTSPAYYS_API_URL` — je website- of API-URL (voor `/license`)

**Zorg dat de bot op je server staat** met de juiste permissies:
1. Developer Portal → **OAuth2 → URL Generator**.
2. Scopes: `bot` en `applications.commands`.
3. Bot-permissies: **Manage Channels**, **Send Messages**, **View Channels**,
   **Manage Roles** (voor de ticket-permissies), **Read Message History**.
4. Open de gegenereerde link, kies je server.

**Zet aan de Discord-kant ook de "Server Members Intent" aan:**
Developer Portal → jouw applicatie → **Bot** → onder "Privileged Gateway
Intents" → zet **Server Members Intent** aan. Zonder dit werkt het
welkomstbericht niet (de bot krijgt dan geen `guildMemberAdd`-events).

## Slash-commands registreren

Eenmalig (en na elke wijziging aan een command):
```bash
npm run deploy-commands
```

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

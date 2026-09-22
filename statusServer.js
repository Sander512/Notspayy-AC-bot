const express = require('express');

/**
 * Simpele status-webserver. Twee redenen om dit te hebben:
 * 1. Render's "Web Service"-type vereist dat er iets op process.env.PORT
 *    luistert en op HTTP-requests reageert — zonder dit ziet Render de
 *    deploy als ongezond.
 * 2. Handige plek om in één oogopslag te zien of de bot echt online is,
 *    met welke server hij verbonden is, en hoe lang al.
 */
function startStatusServer(client) {
    const app = express();
    const startedAt = Date.now();

    app.get('/', (req, res) => {
        const guild = client.guilds.cache.first();
        const uptimeMs = Date.now() - startedAt;
        const uptimeStr = formatUptime(uptimeMs);
        const online = client.isReady();

        res.type('html').send(renderPage({
            online,
            botTag: client.user?.tag || 'Onbekend',
            guildName: guild?.name || 'Niet verbonden',
            memberCount: guild?.memberCount ?? '—',
            uptimeStr,
            ping: Math.round(client.ws.ping),
        }));
    });

    app.get('/health', (req, res) => {
        res.json({ status: client.isReady() ? 'ok' : 'starting' });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`[status] Statuspagina bereikbaar op poort ${port}`);
    });
}

function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}u ${minutes}m`;
    if (hours > 0) return `${hours}u ${minutes}m`;
    return `${minutes}m`;
}

function renderPage({ online, botTag, guildName, memberCount, uptimeStr, ping }) {
    return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>NotSpayys Bot — Status</title>
<style>
  :root {
    --bg: #0A0D12; --panel: #131820; --border: #232B36;
    --text: #E7ECF0; --text-dim: #8590A0;
    --green: #4FE3A8; --red: #FF6A5C;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); color: var(--text);
    font-family: -apple-system, 'Segoe UI', sans-serif;
  }
  .card { border: 1px solid var(--border); background: var(--panel); border-radius: 6px; padding: 32px 36px; min-width: 320px; }
  .status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: ${online ? 'var(--green)' : 'var(--red)'}; box-shadow: 0 0 8px ${online ? 'var(--green)' : 'var(--red)'}; }
  h1 { font-size: 1.1rem; margin: 0; }
  .rows { font-family: 'SFMono-Regular', Menlo, monospace; font-size: 0.85rem; color: var(--text-dim); line-height: 2; }
  .rows b { color: var(--text); font-weight: 500; }
</style>
</head>
<body>
  <div class="card">
    <div class="status-row">
      <span class="dot"></span>
      <h1>${online ? 'Online' : 'Verbinden...'}</h1>
    </div>
    <div class="rows">
      Bot: <b>${botTag}</b><br/>
      Server: <b>${guildName}</b> (${memberCount} leden)<br/>
      Uptime: <b>${uptimeStr}</b><br/>
      Ping: <b>${ping}ms</b>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { startStatusServer };

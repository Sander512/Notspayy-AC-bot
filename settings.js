// Haalt de bot-instellingen per Discord-server (guild) op bij de API.
// Elke server heeft zijn eigen rij -- geen gedeelde instellingen meer
// tussen verschillende klanten die deze bot gebruiken.

const cache = new Map(); // guildId -> { settings, lastFetch }
const REFRESH_MS = 60 * 1000;

async function fetchSettings(guildId) {
    const apiUrl = process.env.NOTSPAYYS_API_URL;
    const secret = process.env.BOT_API_SECRET;

    if (!apiUrl || !secret) {
        console.warn('[settings] NOTSPAYYS_API_URL of BOT_API_SECRET ontbreekt.');
        return null;
    }

    try {
        const res = await fetch(`${apiUrl}/bot-settings?guildId=${guildId}`, {
            headers: { Authorization: `Bearer ${secret}` },
        });
        if (!res.ok) {
            console.error(`[settings] ophalen mislukt voor guild ${guildId}: HTTP ${res.status}`);
            return cache.get(guildId)?.settings || null;
        }
        const data = await res.json();
        return data.settings;
    } catch (err) {
        console.error(`[settings] netwerkfout voor guild ${guildId}:`, err.message);
        return cache.get(guildId)?.settings || null;
    }
}

/** Geeft de gecachete instellingen van één specifieke server terug. */
async function getSettings(guildId) {
    const entry = cache.get(guildId);
    const now = Date.now();

    if (!entry || now - entry.lastFetch > REFRESH_MS) {
        const settings = await fetchSettings(guildId);
        cache.set(guildId, { settings, lastFetch: now });
        return settings || {};
    }
    return entry.settings || {};
}

/** Forceert een directe herlaad voor één server (bv. meteen na /link). */
async function refreshNow(guildId) {
    const settings = await fetchSettings(guildId);
    cache.set(guildId, { settings, lastFetch: Date.now() });
    return settings;
}

module.exports = { getSettings, refreshNow };

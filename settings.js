// Haalt de bot-instellingen (welkomstbericht, ticket-config) op bij de API,
// zodat ze vanuit het Owner Panel op de website aan te passen zijn zonder
// de bot opnieuw te hoeven starten.

let cache = null;
let lastFetch = 0;
const REFRESH_MS = 60 * 1000; // elke minuut verversen

async function fetchSettings() {
    const apiUrl = process.env.NOTSPAYYS_API_URL;
    const secret = process.env.BOT_API_SECRET;

    if (!apiUrl || !secret) {
        console.warn('[settings] NOTSPAYYS_API_URL of BOT_API_SECRET ontbreekt — bot-instellingen kunnen niet opgehaald worden.');
        return null;
    }

    try {
        const res = await fetch(`${apiUrl}/bot-settings`, {
            headers: { Authorization: `Bearer ${secret}` },
        });
        if (!res.ok) {
            console.error(`[settings] ophalen mislukt: HTTP ${res.status}`);
            return cache; // val terug op de laatst bekende waarden i.p.v. alles uit te zetten
        }
        const data = await res.json();
        return data.settings;
    } catch (err) {
        console.error('[settings] netwerkfout bij ophalen:', err.message);
        return cache;
    }
}

/** Geeft de gecachete instellingen terug, ververst ze op de achtergrond als ze verlopen zijn. */
async function getSettings() {
    const now = Date.now();
    if (!cache || now - lastFetch > REFRESH_MS) {
        cache = await fetchSettings();
        lastFetch = now;
    }
    return cache || {};
}

/** Forceert een directe herlaad, los van de normale ververs-cyclus. */
async function refreshNow() {
    cache = await fetchSettings();
    lastFetch = Date.now();
    return cache;
}

module.exports = { getSettings, refreshNow };

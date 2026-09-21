module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`[bot] Ingelogd als ${client.user.tag} — online en klaar.`);
        client.user.setPresence({
            status: 'online',
            activities: [{ name: 'je server in de gaten', type: 3 }], // 3 = Watching
        });
    },
};

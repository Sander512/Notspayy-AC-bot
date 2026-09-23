const { PermissionsBitField } = require('discord.js');
const { refreshNow } = require('../settings');

module.exports = {
    name: 'link',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Server beheren"-permissie nodig.', ephemeral: true });
        }

        const key = interaction.options.getString('key');
        const apiUrl = process.env.NOTSPAYYS_API_URL;
        const secret = process.env.BOT_API_SECRET;

        if (!apiUrl || !secret) {
            return interaction.reply({ content: 'Deze functie is nog niet ingesteld.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const res = await fetch(`${apiUrl}/bot-data/link`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseKey: key, guildId: interaction.guildId }),
            });

            if (res.status === 404) return interaction.editReply('Geen actieve license gevonden met deze key.');
            if (!res.ok) return interaction.editReply('Koppelen mislukt, probeer het later opnieuw.');

            const { server } = await res.json();
            await refreshNow(interaction.guildId);
            await interaction.editReply(`Deze Discord-server is nu gekoppeld aan **${server.name}**. \`/detections\`, \`/bans\` en \`/acstats\` werken vanaf nu.`);
        } catch (err) {
            console.error('[link] fout:', err.message);
            await interaction.editReply('Er ging iets mis bij het koppelen.');
        }
    },
};

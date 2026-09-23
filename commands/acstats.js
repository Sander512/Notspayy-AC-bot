const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'acstats',
    async execute(interaction) {
        const apiUrl = process.env.NOTSPAYYS_API_URL;
        const secret = process.env.BOT_API_SECRET;
        if (!apiUrl || !secret) return interaction.reply({ content: 'Nog niet ingesteld.', ephemeral: true });

        await interaction.deferReply();

        try {
            const res = await fetch(`${apiUrl}/bot-data/stats?guildId=${interaction.guildId}`, {
                headers: { Authorization: `Bearer ${secret}` },
            });

            if (res.status === 400) return interaction.editReply('Deze server is nog niet gekoppeld — gebruik eerst `/link <license-key>`.');
            if (!res.ok) return interaction.editReply('Kon statistieken niet ophalen.');

            const data = await res.json();
            const embed = new EmbedBuilder()
                .setTitle(`NotSpayys — ${data.server.name}`)
                .setColor(data.server.is_online ? 0x4FE3A8 : 0x8590A0)
                .addFields(
                    { name: 'Status', value: data.server.is_online ? '🟢 Online' : '⚪ Offline', inline: true },
                    { name: 'Detecties (24u)', value: String(data.detectionsLast24h), inline: true },
                    { name: 'Actieve bans', value: String(data.activeBans), inline: true },
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[acstats] fout:', err.message);
            await interaction.editReply('Er ging iets mis.');
        }
    },
};

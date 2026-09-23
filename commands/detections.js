const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'detections',
    async execute(interaction) {
        const apiUrl = process.env.NOTSPAYYS_API_URL;
        const secret = process.env.BOT_API_SECRET;
        if (!apiUrl || !secret) return interaction.reply({ content: 'Nog niet ingesteld.', ephemeral: true });

        await interaction.deferReply();

        try {
            const res = await fetch(`${apiUrl}/bot-data/detections?guildId=${interaction.guildId}`, {
                headers: { Authorization: `Bearer ${secret}` },
            });

            if (res.status === 400) return interaction.editReply('Deze server is nog niet gekoppeld — gebruik eerst `/link <license-key>`.');
            if (!res.ok) return interaction.editReply('Kon detecties niet ophalen.');

            const { server, detections } = await res.json();

            if (detections.length === 0) {
                return interaction.editReply(`Geen recente detecties voor **${server.name}**.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Recente detecties — ${server.name}`)
                .setColor(0xFF6A5C)
                .setDescription(detections.map((d) =>
                    `**${d.detection_key}** — ${d.player_name || 'onbekend'} — ${d.confidence}% (${d.state}) — actie: ${d.action_taken}`
                ).join('\n'));

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[detections] fout:', err.message);
            await interaction.editReply('Er ging iets mis.');
        }
    },
};

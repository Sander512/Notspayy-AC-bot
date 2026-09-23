const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'bans',
    async execute(interaction) {
        const apiUrl = process.env.NOTSPAYYS_API_URL;
        const secret = process.env.BOT_API_SECRET;
        if (!apiUrl || !secret) return interaction.reply({ content: 'Nog niet ingesteld.', ephemeral: true });

        await interaction.deferReply();

        try {
            const res = await fetch(`${apiUrl}/bot-data/bans?guildId=${interaction.guildId}`, {
                headers: { Authorization: `Bearer ${secret}` },
            });

            if (res.status === 400) return interaction.editReply('Deze server is nog niet gekoppeld — gebruik eerst `/link <license-key>`.');
            if (!res.ok) return interaction.editReply('Kon bans niet ophalen.');

            const { server, bans } = await res.json();

            if (bans.length === 0) {
                return interaction.editReply(`Geen actieve bans voor **${server.name}**.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Actieve bans — ${server.name}`)
                .setColor(0xFF6A5C)
                .setDescription(bans.map((b) =>
                    `**${b.player_name || 'onbekend'}** — ${b.ban_type} — ${b.reason}`
                ).join('\n'));

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[bans] fout:', err.message);
            await interaction.editReply('Er ging iets mis.');
        }
    },
};

const { PermissionsBitField } = require('discord.js');
const { refreshNow } = require('../settings');

module.exports = {
    name: 'setwelcome',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Server beheren"-permissie nodig.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('kanaal');
        const message = interaction.options.getString('bericht');
        const enabled = interaction.options.getBoolean('aan') ?? true;

        const apiUrl = process.env.NOTSPAYYS_API_URL;
        const secret = process.env.BOT_API_SECRET;
        if (!apiUrl || !secret) return interaction.reply({ content: 'Nog niet ingesteld.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        try {
            const res = await fetch(`${apiUrl}/bot-settings?guildId=${interaction.guildId}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    welcomeEnabled: enabled,
                    welcomeChannelId: channel ? channel.id : undefined,
                    welcomeMessage: message || undefined,
                }),
            });

            if (!res.ok) return interaction.editReply('Instellen mislukt, probeer het later opnieuw.');

            await refreshNow(interaction.guildId);
            await interaction.editReply(`Welkomstbericht ${enabled ? 'ingesteld' : 'uitgezet'}.${channel ? ` Kanaal: ${channel}.` : ''}`);
        } catch (err) {
            console.error('[setwelcome] fout:', err.message);
            await interaction.editReply('Er ging iets mis.');
        }
    },
};

const { PermissionsBitField } = require('discord.js');
const { refreshNow } = require('../settings');

module.exports = {
    name: 'setsupport',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Server beheren"-permissie nodig.', ephemeral: true });
        }

        const category = interaction.options.getChannel('categorie');
        const role = interaction.options.getRole('staffrol');
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
                    supportEnabled: enabled,
                    supportCategoryId: category ? category.id : undefined,
                    supportStaffRoleId: role ? role.id : undefined,
                }),
            });

            if (!res.ok) return interaction.editReply('Instellen mislukt, probeer het later opnieuw.');

            await refreshNow(interaction.guildId);
            await interaction.editReply(`Support-tickets ${enabled ? 'ingesteld' : 'uitgezet'}.`);
        } catch (err) {
            console.error('[setsupport] fout:', err.message);
            await interaction.editReply('Er ging iets mis.');
        }
    },
};

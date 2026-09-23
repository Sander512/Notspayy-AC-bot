const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Berichten beheren"-permissie nodig.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('aantal');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Kies een aantal tussen 1 en 100 (Discord-limiet voor bulk-verwijderen).', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });
        const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);

        if (!deleted) {
            return interaction.editReply('Kon geen berichten verwijderen (berichten ouder dan 14 dagen kunnen niet in bulk verwijderd worden).');
        }
        await interaction.editReply(`${deleted.size} berichten verwijderd.`);
    },
};

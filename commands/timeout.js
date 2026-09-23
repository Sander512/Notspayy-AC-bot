const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'timeout',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Leden modereren"-permissie nodig.', ephemeral: true });
        }

        const target = interaction.options.getMember('gebruiker');
        const minutes = interaction.options.getInteger('minuten');
        const reason = interaction.options.getString('reden') || 'Geen reden opgegeven';

        if (!target) return interaction.reply({ content: 'Deze gebruiker is niet gevonden op deze server.', ephemeral: true });
        if (!target.moderatable) return interaction.reply({ content: 'Ik kan deze gebruiker niet timeouten.', ephemeral: true });
        if (minutes < 1 || minutes > 40320) return interaction.reply({ content: 'Kies tussen 1 en 40320 minuten (max 28 dagen).', ephemeral: true });

        await target.timeout(minutes * 60 * 1000, reason);
        await interaction.reply(`${target.user.tag} heeft een timeout van ${minutes} minuten. Reden: ${reason}`);
    },
};

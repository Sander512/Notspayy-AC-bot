const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Leden verwijderen"-permissie nodig.', ephemeral: true });
        }

        const target = interaction.options.getMember('gebruiker');
        const reason = interaction.options.getString('reden') || 'Geen reden opgegeven';

        if (!target) return interaction.reply({ content: 'Deze gebruiker is niet gevonden op deze server.', ephemeral: true });
        if (!target.kickable) return interaction.reply({ content: 'Ik kan deze gebruiker niet kicken (hogere rol dan ik, of server-eigenaar).', ephemeral: true });

        await target.kick(reason);
        await interaction.reply(`${target.user.tag} is gekickt. Reden: ${reason}`);
    },
};

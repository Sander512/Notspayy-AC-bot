const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Leden verbannen"-permissie nodig.', ephemeral: true });
        }

        const target = interaction.options.getMember('gebruiker');
        const reason = interaction.options.getString('reden') || 'Geen reden opgegeven';

        if (!target) return interaction.reply({ content: 'Deze gebruiker is niet gevonden op deze server.', ephemeral: true });
        if (!target.bannable) return interaction.reply({ content: 'Ik kan deze gebruiker niet bannen (hogere rol dan ik, of server-eigenaar).', ephemeral: true });

        await target.ban({ reason });
        await interaction.reply(`${target.user.tag} is gebanned. Reden: ${reason}`);
    },
};

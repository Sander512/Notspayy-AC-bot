const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'announce',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'Hiervoor heb je de "Server beheren"-permissie nodig.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('kanaal');
        const message = interaction.options.getString('bericht');

        if (!channel.isTextBased()) {
            return interaction.reply({ content: 'Kies een tekstkanaal.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setDescription(message)
            .setColor(0x4FE3A8)
            .setFooter({ text: `Aankondiging door ${interaction.user.tag}` })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: `Aankondiging geplaatst in ${channel}.`, ephemeral: true });
    },
};

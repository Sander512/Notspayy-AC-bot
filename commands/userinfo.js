const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    async execute(interaction) {
        const target = interaction.options.getUser('gebruiker') || interaction.user;
        const member = interaction.guild.members.cache.get(target.id);

        const embed = new EmbedBuilder()
            .setTitle(target.tag)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0x5B9DFF)
            .addFields(
                { name: 'Account aangemaakt', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Lid geworden', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Onbekend', inline: true },
                { name: 'Rollen', value: member ? (member.roles.cache.size - 1) + '' : '0', inline: true },
            );

        await interaction.reply({ embeds: [embed] });
    },
};

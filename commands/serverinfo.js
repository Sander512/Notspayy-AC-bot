const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner().catch(() => null);

        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL() || null)
            .setColor(0x4FE3A8)
            .addFields(
                { name: 'Eigenaar', value: owner ? owner.user.tag : 'Onbekend', inline: true },
                { name: 'Leden', value: String(guild.memberCount), inline: true },
                { name: 'Boost-niveau', value: `Level ${guild.premiumTier}`, inline: true },
                { name: 'Kanalen', value: String(guild.channels.cache.size), inline: true },
                { name: 'Rollen', value: String(guild.roles.cache.size), inline: true },
                { name: 'Aangemaakt op', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
            );

        await interaction.reply({ embeds: [embed] });
    },
};

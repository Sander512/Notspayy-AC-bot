const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    async execute(interaction) {
        const target = interaction.options.getUser('gebruiker') || interaction.user;

        const embed = new EmbedBuilder()
            .setTitle(`Avatar van ${target.tag}`)
            .setImage(target.displayAvatarURL({ size: 512 }))
            .setColor(0x5B9DFF);

        await interaction.reply({ embeds: [embed] });
    },
};

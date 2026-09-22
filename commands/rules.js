const { EmbedBuilder } = require('discord.js');
const { getSettings } = require('../settings');

module.exports = {
    name: 'rules',
    async execute(interaction) {
        const settings = await getSettings();

        const embed = new EmbedBuilder()
            .setTitle('Serverregels')
            .setDescription(settings.rules_message || 'De serverregels zijn nog niet ingesteld.')
            .setColor(0x5B9DFF);

        await interaction.reply({ embeds: [embed] });
    },
};

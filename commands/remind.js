module.exports = {
    name: 'remind',
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minuten');
        const message = interaction.options.getString('bericht');

        if (minutes < 1 || minutes > 1440) {
            return interaction.reply({ content: 'Kies tussen 1 en 1440 minuten (max 24 uur).', ephemeral: true });
        }

        await interaction.reply(`Oké, ik herinner je hieraan over ${minutes} minuten.`);

        setTimeout(() => {
            interaction.channel.send(`⏰ ${interaction.user}, herinnering: ${message}`).catch(() => {});
        }, minutes * 60 * 1000);
    },
};

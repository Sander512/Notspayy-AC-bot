async function closeChannel(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'Dit is geen ticket-kanaal.', ephemeral: true });
    }

    await interaction.reply('Dit ticket wordt over 5 seconden gesloten...');
    setTimeout(() => {
        channel.delete().catch((err) => console.error('[close] kon kanaal niet verwijderen:', err.message));
    }, 5000);
}

module.exports = {
    name: 'close',
    closeChannel,
    async execute(interaction) {
        await closeChannel(interaction);
    },
};

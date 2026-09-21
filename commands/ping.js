module.exports = {
    name: 'ping',
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pingen...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! Botlatency: ${latency}ms. API-latency: ${Math.round(interaction.client.ws.ping)}ms.`);
    },
};

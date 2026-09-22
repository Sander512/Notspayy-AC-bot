module.exports = {
    name: 'uptime',
    async execute(interaction) {
        const totalSeconds = Math.floor(interaction.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}u`);
        parts.push(`${minutes}m`);

        await interaction.reply(`Online sinds: ${parts.join(' ')} (ping: ${Math.round(interaction.client.ws.ping)}ms)`);
    },
};

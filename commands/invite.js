module.exports = {
    name: 'invite',
    async execute(interaction) {
        const link = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;
        await interaction.reply({ content: `Nodig de bot uit op een andere server: ${link}`, ephemeral: true });
    },
};

module.exports = {
    name: 'coinflip',
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Kop' : 'Munt';
        await interaction.reply(`🪙 ${result}!`);
    },
};

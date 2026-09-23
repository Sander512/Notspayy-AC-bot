const ANSWERS = [
    'Ja, absoluut.', 'Nee, echt niet.', 'Zeker weten.', 'Twijfelachtig.',
    'Vraag het later opnieuw.', 'Reken er niet op.', 'Zeer waarschijnlijk.',
    'Mijn antwoord is nee.', 'Zonder twijfel.', 'De vooruitzichten zijn goed.',
];

module.exports = {
    name: '8ball',
    async execute(interaction) {
        const question = interaction.options.getString('vraag');
        const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        await interaction.reply(`🎱 **${question}**\n${answer}`);
    },
};

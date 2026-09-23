const { EmbedBuilder } = require('discord.js');

const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

module.exports = {
    name: 'poll',
    async execute(interaction) {
        const question = interaction.options.getString('vraag');
        const options = [
            interaction.options.getString('optie1'),
            interaction.options.getString('optie2'),
            interaction.options.getString('optie3'),
            interaction.options.getString('optie4'),
            interaction.options.getString('optie5'),
        ].filter(Boolean);

        const embed = new EmbedBuilder()
            .setTitle(question)
            .setColor(0x5B9DFF)
            .setDescription(options.map((opt, i) => `${NUMBER_EMOJIS[i]} ${opt}`).join('\n'))
            .setFooter({ text: `Poll gestart door ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
        const message = await interaction.fetchReply();
        for (let i = 0; i < options.length; i++) {
            await message.react(NUMBER_EMOJIS[i]);
        }
    },
};

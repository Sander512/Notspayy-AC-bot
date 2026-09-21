module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(`[command:${interaction.commandName}] fout:`, err);
                const payload = { content: 'Er ging iets mis bij het uitvoeren van dit commando.', ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(payload).catch(() => {});
                } else {
                    await interaction.reply(payload).catch(() => {});
                }
            }
            return;
        }

        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            const closeCommand = client.commands.get('close');
            if (closeCommand?.closeChannel) {
                await closeCommand.closeChannel(interaction);
            }
        }
    },
};

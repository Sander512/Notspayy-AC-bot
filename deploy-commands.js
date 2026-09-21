// Eenmalig (en na elke wijziging aan een command) uitvoeren:
//   npm run deploy-commands
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check of de bot online en responsief is.'),

    new SlashCommandBuilder()
        .setName('support')
        .setDescription('Open een privé support-ticket met de staff.'),

    new SlashCommandBuilder()
        .setName('close')
        .setDescription('Sluit het huidige support-ticket (alleen bruikbaar in een ticket-kanaal).'),

    new SlashCommandBuilder()
        .setName('license')
        .setDescription('Bekijk de status van je NotSpayys license.')
        .addStringOption((opt) =>
            opt.setName('key')
                .setDescription('Je license-key, bv. NSP-FREE-XXXX-XXXX-XXXX')
                .setRequired(true)
        ),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log(`Bezig met registreren van ${commands.length} slash-commands...`);

        // Guild-commands (deze server) i.p.v. globaal: verschijnen direct,
        // globale commands kunnen tot een uur duren voor ze overal zichtbaar zijn.
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
            { body: commands }
        );

        console.log('Slash-commands geregistreerd.');
    } catch (err) {
        console.error('Registreren van commands mislukt:', err);
        process.exit(1);
    }
})();

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

    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Toont informatie over deze Discord-server.'),

    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Toont informatie over een gebruiker.')
        .addUserOption((opt) =>
            opt.setName('gebruiker').setDescription('Wie wil je bekijken? (standaard: jezelf)').setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Toont de avatar van een gebruiker.')
        .addUserOption((opt) =>
            opt.setName('gebruiker').setDescription('Wie wil je bekijken? (standaard: jezelf)').setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Hoe lang de bot al onafgebroken online is.'),

    new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Krijg een link om de bot ook op een andere server te zetten.'),

    new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Toont de serverregels.'),

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('(Staff) Plaats een aankondiging in een kanaal.')
        .addChannelOption((opt) =>
            opt.setName('kanaal').setDescription('In welk kanaal?').setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('bericht').setDescription('De tekst van de aankondiging').setRequired(true)
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

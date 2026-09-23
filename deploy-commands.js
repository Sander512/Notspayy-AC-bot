// Eenmalig (en na elke wijziging aan een command) uitvoeren:
//   npm run deploy-commands
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check of de bot online en responsief is.'),
    new SlashCommandBuilder().setName('support').setDescription('Open een privé support-ticket met de staff.'),
    new SlashCommandBuilder().setName('close').setDescription('Sluit het huidige support-ticket.'),
    new SlashCommandBuilder()
        .setName('license').setDescription('Bekijk de status van je NotSpayys license.')
        .addStringOption((opt) => opt.setName('key').setDescription('Je license-key').setRequired(true)),

    new SlashCommandBuilder().setName('serverinfo').setDescription('Toont informatie over deze Discord-server.'),
    new SlashCommandBuilder()
        .setName('userinfo').setDescription('Toont informatie over een gebruiker.')
        .addUserOption((opt) => opt.setName('gebruiker').setDescription('Wie? (standaard: jezelf)').setRequired(false)),
    new SlashCommandBuilder()
        .setName('avatar').setDescription('Toont de avatar van een gebruiker.')
        .addUserOption((opt) => opt.setName('gebruiker').setDescription('Wie? (standaard: jezelf)').setRequired(false)),
    new SlashCommandBuilder().setName('uptime').setDescription('Hoe lang de bot al onafgebroken online is.'),
    new SlashCommandBuilder().setName('invite').setDescription('Link om de bot ook op een andere server te zetten.'),
    new SlashCommandBuilder().setName('rules').setDescription('Toont de serverregels.'),
    new SlashCommandBuilder()
        .setName('announce').setDescription('(Staff) Plaats een aankondiging in een kanaal.')
        .addChannelOption((opt) => opt.setName('kanaal').setDescription('In welk kanaal?').setRequired(true))
        .addStringOption((opt) => opt.setName('bericht').setDescription('De tekst').setRequired(true)),

    new SlashCommandBuilder()
        .setName('link').setDescription('(Staff) Koppel deze Discord-server aan een NotSpayys license.')
        .addStringOption((opt) => opt.setName('key').setDescription('Je license-key').setRequired(true)),
    new SlashCommandBuilder().setName('detections').setDescription('Toont recente anti-cheat detecties van je gekoppelde server.'),
    new SlashCommandBuilder().setName('bans').setDescription('Toont actieve bans van je gekoppelde server.'),
    new SlashCommandBuilder().setName('acstats').setDescription('Snelle statistieken van je gekoppelde server.'),

    new SlashCommandBuilder()
        .setName('setwelcome').setDescription('(Staff) Stel het welkomstbericht in voor deze server.')
        .addChannelOption((opt) => opt.setName('kanaal').setDescription('Welkomstkanaal').setRequired(false))
        .addStringOption((opt) => opt.setName('bericht').setDescription('Tekst, met {user} {username} {membercount} {server}').setRequired(false))
        .addBooleanOption((opt) => opt.setName('aan').setDescription('Aan of uit (standaard: aan)').setRequired(false)),
    new SlashCommandBuilder()
        .setName('setsupport').setDescription('(Staff) Stel support-tickets in voor deze server.')
        .addChannelOption((opt) => opt.setName('categorie').setDescription('Categorie voor ticket-kanalen').setRequired(false))
        .addRoleOption((opt) => opt.setName('staffrol').setDescription('Rol die toegang krijgt tot elk ticket').setRequired(false))
        .addBooleanOption((opt) => opt.setName('aan').setDescription('Aan of uit (standaard: aan)').setRequired(false)),
    new SlashCommandBuilder()
        .setName('setrules').setDescription('(Staff) Stel de serverregels in voor het /rules-commando.')
        .addStringOption((opt) => opt.setName('tekst').setDescription('De serverregels').setRequired(true)),

    new SlashCommandBuilder()
        .setName('kick').setDescription('(Staff) Kick een lid van de server.')
        .addUserOption((opt) => opt.setName('gebruiker').setDescription('Wie?').setRequired(true))
        .addStringOption((opt) => opt.setName('reden').setDescription('Reden').setRequired(false)),
    new SlashCommandBuilder()
        .setName('ban').setDescription('(Staff) Ban een lid van de server.')
        .addUserOption((opt) => opt.setName('gebruiker').setDescription('Wie?').setRequired(true))
        .addStringOption((opt) => opt.setName('reden').setDescription('Reden').setRequired(false)),
    new SlashCommandBuilder()
        .setName('timeout').setDescription('(Staff) Geef een lid een tijdelijke timeout.')
        .addUserOption((opt) => opt.setName('gebruiker').setDescription('Wie?').setRequired(true))
        .addIntegerOption((opt) => opt.setName('minuten').setDescription('Hoe lang, in minuten').setRequired(true))
        .addStringOption((opt) => opt.setName('reden').setDescription('Reden').setRequired(false)),
    new SlashCommandBuilder()
        .setName('clear').setDescription('(Staff) Verwijder meerdere berichten in bulk.')
        .addIntegerOption((opt) => opt.setName('aantal').setDescription('Aantal berichten (max 100)').setRequired(true)),

    new SlashCommandBuilder()
        .setName('poll').setDescription('Start een poll met reacties.')
        .addStringOption((opt) => opt.setName('vraag').setDescription('De vraag').setRequired(true))
        .addStringOption((opt) => opt.setName('optie1').setDescription('Optie 1').setRequired(true))
        .addStringOption((opt) => opt.setName('optie2').setDescription('Optie 2').setRequired(true))
        .addStringOption((opt) => opt.setName('optie3').setDescription('Optie 3').setRequired(false))
        .addStringOption((opt) => opt.setName('optie4').setDescription('Optie 4').setRequired(false))
        .addStringOption((opt) => opt.setName('optie5').setDescription('Optie 5').setRequired(false)),
    new SlashCommandBuilder()
        .setName('remind').setDescription('Stel een herinnering in.')
        .addIntegerOption((opt) => opt.setName('minuten').setDescription('Over hoeveel minuten?').setRequired(true))
        .addStringOption((opt) => opt.setName('bericht').setDescription('Waar wil je aan herinnerd worden?').setRequired(true)),
    new SlashCommandBuilder().setName('coinflip').setDescription('Gooi een muntje op.'),
    new SlashCommandBuilder()
        .setName('8ball').setDescription('Stel de magische 8-ball een vraag.')
        .addStringOption((opt) => opt.setName('vraag').setDescription('Je vraag').setRequired(true)),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log(`Bezig met globaal registreren van ${commands.length} slash-commands...`);
        console.log('(Globale commands kunnen tot ~1 uur duren voor ze overal zichtbaar zijn.)');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );

        console.log('Slash-commands geregistreerd (globaal — werken op elke server met de bot).');
    } catch (err) {
        console.error('Registreren van commands mislukt:', err);
        process.exit(1);
    }
})();

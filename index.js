require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const REQUIRED_ENV = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(`Ontbrekende environment-variabelen: ${missing.join(', ')}. Kopieer .env.example naar .env.`);
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // nodig voor het welkomstbericht (guildMemberAdd)
        GatewayIntentBits.GuildMessages,
    ],
});

// ---------------------------------------------------------------
// Commands laden
// ---------------------------------------------------------------
client.commands = new Collection();
const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir).filter((f) => f.endsWith('.js'))) {
    const command = require(path.join(commandsDir, file));
    client.commands.set(command.name, command);
}

// ---------------------------------------------------------------
// Events laden
// ---------------------------------------------------------------
const eventsDir = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsDir).filter((f) => f.endsWith('.js'))) {
    const event = require(path.join(eventsDir, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// ---------------------------------------------------------------
// Nette foutafhandeling: één stuk gefaalde code mag de bot niet laten crashen
// ---------------------------------------------------------------
process.on('unhandledRejection', (err) => {
    console.error('[unhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
});

client.login(process.env.DISCORD_BOT_TOKEN);

const { EmbedBuilder } = require('discord.js');

const STATUS_COLORS = { active: 0x4FE3A8, suspended: 0xE8B84B, revoked: 0xFF6A5C };

module.exports = {
    name: 'license',
    async execute(interaction) {
        const key = interaction.options.getString('key');
        const apiUrl = process.env.NOTSPAYYS_API_URL;

        if (!apiUrl) {
            return interaction.reply({ content: 'Deze functie is nog niet ingesteld (NOTSPAYYS_API_URL ontbreekt).', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const res = await fetch(`${apiUrl}/licenses/lookup/${encodeURIComponent(key)}`);
            if (res.status === 404) {
                return interaction.editReply('Geen license gevonden met deze key.');
            }
            if (!res.ok) {
                return interaction.editReply('Kon de license-status niet ophalen, probeer het later opnieuw.');
            }

            const { license } = await res.json();
            const embed = new EmbedBuilder()
                .setTitle('License-status')
                .setColor(STATUS_COLORS[license.status] || 0x5B9DFF)
                .addFields(
                    { name: 'Key', value: `\`${license.license_key}\``, inline: false },
                    { name: 'Status', value: license.status, inline: true },
                    { name: 'Server', value: license.server_name || 'Nog niet gekoppeld', inline: true },
                    { name: 'Laatst gezien', value: license.last_seen_at ? new Date(license.last_seen_at).toLocaleString('nl-NL') : 'Nooit', inline: false },
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[license] fout bij ophalen:', err.message);
            await interaction.editReply('Er ging iets mis bij het ophalen van de license-status.');
        }
    },
};

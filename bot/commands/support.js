const {
    ChannelType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require('discord.js');

function ticketChannelName(user) {
    return `ticket-${user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 90);
}

module.exports = {
    name: 'support',
    async execute(interaction) {
        const categoryId = process.env.SUPPORT_CATEGORY_ID;
        const staffRoleId = process.env.SUPPORT_STAFF_ROLE_ID;

        if (!categoryId) {
            return interaction.reply({ content: 'Support-tickets zijn nog niet ingesteld (SUPPORT_CATEGORY_ID ontbreekt).', ephemeral: true });
        }

        const guild = interaction.guild;
        const desiredName = ticketChannelName(interaction.user);

        // voorkom dubbele open tickets van dezelfde persoon
        const existing = guild.channels.cache.find((c) => c.parentId === categoryId && c.name === desiredName);
        if (existing) {
            return interaction.reply({ content: `Je hebt al een open ticket: ${existing}`, ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const overwrites = [
            { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
            },
            {
                id: interaction.client.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels],
            },
        ];

        if (staffRoleId) {
            overwrites.push({
                id: staffRoleId,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
            });
        }

        const channel = await guild.channels.create({
            name: desiredName,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: overwrites,
        });

        const embed = new EmbedBuilder()
            .setTitle('NotSpayys Support')
            .setDescription(`Hoi ${interaction.user}, beschrijf hieronder waar we mee kunnen helpen. Een staff-lid sluit zich hier zo snel mogelijk bij aan.`)
            .setColor(0x4FE3A8);

        const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Ticket sluiten').setStyle(ButtonStyle.Danger)
        );

        await channel.send({
            content: staffRoleId ? `<@&${staffRoleId}>` : undefined,
            embeds: [embed],
            components: [closeButton],
        });

        await interaction.editReply(`Je ticket is aangemaakt: ${channel}`);
    },
};

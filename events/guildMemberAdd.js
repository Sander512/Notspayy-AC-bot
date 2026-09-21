module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channelId = process.env.WELCOME_CHANNEL_ID;
        if (!channelId) return;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) return;

        const template = process.env.WELCOME_MESSAGE ||
            'Welkom {user} op **{server}**!';

        const message = template
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{username}/g, member.user.username)
            .replace(/{membercount}/g, member.guild.memberCount)
            .replace(/{server}/g, member.guild.name);

        try {
            await channel.send({ content: message });
        } catch (err) {
            console.error('[welcome] kon welkomstbericht niet versturen:', err.message);
        }
    },
};

const { getSettings } = require('../settings');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const settings = await getSettings(member.guild.id);
        if (!settings.welcome_enabled || !settings.welcome_channel_id) return;

        const channel = member.guild.channels.cache.get(settings.welcome_channel_id);
        if (!channel || !channel.isTextBased()) return;

        const template = settings.welcome_message || 'Welkom {user} op **{server}**!';
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

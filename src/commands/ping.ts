const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	    	.setName('ping')
		    .setDescription('Replies with Pong!'),
	async execute(interaction)
    {
        // interaction.client => access to discord client
		await interaction.reply('Pong!');
	}
};
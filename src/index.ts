// bot link: https://discord.com/api/oauth2/authorize?client_id=823229238350053406&permissions=268520496&scope=applications.commands%20bot

// load config.json from CLI arguments
const { program } = require('commander')
const path = require('node:path');

program 
	.name('outlet')
	.description('discord bot for news')
	.requiredOption('-c, --config <string>')
program.parse()

const options = program.opts();

const config = require(path.join(process.cwd(),options.config))

const { Client, Collection, Intents } = require('discord.js');

// discord.js stack
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// setup client
// [] attach commands to the client
client.commands = new Collection();

const cjson = []

for (let cid of [ 'ping' ])
{
	let cfile = path.join(__dirname,'commands',cid + '.js');
	
	console.log(".. loading command handler for " + cid + ' (' + cfile + ')');

	const chdl = require(cfile);
	client.commands.set(cid, chdl);
	cjson.push(chdl.data.toJSON());
}

// [] register commands to discord api
console.log(".. deploying commands");

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest.put(Routes.applicationGuildCommands(config.discord.client, config.discord.guild), { body: cjson })
	.then(() => console.log('[ok] registered application commands'))
	.catch(console.error);

// [] load all event handlers
for (let eid of [ 'ready', 'interactionCreate' ])
{
	let efile = path.join(__dirname,'events',eid + '.js');
	console.log(".. loading event handler for " + eid + ' (' + efile + ')');

	const ehdl = require(efile);
	if (ehdl.once)
	{
		client.once(ehdl.name, (...args) => ehdl.execute(...args));
	}
	else
	{
		client.on(ehdl.name, (...args) => ehdl.execute(...args));
	}
}

// login to discord
client.login(config.discord.token);

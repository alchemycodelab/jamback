/* eslint-disable no-console */
// To install Discord.JS and Erela.JS, run:
// npm install discord.js erela.js
const { Client, GatewayIntentBits } = require('discord.js');
const { Manager } = require('erela.js');
const play = require('./lib/commands/play');
const search = require('./lib/commands/search');

if (!process.env.DISCORD_BOT_TOKEN) {
  console.log('Please remember to add your token to the .env file');
  return;
}

// Initialize the Discord.JS Client.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initiate the Manager with some options and listen to some events.
client.manager = new Manager({
  // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
  nodes: [
    // If you pass a object like so the "host" property is required
    {
      host: process.env.LL_HOST, // Optional if Lavalink is local
      port: Number(process.env.LL_PORT), // Optional if Lavalink is set to default
      password: process.env.LL_PASSWORD, // Optional if Lavalink is set to default
      secure: Boolean(process.env.LL_SECURE),
    },
  ],
  // A send method to send data to the Discord WebSocket using your library.
  // Getting the shard for the guild and sending the data to the WebSocket.
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
  .on('nodeConnect', (node) =>
    console.log(`Node ${node.options.identifier} connected`)
  )
  .on('nodeError', (node, error) =>
    console.log(
      `Node ${node.options.identifier} had an error: ${error.message}`
    )
  )
  .on('trackStart', (player, track) => {
    client.channels.cache
      .get(player.textChannel)
      .send(`Now playing: ${track.title}`);
  })
  .on('queueEnd', (player) => {
    client.channels.cache.get(player.textChannel).send('Queue has ended.');

    player.destroy();
  });

// Ready event fires when the Discord.JS client is ready.
// Use EventEmitter#once() so it only fires once.
client.once('ready', () => {
  console.log('I am ready!');
  // Initiate the manager.
  client.manager.init(client.user.id);
});

// Here we send voice data to lavalink whenever the bot joins a voice channel to play audio in the channel.
client.on('raw', (d) => client.manager.updateVoiceState(d));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case 'play':
      await play(client, interaction);
      break;
    case 'search':
      await search(client, interaction);
      break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

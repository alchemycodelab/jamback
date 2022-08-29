/* eslint-disable no-console */
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'play',
    description: 'Searches lavalink for your song',
  },
  {
    name: 'myplay',
    description: 'Searches through JamBots internal database to play your song'
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

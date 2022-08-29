const { SlashCommandBuilder } = require('discord.js');

/* eslint-disable no-console */
const { REST, Routes } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Searches lavalink for your song')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Song Title and/or Artist')
        .setRequired(true)
    ),

  // {
  //   name: 'myplay',
  //   description: 'Searches through JamBots internal database to play your song',
  // },
];

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

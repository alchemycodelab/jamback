const { SlashCommandBuilder } = require('discord.js');

/* eslint-disable no-console */
const { REST, Routes } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('searches for a song and plays the first result')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('Song Title and/or Artist')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('result')
        .setDescription('plays a song from a search result by id')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('id from a previous search result')
            .setRequired(true)
        )
    ),
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches for your song and gives the list of results')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('song Title and/or Artist')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('interact with saved playlists')
    .addSubcommand((subcommand) => 
      subcommand 
        .setName('create')
        .setDescription('creates a new playlist')
        .addStringOption((option) => 
          option
            .setName('name')
            .setDescription('the name of your new playlist')
            .setRequired(true))
    )
    .addSubcommand((subcommand) => 
      subcommand
        .setName('delete')
        .setDescription('deletes a playlist by name')
        .addStringOption((option) => 
          option
            .setName('name')
            .setDescription('name of the playlist you want deleted')
            .setRequired(true))
    )


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

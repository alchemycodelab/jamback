/* eslint-disable no-console */
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lucky')
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
        .setName('song')
        .setDescription('plays a song from the library')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('song title')
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
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('deletes a playlist by name')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('name of the playlist you want deleted')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add-song')
        .setDescription('adds song to playlist by id')
        .addStringOption((option) =>
          option
            .setName('playlist_name')
            .setDescription('name of playlist')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('song_id')
            .setDescription('id of song to be added')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove-song')
        .setDescription('remove a song from a playlist by id')
        .addStringOption((option) =>
          option
            .setName('playlist_name')
            .setDescription('name of playlist')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('song_id')
            .setDescription('id of song to be removed')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('view')
        .setDescription('view a saved playlist')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('name of playlist to be viewed')
            .setRequired(true)
        )
    ),
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

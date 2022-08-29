const SearchResult = require('../models/SearchResult');

module.exports = async function play(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'search':
      await subcommandSearch(client, interaction);
      break;
    case 'result':
      await subcommandResult(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command play');
  }
};

async function subcommandSearch(client, interaction) {
  // Note: This example only works for retrieving tracks using a query, such as "Rick Astley - Never Gonna Give You Up".

  // Retrieves tracks with your query and the requester of the tracks.
  // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
  // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
  const query = interaction.options.getString('query');

  const res = await client.manager.search(query, interaction.user);

  if (!interaction.member.voice.channel) {
    interaction.reply('Please join a voice channel to play music.');
    return;
  }

  // Create a new player. This will return the player if it already exists.
  const player = client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  // Connect to the voice channel.
  player.connect();

  // Adds the first track to the queue.
  player.queue.add(res.tracks[0]);
  interaction.reply(`Enqueuing track ${res.tracks[0].title}.`);

  // Plays the player (plays the first track in the queue).
  // The if statement is needed else it will play the current track again
  if (!player.playing && !player.paused && !player.queue.size)
    player.play();

  // For playlists you'll have to use slightly different if statement
  if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
    player.play();
}

async function subcommandResult(client, interaction) {
  const id = interaction.options.getString('id');
  const searchResult = await SearchResult.getById(id);

  const res = await client.manager.search(searchResult.uri, interaction.user);

  if (!interaction.member.voice.channel) {
    interaction.reply('Please join a voice channel to play music.');
    return;
  }

  // Create a new player. This will return the player if it already exists.
  const player = client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  // Connect to the voice channel.
  player.connect();

  // Adds the first track to the queue.
  player.queue.add(res.tracks[0]);
  interaction.reply(`Enqueuing track ${res.tracks[0].title}.`);

  // Plays the player (plays the first track in the queue).
  // The if statement is needed else it will play the current track again
  if (!player.playing && !player.paused && !player.queue.size)
    player.play();

  // For playlists you'll have to use slightly different if statement
  if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
    player.play();
}

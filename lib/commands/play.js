const { ButtonBuilder, ButtonStyle } = require('discord.js');
const Song = require('../models/Song');
const { PagedReply } = require('../utils/PagedReply');
const { serializeTrack, deserializeTrack } = require('../utils/tracks');

module.exports = async function play(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'lucky':
      await subcommandLucky(client, interaction);
      break;
    case 'song':
      await subcommandSong(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command play');
  }
};

async function subcommandLucky(client, interaction) {
  const query = interaction.options.getString('query');

  // Retrieves tracks with your query and the requester of the tracks.
  // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
  // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
  const response = await client.manager.search(query, interaction.user);
  const track = response.tracks[0];

  playTrack(track, interaction);
}

async function subcommandSong(client, interaction) {
  const songTitle = interaction.options.getString('title');

  const returnedSongs = (await Song.getByTitle(songTitle)).slice(0, 5);

  const messageContentSupplier = (pageIndex) => {
    const track = returnedSongs[pageIndex];

    let message = '';
    message += '**title:**\n';
    message += `    ${track.title}\n`;
    message += '**author:**\n';
    message += `    ${track.author}\n`;

    return message;
  };

  const buttons = [
    new ButtonBuilder()
      .setCustomId('play')
      .setLabel('Play')
      .setStyle(ButtonStyle.Primary),
  ];

  const onButtonPressed = async (interaction, pageIndex) => {
    switch (interaction.customId) {
      case 'play': {
        const song = returnedSongs[pageIndex];
        const track = deserializeTrack(song.data);
        await playTrack(track, interaction);
        return true;
      }
    }
  };

  const pagedReply = new PagedReply()
    .setNumberOfPages(returnedSongs.length)
    .messageContentSupplier(messageContentSupplier)
    .setButtons(buttons)
    .onButtonPressed(onButtonPressed)
    .setEphemeral(true)
    .setIdleTimeout(45_000);

  await pagedReply.reply(interaction);
}

function playTrack(track, interaction) {
  if (!interaction.member.voice.channel) {
    interaction.reply({
      content: 'Please join a voice channel to play music.',
      ephemeral: true,
    });
    return;
  }

  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();

  // Adds the first track to the queue.
  player.queue.add(track);
  interaction.reply(`Enqueuing track ${track.title}.`);

  // Plays the player (plays the first track in the queue).
  // The if statement is needed else it will play the current track again
  if (!player.playing && !player.paused && !player.queue.size) player.play();
}

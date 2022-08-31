const { ButtonBuilder, ButtonStyle } = require('discord.js');
const Song = require('../models/Song');
const { PagedReply } = require('../utils/PagedReply');
const { deserializeTrack } = require('../utils/tracks');

module.exports = async function library(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'search':
      await subcommandSearch(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command library');
  }
};

async function subcommandSearch(client, interaction) {
  const query = interaction.options.getString('query');

  const returnedSongs = await Song.getByTitle(query);

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
      .setStyle(ButtonStyle.Primary)
  ];

  const onButtonPressed = async (interaction, pageIndex) => {
    switch (interaction.customId) {
      case 'play': {
        const song = returnedSongs[pageIndex];
        const track = deserializeTrack(song.data);
        const success = await playTrack(track, interaction);
        return success;
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
    return false;
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

  return true;
}

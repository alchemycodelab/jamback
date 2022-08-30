const { ButtonBuilder, ButtonStyle } = require("discord.js");
const Song = require("../models/Song");
const { PagedReply } = require("../utils/PagedReply");

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
  if (!player.playing && !player.paused && !player.queue.size) player.play();

  // For playlists you'll have to use slightly different if statement
  if (
    !player.playing &&
    !player.paused &&
    player.queue.totalSize === res.tracks.length
  )
    player.play();
}

async function subcommandSong(client, interaction) {
  const songTitle = interaction.options.getString('title');

  const returnedSongs = (await Song.getByTitle(songTitle)).slice(0, 5);

  const messageContentSupplier = (index) => {
    const track = returnedSongs[index];

    let message = '';
    message += '**title:**\n';
    message += `    ${track.title}\n`;
    message += '**author:**\n';
    message += `    ${track.author}\n`;

    return message;
  };

  const onButtonPressed = async (interaction, pageIndex) => {
    
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

const buttons = [
  new ButtonBuilder()
    .setCustomId('play')
    .setLabel('Play')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('save')
    .setLabel('Save')
    .setStyle(ButtonStyle.Primary),
];

function handlePlay(track, interaction) {
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

  return false;
}

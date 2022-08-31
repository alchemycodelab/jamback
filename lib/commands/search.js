const { ButtonBuilder, ButtonStyle, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const { PagedReply } = require('../utils/PagedReply');
const { serializeTrack } = require('../utils/tracks');

module.exports = async function search(client, interaction) {
  // Get the user input
  const query = interaction.options.getString('query');

  // Get some search results from the lavalink instance.
  const tracks = (
    await client.manager.search(query, interaction.user)
  ).tracks.slice(0, 5);

  const messageContentSupplier = (index) => {
    const track = tracks[index];

    let message = '';
    message += '**title:**\n';
    message += `    ${track.title}\n`;
    message += '**author:**\n';
    message += `    ${track.author}\n`;

    return message;
  };

  const onButtonPressed = async (interaction, pageIndex) => {
    switch (interaction.customId) {
      case 'play':
        return handlePlay(tracks[pageIndex], interaction);
      case 'save':
        return await handleSave(tracks[pageIndex], interaction);
      case 'add-to-playlist':
        return await handleAddToPlaylist(tracks[pageIndex], interaction);
    }
  };

  const pagedReply = new PagedReply()
    .setNumberOfPages(tracks.length)
    .messageContentSupplier(messageContentSupplier)
    .setButtons(buttons)
    .onButtonPressed(onButtonPressed)
    .setEphemeral(true)
    .setIdleTimeout(45_000);

  await pagedReply.reply(interaction);
};

const buttons = [
  new ButtonBuilder()
    .setCustomId('play')
    .setLabel('Play')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('save')
    .setLabel('Save')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('add-to-playlist')
    .setLabel('Add to Playlist')
    .setStyle(ButtonStyle.Primary)
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

async function handleSave(track, interaction) {
  try {
    const data = serializeTrack(track);
    const addedSong = await Song.insert(data, track);
    interaction.reply({
      content: `${addedSong.title} has been added to the library under id ${addedSong.id}.`,
      ephemeral: true,
    });
  } catch {
    interaction.reply({
      content: 'Something went wrong; please try again.',
      ephemeral: true,
    });
  }
  return false;
}

async function handleAddToPlaylist(track, interaction) {
  const playlists = await Playlist.getAll();

  const options = [];
  for(let i = 0; i < playlists.length; ++i) {
    const playlist = playlists[i];
    options.push({
      label: playlist.name,
      value: String(i)
    });
  }

  const row = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .addOptions(...options)
    );

  const reply = await interaction.reply({
    content: 'Please pick a playlist.',
    components: [row],
    ephemeral: true,
    fetchReply: true
  });

  let selectMenuInteraction;
  try {
    selectMenuInteraction = await reply.awaitMessageComponent({
      componentType: ComponentType.SelectMenu
    });
  } catch {
    return;
  }

  const data = serializeTrack(track);
  const song = await Song.insert(data, track);

  const playlistIndex = Number(selectMenuInteraction.values[0]);
  const playlist = playlists[playlistIndex];

  await playlist.addSongById(song.id);

  selectMenuInteraction.reply({
    content: `Successfully added ${song.title} to playlist ${playlist.name}`,
    ephemeral: true
  });
}

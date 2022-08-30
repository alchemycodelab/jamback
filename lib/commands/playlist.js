const Playlist = require('../models/Playlist');
const SearchResult = require('../models/SearchResult');
const Song = require('../models/Song');

module.exports = async function playlist(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'create':
      await subcommandCreate(client, interaction);
      break;
    case 'delete':
      await subcommandDelete(client, interaction);
      break;
    case 'add-song':
      await subcommandAddSong(client, interaction);
      break;
    case 'remove-song':
      await subcommandRemoveSong(client, interaction);
      break;
    case 'view':
      await subcommandView(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command playlist');
  }
};

async function subcommandCreate(client, interaction) {
  const name = interaction.options.getString('name');
  try {
    const newPlaylist = await Playlist.insert(name);

    interaction.reply(
      `Your playlist ${newPlaylist.name} was successfully created`
    );
  } catch (e) {
    interaction.reply('Something went wrong, please try again');
  }
}

async function subcommandDelete(client, interaction) {
  const name = interaction.options.getString('name');

  try {
    const deletePlaylist = await Playlist.delete(name);

    interaction.reply(`The playlist ${deletePlaylist.name} has been deleted`);
  } catch (e) {
    interaction.reply(
      `Something went wrong attempting to delete playlist ${name}`
    );
  }
}

async function subcommandAddSong(client, interaction) {
  try {
    const songId = interaction.options.getString('song_id');
    const song = await SearchResult.getById(songId);
    if (!song) {
      interaction.reply('No song found with this id. Please try again.');
      return;
    }
    const addedSong = await Song.insert(song);
    const playlistName = interaction.options.getString('playlist_name');
    const playlist = await Playlist.getByName(playlistName);
    playlist.addSongById(addedSong.id);

    interaction.reply(`Successfully added ${song.title} to ${playlist.name}!`);
  } catch (e) {
    interaction.reply(
      'Something went wrong trying to add this song. Please try again.'
    );
  }
}

async function subcommandView(client, interaction) {
  const playlistName = interaction.options.getString('name');
  const playlist = await Playlist.getByName(playlistName);

  let playlistString = `Viewing playlist ${playlist.name}:\n`;
  playlist.songs.forEach((song) => {
    playlistString += `id: **${song.id}** -- title: **${song.title}** -- author: **${song.author}**\n`;
  });
  interaction.reply(playlistString);
}

async function subcommandRemoveSong(client, interaction) {
  try {
    const playlistName = interaction.options.getString('playlist_name');
    const playlist = await Playlist.getByName(playlistName);
    const songId = interaction.options.getString('song_id');
    const song = await Song.getById(songId);
    await playlist.removeSongById(songId);

    interaction.reply(
      `Successfully removed ${song.title} from playlist ${playlist.name}`
    );
  } catch (e) {
    console.log(e);
    interaction.reply('Could not delete song. Please try again.');
  }
}

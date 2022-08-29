const Playlist = require('../models/Playlist');

module.exports = async function playlist(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'create':
      await subcommandCreate(client, interaction);
      break;
    case 'delete':
      await subcommandDelete(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command playlist');
  }
};

async function subcommandCreate(client, interaction) {

  const name = interaction.options.getString('name');
  try {
    const newPlaylist = await Playlist.insert(name);
        
    interaction.reply(`Your playlist ${newPlaylist.name} was successfully created`);
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
    interaction.reply(`Something went wrong attempting to delete playlist ${name}`);
  }
}

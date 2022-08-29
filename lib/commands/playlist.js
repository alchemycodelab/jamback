const Playlist = require('../models/Playlist');

module.exports = async function playlist(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'create':
      await subcommandCreate(client, interaction);
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

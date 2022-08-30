const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { PagedReply } = require('../utils/PagedReply');

module.exports = async function search(client, interaction) {
  // Get the user input
  const query = interaction.options.getString('query');

  // Get some search results from the lavalink instance.
  const tracks = (await client.manager.search(query, interaction.user)).tracks.slice(0, 5);

  const messageContentSupplier = (index) => {
    const track = tracks[index];

    let message = '';
    message += '**title:**\n';
    message += `    ${track.title}\n`;
    message += '**author:**\n';
    message += `    ${track.author}\n`;

    return message;
  };

  const onButtonPressed = (interaction, pageIndex) => {
    switch (interaction.customId) {
      case 'play':
        return handlePlay(tracks[pageIndex], interaction);
      case 'save':
        // TODO: implement saving a song
        interaction.reply({ content: `saving ${pageIndex}...`, ephemeral: true });
        return true;
    }
  };

  const pagedReply = new PagedReply()
    .setNumberOfPages(tracks.length)
    .messageContentSupplier(messageContentSupplier)
    .setButtons(buttons)
    .onButtonPressed(onButtonPressed)
    .setEphemeral(true)
    .setIdleTimeout(30_000);

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
    .setStyle(ButtonStyle.Primary)
];

function handlePlay(track, interaction) {
  if (!interaction.member.voice.channel) {
    interaction.reply('Please join a voice channel to play music.');
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
  if (!player.playing && !player.paused && !player.queue.size)
    player.play();

  return true;
}

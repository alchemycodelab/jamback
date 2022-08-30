module.exports = function queue(client, interaction) {
  switch(interaction.options.getSubcommand()) {
    case 'clear':
      subcommandClear(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command queue');
  }
};

function subcommandClear(client, interaction) {
  if (!interaction.member.voice.channel) {
    interaction.reply({
      content: 'Please join a voice channel to interact with the queue.',
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
  player.queue.clear();
  interaction.reply('The queue has been cleared!');
}

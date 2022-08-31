module.exports = function queue(client, interaction) {
  if (!interaction.member.voice.channel) {
    interaction.reply({
      content: 'Please join a voice channel to interact with the queue.',
      ephemeral: true,
    });
    return;
  }

  switch (interaction.options.getSubcommand()) {
    case 'clear':
      subcommandClear(client, interaction);
      break;
    case 'pause':
      subcommandPause(client, interaction);
      break;
    case 'play':
      subcommandPlay(client, interaction);
      break;
    case 'skip':
      subcommandSkip(client, interaction);
      break;
    case 'shuffle':
      subcommandShuffle(client, interaction);
      break;
    case 'view':
      subcommandView(client, interaction);
      break;
    default:
      throw new Error('unrecognized subcommand on command queue');
  }
};

function subcommandClear(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();
  player.queue.clear();
  interaction.reply('The queue has been cleared!');
}

function subcommandPause(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();
  player.pause(true);

  interaction.reply('⏸');
}

function subcommandPlay(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();
  player.pause(false);

  interaction.reply('▶️');
}

function subcommandSkip(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();
  player.stop();

  interaction.reply('⏭');
}

function subcommandShuffle(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  player.connect();
  player.queue.shuffle();

  interaction.reply('🔀');
}

function subcommandView(client, interaction) {
  const player = interaction.client.manager.create({
    guild: interaction.guildId,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channelId,
  });

  let queueString = 'Current Queue:\n';
  player.queue.forEach((track) => {
    queueString += `title: **${track.title}** --- author: **${track.author}**\n`;
  });

  interaction.reply(queueString);
}

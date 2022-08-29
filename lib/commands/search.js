const SearchResult = require('../models/SearchResult');

module.exports = async function search(client, interaction) {
  const query = interaction.options.getString('query');

  const res = await client.manager.search(query, interaction.user);
  const results = await Promise.all(
    res.tracks.slice(0, 5).map((track) => SearchResult.insert(track))
  );
  // add instructions in search results?
  // make the results clickable? (dope ass stretch goal)
  let resultString = 'Your search results:\n';
  results.forEach((result) => {
    resultString += `id: ${result.id}  title: ${result.title}  author: ${result.author}\n`;
  });
  interaction.channel.send(resultString);
};

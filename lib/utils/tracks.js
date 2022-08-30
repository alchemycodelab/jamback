const { TrackUtils } = require('erela.js');

function getDataFromTrack(track) {
  const data = {
    track: track.track,
    info: {
      title: track.title,
      identifier: track.identifier,
      author: track.author,
      length: track.duration,
      isSeekable: track.isSeekable,
      isStream: track.isStream,
      uri: track.uri
    },
    requester: track.requester
  };

  return data;
}

function buildTrackFromData(data) {
  const track = TrackUtils.build(data, data.requester);

  return track;
}

module.exports = { getDataFromTrack, buildTrackFromData };


//   const track: Track = {
//     track: data.track,
//     title: data.info.title,
//     identifier: data.info.identifier,
//     author: data.info.author,
//     duration: data.info.length,
//     isSeekable: data.info.isSeekable,
//     isStream: data.info.isStream,
//     uri: data.info.uri,
//     thumbnail: data.info.uri.includes("youtube")
//       ? `https://img.youtube.com/vi/${data.info.identifier}/default.jpg`
//       : null,
//     displayThumbnail(size = "default"): string | null {
//       const finalSize = SIZES.find((s) => s === size) ?? "default";
//       return this.uri.includes("youtube")
//         ? `https://img.youtube.com/vi/${data.info.identifier}/${finalSize}.jpg`
//         : null;
//     },
//     requester,
//   };

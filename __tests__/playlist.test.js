const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Playlist = require('../lib/models/Playlist');
// const request = require('supertest');
// const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Song.getByTitle should return an array of songs with title roughly matching parameter', async () => {
    const playlist = await Playlist.insert('A new playlist');
    expect(playlist).toEqual({
      id: expect.any(String),
      ...playlist,
    });
  });
  it('delete playlist should remove a playlist by name', async () => {
    const playlistToDelete = 'Rainy Mix';
    const resp = await Playlist.delete(playlistToDelete);

    expect(resp).toEqual({
      id: expect.any(String),
      name: playlistToDelete,
      songs: expect.any(Array),
    });
  });
  it('gets playlist by name', async () => {
    const resp = await Playlist.getByName('Rainy Mix');
    expect(resp).toEqual({
      id: expect.any(String),
      name: 'Rainy Mix',
      songs: expect.any(Array),
    });
  });
  it('adds instance to playlists_songs join table', async () => {
    let playlist = await Playlist.getByName('Rainy Mix');

    await playlist.addSongById(1);

    playlist = await Playlist.getByName('Rainy Mix');
    expect(playlist.songs).toContainEqual({
      id: 1,
      title: 'Good Times',
      author: expect.any(String),
      uri: expect.any(String),
    });
  });
  afterAll(() => {
    pool.end();
  });
});

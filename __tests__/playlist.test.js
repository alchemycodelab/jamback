const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Playlist = require('../lib/models/Playlist');
// const request = require('supertest');
// const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Song.findByTitle should return an array of songs with title roughly matching parameter', async () => {
    const playlist = await Playlist.insert('A new playlist');
    expect(playlist).toEqual({
      id: expect.any(String),
      ...playlist
    });
  });
  afterAll(() => {
    pool.end();
  });
});

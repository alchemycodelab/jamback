const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Song = require('../lib/models/Song');
// const request = require('supertest');
// const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Song.findByTitle should return an array of songs with title roughly matching parameter', async () => {
    const songs = await Song.findByTitle('Light');
    expect(songs).toEqual([
      {
        id: expect.any(String),
        title: 'Little Lights',
        artist: 'Punch Brothers',
      },
    ]);
  });
  afterAll(() => {
    pool.end();
  });
});

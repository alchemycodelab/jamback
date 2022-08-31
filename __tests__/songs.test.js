const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Song = require('../lib/models/Song');
// const request = require('supertest');
// const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  // it('Song.getByTitle should return an array of songs with title roughly matching parameter', async () => {
  //   const songs = await Song.getByTitle('Light');
  //   expect(songs).toEqual([
  //     {
  //       id: expect.any(String),
  //       title: 'Little Lights',
  //       author: 'Punch Brothers',
  //       uri: expect.any(String),
  //     },
  //   ]);
  // });
  it('insert adds new song to songs table', async () => {
    const newSong = {
      title: 'Oh Happy Day',
      author: 'A Great Band',
      uri: 'youtube.com/asong',
    };

    const songs = await Song.insert('', newSong);
    expect(songs).toEqual({
      id: expect.any(String),
      data: expect.any(String),
      ...newSong,
    });
  });
  it('song.getById returns a song with id matching argument', async () => {
    const song = await Song.getById(3);
    expect(song).toEqual({
      id: '3',
      title: expect.any(String),
      author: expect.any(String),
      uri: expect.any(String),
      data: expect.any(String)
    });
  });
  afterAll(() => {
    pool.end();
  });
});

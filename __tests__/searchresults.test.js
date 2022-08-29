const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const SearchResult = require('../lib/models/SearchResult');
// const request = require('supertest');
// const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Song.findByTitle should return an array of songs with title roughly matching parameter', async () => {
    const result = await SearchResult.insert({
      title: 'Autoclave',
      author: 'the Mountain Goats',
      uri: 'https://www.youtube.com/watch?v=jFrC1c5hbeA',
    });
    expect(result).toEqual({
      id: expect.any(String),
      ...result,
    });
  });
  afterAll(() => {
    pool.end();
  });
});

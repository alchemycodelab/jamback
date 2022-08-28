const pool = require('../utils/pool');

module.exports = class Song {
  id;
  title;
  artist;

  constructor({ id, title, artist }) {
    this.id = id;
    this.title = title;
    this.artist = artist;
  }

  static async findByTitle(title) {
    title = `%${title}%`;
    const { rows } = await pool.query(
      `SELECT * FROM songs
      WHERE title ILIKE $1`,
      [title]
    );
    return rows.map((row) => new Song(row));
  }
};
